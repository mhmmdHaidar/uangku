<?php

namespace App\Http\Controllers;

use App\Models\Budget;
use App\Models\Transaction;
use App\Models\User;
use App\Models\Wallet;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class TransactionController extends Controller
{
    /**
     * Display a listing of the resource and dashboard metrics.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        // Ensure user has default starter cash wallet
        $user->seedDefaultCashWallet();

        Wallet::preloadBalances($user->id);

        $wallets = $user->wallets()->get();

        // Base query for user's transactions
        $transactionsQuery = $user->transactions()->with(['walletAccount', 'toWalletAccount']);

        // Filters
        $type = $request->input('type');
        $walletId = $request->input('wallet_id');
        $search = $request->input('search');
        $category = $request->input('category');
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');

        if ($type && in_array($type, ['income', 'expense', 'transfer'], true)) {
            $transactionsQuery->where('type', $type);
        }

        if ($walletId && $walletId !== 'all') {
            $transactionsQuery->where(function (Builder $q) use ($walletId) {
                $q->where('wallet_id', $walletId)
                    ->orWhere('to_wallet_id', $walletId);
            });
        }

        if ($search) {
            $transactionsQuery->where('title', 'like', "%{$search}%");
        }

        if ($category && $category !== 'all') {
            $transactionsQuery->where('category', $category);
        }

        if ($startDate) {
            $transactionsQuery->where('transaction_date', '>=', $startDate);
        }

        if ($endDate) {
            $transactionsQuery->where('transaction_date', '<=', $endDate);
        }

        $transactions = $transactionsQuery
            ->orderBy('transaction_date', 'desc')
            ->orderBy('id', 'desc')
            ->paginate(15)
            ->withQueryString();

        // Cashflow totals exclude internal transfers
        $totalIncome = (float) $user->transactions()->where('type', 'income')->sum('amount');
        $totalExpense = (float) $user->transactions()->where('type', 'expense')->sum('amount');

        $totalAllMoney = (float) $wallets->sum('current_balance');

        // Current month metrics (exclude internal transfers)
        $startOfMonth = Carbon::now()->startOfMonth()->toDateString();
        $endOfMonth = Carbon::now()->endOfMonth()->toDateString();

        $monthIncome = (float) $user->transactions()
            ->where('type', 'income')
            ->whereBetween('transaction_date', [$startOfMonth, $endOfMonth])
            ->sum('amount');

        $monthExpense = (float) $user->transactions()
            ->where('type', 'expense')
            ->whereBetween('transaction_date', [$startOfMonth, $endOfMonth])
            ->sum('amount');

        $existingCategories = $user->transactions()
            ->whereNotNull('category')
            ->where('category', '!=', '')
            ->distinct()
            ->pluck('category');

        $allUserTransactions = $user->transactions()
            ->with(['walletAccount', 'toWalletAccount'])
            ->orderBy('transaction_date', 'desc')
            ->orderBy('id', 'desc')
            ->get();

        return Inertia::render('Dashboard', [
            'transactions' => $transactions,
            'all_transactions' => $allUserTransactions,
            'wallets' => $wallets,
            'budgets' => Budget::progressForUser($user),
            'metrics' => [
                'total_balance' => $totalAllMoney,
                'total_income' => $totalIncome,
                'total_expense' => $totalExpense,
                'month_income' => $monthIncome,
                'month_expense' => $monthExpense,
                'month_balance' => $monthIncome - $monthExpense,
            ],
            'filters' => [
                'type' => $type ?? '',
                'wallet_id' => $walletId ?? '',
                'search' => $search ?? '',
                'category' => $category ?? '',
                'start_date' => $startDate ?? '',
                'end_date' => $endDate ?? '',
            ],
            'categories' => $existingCategories,
        ]);
    }

    /**
     * Display the full detailed transaction history page with advanced period filters & metrics.
     */
    public function history(Request $request): Response
    {
        $user = $request->user();
        $user->seedDefaultCashWallet();
        Wallet::preloadBalances($user->id);

        $wallets = $user->wallets()->get();

        $query = $user->transactions()->with(['walletAccount', 'toWalletAccount']);
        $filterState = $this->applyHistoryFilters($query, $request);

        // Summary calculations exclude internal transfers from income/expense sums
        $statsQuery = clone $query;

        $totalCount = (int) (clone $statsQuery)->count();
        $totalIncome = (float) (clone $statsQuery)->where('type', 'income')->sum('amount');
        $totalExpense = (float) (clone $statsQuery)->where('type', 'expense')->sum('amount');
        $netCashflow = $totalIncome - $totalExpense;

        $incomeCount = (int) (clone $statsQuery)->where('type', 'income')->count();
        $expenseCount = (int) (clone $statsQuery)->where('type', 'expense')->count();

        $avgExpense = $expenseCount > 0 ? round($totalExpense / $expenseCount, 2) : 0;
        $avgIncome = $incomeCount > 0 ? round($totalIncome / $incomeCount, 2) : 0;

        $topExpenseCategory = (clone $statsQuery)
            ->where('type', 'expense')
            ->whereNotNull('category')
            ->where('category', '!=', '')
            ->selectRaw('category, SUM(amount) as total_amount, COUNT(*) as count')
            ->groupBy('category')
            ->orderByDesc('total_amount')
            ->first();

        $sort = $request->input('sort', 'date_desc');
        switch ($sort) {
            case 'date_asc':
                $query->orderBy('transaction_date', 'asc')->orderBy('id', 'asc');
                break;
            case 'amount_desc':
                $query->orderBy('amount', 'desc');
                break;
            case 'amount_asc':
                $query->orderBy('amount', 'asc');
                break;
            case 'date_desc':
            default:
                $sort = 'date_desc';
                $query->orderBy('transaction_date', 'desc')->orderBy('id', 'desc');
                break;
        }

        $transactions = $query->paginate(20)->withQueryString();

        $existingCategories = $user->transactions()
            ->whereNotNull('category')
            ->where('category', '!=', '')
            ->distinct()
            ->pluck('category');

        $allUserTransactions = $user->transactions()
            ->with(['walletAccount', 'toWalletAccount'])
            ->orderBy('transaction_date', 'desc')
            ->orderBy('id', 'desc')
            ->get();

        return Inertia::render('Transaction/Index', [
            'transactions' => $transactions,
            'all_transactions' => $allUserTransactions,
            'wallets' => $wallets,
            'categories' => $existingCategories,
            'filters' => [
                ...$filterState,
                'sort' => $sort,
            ],
            'summary' => [
                'total_count' => $totalCount,
                'income_count' => $incomeCount,
                'expense_count' => $expenseCount,
                'total_income' => $totalIncome,
                'total_expense' => $totalExpense,
                'net_cashflow' => $netCashflow,
                'avg_expense' => $avgExpense,
                'avg_income' => $avgIncome,
                'top_expense_category' => $topExpenseCategory ? [
                    'name' => $topExpenseCategory->category,
                    'total' => (float) $topExpenseCategory->total_amount,
                    'count' => (int) $topExpenseCategory->count,
                ] : null,
            ],
        ]);
    }

    /**
     * Export filtered transactions to CSV with UTF-8 BOM.
     */
    public function exportCsv(Request $request): StreamedResponse
    {
        $user = $request->user();
        $query = $user->transactions()->with(['walletAccount', 'toWalletAccount']);
        $this->applyHistoryFilters($query, $request);

        $transactions = $query
            ->orderBy('transaction_date', 'desc')
            ->orderBy('id', 'desc')
            ->get();

        $filename = "Uangku_Riwayat_Transaksi_" . now()->format('Ymd_His') . ".csv";

        $headers = [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
            'Pragma' => 'no-cache',
            'Cache-Control' => 'must-revalidate, post-check=0, pre-check=0',
            'Expires' => '0',
        ];

        return response()->stream(function () use ($transactions) {
            $handle = fopen('php://output', 'w');
            fprintf($handle, chr(0xEF).chr(0xBB).chr(0xBF)); // UTF-8 BOM

            fputcsv($handle, [
                'ID Transaksi',
                'Tanggal',
                'Jenis',
                'Nominal (IDR)',
                'Dompet / Alur Dana',
                'Nomor Akun',
                'Judul Transaksi',
                'Kategori',
                'Catatan / Keterangan',
                'Waktu Input',
            ]);

            foreach ($transactions as $tx) {
                if ($tx->type === 'transfer') {
                    $typeLabel = 'Transfer Antar Dompet';
                    $fromName = $tx->walletAccount?->name ?? 'Dompet Asal';
                    $toName = $tx->toWalletAccount?->name ?? 'Dompet Tujuan';
                    $walletName = "{$fromName} -> {$toName}";
                    $accountNumber = $tx->walletAccount?->account_number ?? '-';
                } else {
                    $typeLabel = $tx->type === 'income' ? 'Pemasukan' : 'Pengeluaran';
                    $walletName = $tx->walletAccount?->name ?? 'Tanpa Dompet';
                    $accountNumber = $tx->walletAccount?->account_number ?? '-';
                }

                fputcsv($handle, [
                    'TRX-' . str_pad($tx->id, 5, '0', STR_PAD_LEFT),
                    Carbon::parse($tx->transaction_date)->format('Y-m-d'),
                    $typeLabel,
                    $tx->amount,
                    $walletName,
                    $accountNumber,
                    $tx->title,
                    $tx->category ?? '-',
                    $tx->notes ?? '-',
                    $tx->created_at ? $tx->created_at->format('Y-m-d H:i:s') : '-',
                ]);
            }

            fclose($handle);
        }, 200, $headers);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $this->validateTransactionRequest($request, false);

        if (empty($validated['transaction_date'])) {
            $validated['transaction_date'] = Carbon::today()->toDateString();
        }

        $payload = $this->resolveTransactionPayload($request->user(), $validated);
        $request->user()->transactions()->create($payload);

        $message = $payload['type'] === 'transfer'
            ? 'Transfer antar dompet berhasil dicatat'
            : 'Transaksi berhasil disimpan';

        return redirect()->back()->with('success', $message);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Transaction $transaction)
    {
        if ($transaction->user_id !== $request->user()->id) {
            abort(403, 'Akses tidak diizinkan.');
        }

        $validated = $this->validateTransactionRequest($request, true);

        $payload = $this->resolveTransactionPayload($request->user(), $validated);
        $transaction->update($payload);

        return redirect()->back()->with('success', 'Transaksi berhasil diperbarui');
    }

    /**
     * Validate store/update payload cleanly with transfer-only rules for `to_wallet_id`.
     *
     * @return array<string, mixed>
     */
    private function validateTransactionRequest(Request $request, bool $requireDate): array
    {
        $isTransfer = $request->input('type') === 'transfer';

        return $request->validate([
            'title' => 'required|string|max:255',
            'type' => 'required|in:income,expense,transfer',
            'wallet' => 'nullable|in:saldo,cash',
            'wallet_id' => 'nullable|exists:wallets,id',
            'to_wallet_id' => $isTransfer
                ? 'required|exists:wallets,id|different:wallet_id'
                : 'nullable',
            'amount' => 'required|numeric|min:0.01',
            'category' => 'nullable|string|max:100',
            'transaction_date' => $requireDate ? 'required|date' : 'nullable|date',
            'notes' => 'nullable|string|max:1000',
        ], [
            'to_wallet_id.required' => 'Dompet tujuan wajib dipilih untuk transfer antar dompet.',
            'to_wallet_id.different' => 'Dompet tujuan harus berbeda dari dompet asal.',
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Transaction $transaction)
    {
        if ($transaction->user_id !== $request->user()->id) {
            abort(403, 'Akses tidak diizinkan.');
        }

        $transaction->delete();

        return redirect()->back()->with('success', 'Transaksi berhasil dihapus');
    }

    /**
     * Apply period, type, wallet_id, category & search filters uniformly across history and CSV export.
     *
     * @return array<string, string>
     */
    private function applyHistoryFilters(Builder|HasMany $query, Request $request): array
    {
        $period = $request->input('period', 'all');
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');
        $today = Carbon::today();

        switch ($period) {
            case 'today':
                $startDate = $today->toDateString();
                $endDate = $today->toDateString();
                break;
            case 'yesterday':
                $startDate = $today->copy()->subDay()->toDateString();
                $endDate = $today->copy()->subDay()->toDateString();
                break;
            case '7_days':
                $startDate = $today->copy()->subDays(6)->toDateString();
                $endDate = $today->toDateString();
                break;
            case 'this_month':
                $startDate = $today->copy()->startOfMonth()->toDateString();
                $endDate = $today->copy()->endOfMonth()->toDateString();
                break;
            case 'last_month':
                $startDate = $today->copy()->subMonth()->startOfMonth()->toDateString();
                $endDate = $today->copy()->subMonth()->endOfMonth()->toDateString();
                break;
            case 'this_year':
                $startDate = $today->copy()->startOfYear()->toDateString();
                $endDate = $today->copy()->endOfYear()->toDateString();
                break;
            case 'custom':
                break;
            case 'all':
            default:
                $period = 'all';
                $startDate = null;
                $endDate = null;
                break;
        }

        if ($startDate) {
            $query->where('transaction_date', '>=', $startDate);
        }
        if ($endDate) {
            $query->where('transaction_date', '<=', $endDate);
        }

        $type = $request->input('type');
        if ($type && in_array($type, ['income', 'expense', 'transfer'], true)) {
            $query->where('type', $type);
        }

        $walletId = $request->input('wallet_id');
        if ($walletId && $walletId !== 'all') {
            $query->where(function (Builder $q) use ($walletId) {
                $q->where('wallet_id', $walletId)
                    ->orWhere('to_wallet_id', $walletId);
            });
        }

        $category = $request->input('category');
        if ($category && $category !== 'all') {
            $query->where('category', $category);
        }

        $search = $request->input('search');
        if ($search) {
            $query->where(function (Builder $q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('notes', 'like', "%{$search}%")
                    ->orWhere('category', 'like', "%{$search}%");
            });
        }

        return [
            'period' => $period,
            'start_date' => $startDate ?? '',
            'end_date' => $endDate ?? '',
            'search' => $search ?? '',
            'type' => $type ?? '',
            'wallet_id' => $walletId ?? '',
            'category' => $category ?? '',
        ];
    }

    /**
     * Normalize wallet_id ownership and transfer fields cleanly for store and update.
     *
     * @param  array<string, mixed>  $validated
     * @return array<string, mixed>
     */
    private function resolveTransactionPayload(User $user, array $validated): array
    {
        if (! empty($validated['wallet_id'])) {
            $wallet = $user->wallets()->find($validated['wallet_id']);
            if (! $wallet) {
                abort(403, 'Dompet tidak valid.');
            }
            $validated['wallet'] = $wallet->type === 'cash' ? 'cash' : 'saldo';
        } elseif (! empty($validated['wallet'])) {
            $matchWallet = $user->wallets()->where(function (Builder $q) use ($validated) {
                if ($validated['wallet'] === 'cash') {
                    $q->where('type', 'cash');
                } else {
                    $q->where('type', '!=', 'cash');
                }
            })->first();

            if ($matchWallet) {
                $validated['wallet_id'] = $matchWallet->id;
            }
        } else {
            $defaultWallet = $user->wallets()->first();
            if ($defaultWallet) {
                $validated['wallet_id'] = $defaultWallet->id;
                $validated['wallet'] = $defaultWallet->type === 'cash' ? 'cash' : 'saldo';
            } else {
                $validated['wallet'] = 'saldo';
            }
        }

        if ($validated['type'] === 'transfer') {
            if (empty($validated['wallet_id']) || empty($validated['to_wallet_id'])) {
                abort(422, 'Dompet asal dan tujuan wajib valid.');
            }

            $toWallet = $user->wallets()->find($validated['to_wallet_id']);
            if (! $toWallet) {
                abort(403, 'Dompet tujuan tidak valid.');
            }

            $validated['category'] = null;
        } else {
            $validated['to_wallet_id'] = null;
        }

        return $validated;
    }
}

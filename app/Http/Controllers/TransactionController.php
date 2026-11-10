<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\Wallet;
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

        // Ensure user has starter wallets
        if ($user->wallets()->count() === 0) {
            $user->wallets()->create([
                'name' => 'Rekening Utama',
                'type' => 'bank',
                'account_number' => 'BCA / Bank Utama',
                'initial_balance' => 0,
                'color' => 'teal',
            ]);
            $user->wallets()->create([
                'name' => 'Uang Tunai (Cash)',
                'type' => 'cash',
                'account_number' => 'Dompet Fisik',
                'initial_balance' => 0,
                'color' => 'amber',
            ]);
        }

        Wallet::preloadBalances($user->id);

        $wallets = $user->wallets()->get();

        // Base query for user's transactions
        $transactionsQuery = $user->transactions()->with('walletAccount');

        // Filters
        $type = $request->input('type');
        $walletId = $request->input('wallet_id');
        $search = $request->input('search');
        $category = $request->input('category');
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');

        if ($type && in_array($type, ['income', 'expense'])) {
            $transactionsQuery->where('type', $type);
        }

        if ($walletId && $walletId !== 'all') {
            $transactionsQuery->where('wallet_id', $walletId);
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

        // Ordered by date and newest first
        $transactions = $transactionsQuery
            ->orderBy('transaction_date', 'desc')
            ->orderBy('id', 'desc')
            ->paginate(15)
            ->withQueryString();

        // Financial calculations (multi-tenant safe)
        $totalIncome = (float) $user->transactions()->where('type', 'income')->sum('amount');
        $totalExpense = (float) $user->transactions()->where('type', 'expense')->sum('amount');

        // Total Semua Uang = Sum of current balances of all registered wallets/rekening
        $totalAllMoney = (float) $wallets->sum('current_balance');

        // Current month metrics
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

        // Distinct categories for quick filter suggestions
        $existingCategories = $user->transactions()
            ->whereNotNull('category')
            ->where('category', '!=', '')
            ->distinct()
            ->pluck('category');

        $allUserTransactions = $user->transactions()
            ->with('walletAccount')
            ->orderBy('transaction_date', 'desc')
            ->orderBy('id', 'desc')
            ->get();

        return Inertia::render('Dashboard', [
            'transactions' => $transactions,
            'all_transactions' => $allUserTransactions,
            'wallets' => $wallets,
            'metrics' => [
                'total_balance' => $totalAllMoney, // Total Semua Uang (Cash + Saldo + Rekening/Wallets)
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

        // Ensure user has starter wallets
        if ($user->wallets()->count() === 0) {
            $user->wallets()->create([
                'name' => 'Rekening Utama',
                'type' => 'bank',
                'account_number' => 'BCA / Bank Utama',
                'initial_balance' => 0,
                'color' => 'teal',
            ]);
            $user->wallets()->create([
                'name' => 'Uang Tunai (Cash)',
                'type' => 'cash',
                'account_number' => 'Dompet Fisik',
                'initial_balance' => 0,
                'color' => 'amber',
            ]);
        }

        Wallet::preloadBalances($user->id);

        $wallets = $user->wallets()->get();

        // Base query
        $query = $user->transactions()->with('walletAccount');

        // Period filter logic
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
                // Use input start_date and end_date
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

        // Type filter
        $type = $request->input('type');
        if ($type && in_array($type, ['income', 'expense'])) {
            $query->where('type', $type);
        }

        // Wallet filter
        $walletId = $request->input('wallet_id');
        if ($walletId && $walletId !== 'all') {
            $query->where('wallet_id', $walletId);
        }

        // Category filter
        $category = $request->input('category');
        if ($category && $category !== 'all') {
            $query->where('category', $category);
        }

        // Search in title, notes, and category
        $search = $request->input('search');
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('notes', 'like', "%{$search}%")
                  ->orWhere('category', 'like', "%{$search}%");
            });
        }

        // Summary calculations on the filtered query
        $statsQuery = clone $query;

        $totalCount = (int) (clone $statsQuery)->count();
        $totalIncome = (float) (clone $statsQuery)->where('type', 'income')->sum('amount');
        $totalExpense = (float) (clone $statsQuery)->where('type', 'expense')->sum('amount');
        $netCashflow = $totalIncome - $totalExpense;

        $incomeCount = (int) (clone $statsQuery)->where('type', 'income')->count();
        $expenseCount = (int) (clone $statsQuery)->where('type', 'expense')->count();

        $avgExpense = $expenseCount > 0 ? round($totalExpense / $expenseCount, 2) : 0;
        $avgIncome = $incomeCount > 0 ? round($totalIncome / $incomeCount, 2) : 0;

        // Top expense category in this filtered dataset
        $topExpenseCategory = (clone $statsQuery)
            ->where('type', 'expense')
            ->whereNotNull('category')
            ->where('category', '!=', '')
            ->selectRaw('category, SUM(amount) as total_amount, COUNT(*) as count')
            ->groupBy('category')
            ->orderByDesc('total_amount')
            ->first();

        // Sorting
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

        // Distinct categories for filters
        $existingCategories = $user->transactions()
            ->whereNotNull('category')
            ->where('category', '!=', '')
            ->distinct()
            ->pluck('category');

        $allUserTransactions = $user->transactions()
            ->with('walletAccount')
            ->orderBy('transaction_date', 'desc')
            ->orderBy('id', 'desc')
            ->get();

        return Inertia::render('Transaction/Index', [
            'transactions' => $transactions,
            'all_transactions' => $allUserTransactions,
            'wallets' => $wallets,
            'categories' => $existingCategories,
            'filters' => [
                'period' => $period,
                'start_date' => $startDate ?? '',
                'end_date' => $endDate ?? '',
                'search' => $search ?? '',
                'type' => $type ?? '',
                'wallet_id' => $walletId ?? '',
                'category' => $category ?? '',
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
        $query = $user->transactions()->with('walletAccount');

        // Period filter logic
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
        if ($type && in_array($type, ['income', 'expense'])) {
            $query->where('type', $type);
        }

        $walletId = $request->input('wallet_id');
        if ($walletId && $walletId !== 'all') {
            $query->where('wallet_id', $walletId);
        }

        $category = $request->input('category');
        if ($category && $category !== 'all') {
            $query->where('category', $category);
        }

        $search = $request->input('search');
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('notes', 'like', "%{$search}%")
                  ->orWhere('category', 'like', "%{$search}%");
            });
        }

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
                'Dompet / Rekening',
                'Nomor Akun',
                'Judul Transaksi',
                'Kategori',
                'Catatan / Keterangan',
                'Waktu Input',
            ]);

            foreach ($transactions as $tx) {
                $walletName = $tx->walletAccount?->name ?? ($tx->wallet === 'cash' ? 'Uang Tunai' : 'Rekening Utama');
                $accountNumber = $tx->walletAccount?->account_number ?? '-';

                fputcsv($handle, [
                    'TRX-' . str_pad($tx->id, 5, '0', STR_PAD_LEFT),
                    Carbon::parse($tx->transaction_date)->format('Y-m-d'),
                    $tx->type === 'income' ? 'Pemasukan' : 'Pengeluaran',
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
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'type' => 'required|in:income,expense',
            'wallet' => 'nullable|in:saldo,cash',
            'wallet_id' => 'nullable|exists:wallets,id',
            'amount' => 'required|numeric|min:0.01',
            'category' => 'nullable|string|max:100',
            'transaction_date' => 'nullable|date',
            'notes' => 'nullable|string|max:1000',
        ]);

        if (empty($validated['transaction_date'])) {
            $validated['transaction_date'] = Carbon::today()->toDateString();
        }

        // Verify wallet belongs to user if provided
        if (!empty($validated['wallet_id'])) {
            $wallet = $request->user()->wallets()->find($validated['wallet_id']);
            if (!$wallet) {
                abort(403, 'Dompet tidak valid.');
            }
            $validated['wallet'] = $wallet->type === 'cash' ? 'cash' : 'saldo';
        } elseif (!empty($validated['wallet'])) {
            $matchWallet = $request->user()->wallets()->where(function ($q) use ($validated) {
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
            // Assign default first wallet
            $defaultWallet = $request->user()->wallets()->first();
            if ($defaultWallet) {
                $validated['wallet_id'] = $defaultWallet->id;
                $validated['wallet'] = $defaultWallet->type === 'cash' ? 'cash' : 'saldo';
            } else {
                $validated['wallet'] = 'saldo';
            }
        }

        $request->user()->transactions()->create($validated);

        return redirect()->back()->with('success', 'Transaksi berhasil disimpan');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Transaction $transaction)
    {
        // Enforce multi-tenant data isolation
        if ($transaction->user_id !== $request->user()->id) {
            abort(403, 'Akses tidak diizinkan.');
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'type' => 'required|in:income,expense',
            'wallet' => 'nullable|in:saldo,cash',
            'wallet_id' => 'nullable|exists:wallets,id',
            'amount' => 'required|numeric|min:0.01',
            'category' => 'nullable|string|max:100',
            'transaction_date' => 'required|date',
            'notes' => 'nullable|string|max:1000',
        ]);

        if (!empty($validated['wallet_id'])) {
            $wallet = $request->user()->wallets()->find($validated['wallet_id']);
            if (!$wallet) {
                abort(403, 'Dompet tidak valid.');
            }
            $validated['wallet'] = $wallet->type === 'cash' ? 'cash' : 'saldo';
        } elseif (!empty($validated['wallet'])) {
            $matchWallet = $request->user()->wallets()->where(function ($q) use ($validated) {
                if ($validated['wallet'] === 'cash') {
                    $q->where('type', 'cash');
                } else {
                    $q->where('type', '!=', 'cash');
                }
            })->first();
            if ($matchWallet) {
                $validated['wallet_id'] = $matchWallet->id;
            }
        }

        $transaction->update($validated);

        return redirect()->back()->with('success', 'Transaksi berhasil diperbarui');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Transaction $transaction)
    {
        // Enforce multi-tenant data isolation
        if ($transaction->user_id !== $request->user()->id) {
            abort(403, 'Akses tidak diizinkan.');
        }

        $transaction->delete();

        return redirect()->back()->with('success', 'Transaksi berhasil dihapus');
    }
}

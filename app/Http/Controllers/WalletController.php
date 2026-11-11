<?php

namespace App\Http\Controllers;

use App\Models\Wallet;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class WalletController extends Controller
{
    /**
     * Display a listing of user's wallets and accounts.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        // Seed starter cash wallet if user doesn't have any yet
        $user->seedDefaultCashWallet();

        Wallet::preloadBalances($user->id);

        $wallets = $user->wallets()->withCount('transactions')->get();

        // Calculate totals across all wallets
        $totalAllWallets = (float) $wallets->sum('current_balance');
        $totalBank = (float) $wallets->where('type', 'bank')->sum('current_balance');
        $totalCash = (float) $wallets->where('type', 'cash')->sum('current_balance');
        $totalEwallet = (float) $wallets->where('type', 'ewallet')->sum('current_balance');
        $totalInvestment = (float) $wallets->where('type', 'investment')->sum('current_balance');

        return Inertia::render('Wallet/Index', [
            'wallets' => $wallets,
            'summary' => [
                'total_all' => $totalAllWallets,
                'total_bank' => $totalBank,
                'total_cash' => $totalCash,
                'total_ewallet' => $totalEwallet,
                'total_investment' => $totalInvestment,
                'wallet_count' => $wallets->count(),
            ],
        ]);
    }

    /**
     * Display a single wallet with its transaction history and chart.
     */
    public function show(Request $request, Wallet $wallet): Response
    {
        $user = $request->user();

        // Enforce multi-tenant isolation
        if ($wallet->user_id !== $user->id) {
            abort(403, 'Akses tidak diizinkan.');
        }

        $timeframe = $request->input('timeframe', '1m');
        $today = Carbon::today();

        switch ($timeframe) {
            case '1w':
                $startDate = $today->copy()->subDays(6)->toDateString();
                $endDate = $today->toDateString();
                $groupMode = 'daily';
                break;
            case '1m':
                $startDate = $today->copy()->subDays(29)->toDateString();
                $endDate = $today->toDateString();
                $groupMode = 'daily';
                break;
            case '6m':
                $startDate = $today->copy()->subMonths(5)->startOfMonth()->toDateString();
                $endDate = $today->copy()->endOfMonth()->toDateString();
                $groupMode = 'monthly';
                break;
            case '1y':
                $startDate = $today->copy()->subMonths(11)->startOfMonth()->toDateString();
                $endDate = $today->copy()->endOfMonth()->toDateString();
                $groupMode = 'monthly';
                break;
            case 'all':
            default:
                $earliestTx = $wallet->transactions()->min('transaction_date');
                $startDate = $earliestTx ? Carbon::parse($earliestTx)->startOfMonth()->toDateString() : $today->copy()->subMonths(5)->startOfMonth()->toDateString();
                $endDate = $today->copy()->endOfMonth()->toDateString();
                $groupMode = 'monthly';
                break;
        }

        // Transactions in timeframe for chart
        $rangeTransactions = $wallet->transactions()
            ->whereBetween('transaction_date', [$startDate, $endDate])
            ->get();

        $chartBuckets = [];

        if ($groupMode === 'daily') {
            $current = Carbon::parse($startDate);
            $end = Carbon::parse($endDate);

            while ($current->lte($end)) {
                $dateKey = $current->toDateString();
                $shortLabel = $current->locale('id')->isoFormat('D MMM');

                $chartBuckets[$dateKey] = [
                    'key' => $dateKey,
                    'label' => $shortLabel,
                    'full_label' => $current->locale('id')->isoFormat('dddd, D MMMM Y'),
                    'income' => 0.0,
                    'expense' => 0.0,
                    'net' => 0.0,
                ];
                $current->addDay();
            }

            foreach ($rangeTransactions as $tx) {
                $key = Carbon::parse($tx->transaction_date)->toDateString();
                if (isset($chartBuckets[$key])) {
                    if ($tx->type === 'income') {
                        $chartBuckets[$key]['income'] += (float) $tx->amount;
                    } else {
                        $chartBuckets[$key]['expense'] += (float) $tx->amount;
                    }
                    $chartBuckets[$key]['net'] = $chartBuckets[$key]['income'] - $chartBuckets[$key]['expense'];
                }
            }
        } else {
            $current = Carbon::parse($startDate)->startOfMonth();
            $end = Carbon::parse($endDate)->endOfMonth();

            while ($current->lte($end)) {
                $monthKey = $current->format('Y-m');
                $shortLabel = $current->locale('id')->isoFormat('MMM YY');

                $chartBuckets[$monthKey] = [
                    'key' => $monthKey,
                    'label' => $shortLabel,
                    'full_label' => $current->locale('id')->isoFormat('MMMM Y'),
                    'income' => 0.0,
                    'expense' => 0.0,
                    'net' => 0.0,
                ];
                $current->addMonth();
            }

            foreach ($rangeTransactions as $tx) {
                $key = Carbon::parse($tx->transaction_date)->format('Y-m');
                if (isset($chartBuckets[$key])) {
                    if ($tx->type === 'income') {
                        $chartBuckets[$key]['income'] += (float) $tx->amount;
                    } else {
                        $chartBuckets[$key]['expense'] += (float) $tx->amount;
                    }
                    $chartBuckets[$key]['net'] = $chartBuckets[$key]['income'] - $chartBuckets[$key]['expense'];
                }
            }
        }

        $chartData = array_values($chartBuckets);

        // Period & Overall Wallet Metrics
        $totalIncome = (float) $wallet->transactions()->where('type', 'income')->sum('amount');
        $totalExpense = (float) $wallet->transactions()->where('type', 'expense')->sum('amount');
        $periodIncome = (float) $rangeTransactions->where('type', 'income')->sum('amount');
        $periodExpense = (float) $rangeTransactions->where('type', 'expense')->sum('amount');
        $periodNet = $periodIncome - $periodExpense;

        // Paginated Transactions list for this wallet
        $txQuery = $wallet->transactions()->with('walletAccount');

        if ($request->filled('type') && in_array($request->type, ['income', 'expense'])) {
            $txQuery->where('type', $request->type);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $txQuery->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('notes', 'like', "%{$search}%");
            });
        }

        if ($request->filled('category')) {
            $txQuery->where('category', $request->category);
        }

        if ($request->filled('start_date')) {
            $txQuery->whereDate('transaction_date', '>=', $request->start_date);
        }

        if ($request->filled('end_date')) {
            $txQuery->whereDate('transaction_date', '<=', $request->end_date);
        }

        $transactions = $txQuery->orderBy('transaction_date', 'desc')
            ->orderBy('id', 'desc')
            ->paginate(15)
            ->withQueryString();

        // Categories available for filtering
        $walletCategories = $wallet->transactions()
            ->whereNotNull('category')
            ->where('category', '!=', '')
            ->distinct()
            ->pluck('category');

        $allUserCategories = $user->transactions()
            ->whereNotNull('category')
            ->where('category', '!=', '')
            ->distinct()
            ->pluck('category');

        return Inertia::render('Wallet/Show', [
            'wallet' => [
                'id' => $wallet->id,
                'name' => $wallet->name,
                'type' => $wallet->type,
                'account_number' => $wallet->account_number,
                'initial_balance' => (float) $wallet->initial_balance,
                'current_balance' => (float) $wallet->current_balance,
                'color' => $wallet->color,
                'created_at' => $wallet->created_at->format('Y-m-d'),
                'total_income' => $totalIncome,
                'total_expense' => $totalExpense,
                'transactions_count' => $wallet->transactions()->count(),
            ],
            'timeframe' => $timeframe,
            'dateRange' => [
                'start' => $startDate,
                'end' => $endDate,
                'formatted' => Carbon::parse($startDate)->locale('id')->isoFormat('D MMM Y') . ' — ' . Carbon::parse($endDate)->locale('id')->isoFormat('D MMM Y'),
            ],
            'metrics' => [
                'period_income' => $periodIncome,
                'period_expense' => $periodExpense,
                'period_net' => $periodNet,
                'total_income' => $totalIncome,
                'total_expense' => $totalExpense,
            ],
            'chartData' => $chartData,
            'transactions' => $transactions,
            'filters' => [
                'search' => $request->input('search', ''),
                'type' => $request->input('type', ''),
                'category' => $request->input('category', ''),
                'start_date' => $request->input('start_date', ''),
                'end_date' => $request->input('end_date', ''),
                'timeframe' => $timeframe,
            ],
            'categories' => $allUserCategories,
            'walletCategories' => $walletCategories,
            'wallets' => $user->wallets()->get(),
        ]);
    }

    /**
     * Store a newly created wallet in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'type' => 'required|in:bank,cash,ewallet,investment,other',
            'account_number' => 'nullable|string|max:100',
            'initial_balance' => 'nullable|numeric|min:0',
            'color' => 'nullable|string|max:30',
        ]);

        if (empty($validated['initial_balance'])) {
            $validated['initial_balance'] = 0;
        }

        if (empty($validated['color'])) {
            $validated['color'] = 'emerald';
        }

        $user = $request->user();
        $user->wallets()->create($validated);

        if (! $user->has_created_wallet) {
            $user->forceFill(['has_created_wallet' => true])->save();
        }

        return redirect()->back()->with('success', 'Dompet / rekening baru berhasil ditambahkan');
    }

    /**
     * Update the specified wallet in storage.
     */
    public function update(Request $request, Wallet $wallet)
    {
        if ($wallet->user_id !== $request->user()->id) {
            abort(403, 'Akses tidak diizinkan.');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'type' => 'required|in:bank,cash,ewallet,investment,other',
            'account_number' => 'nullable|string|max:100',
            'initial_balance' => 'nullable|numeric|min:0',
            'color' => 'nullable|string|max:30',
        ]);

        $wallet->update($validated);

        return redirect()->back()->with('success', 'Dompet / rekening berhasil diperbarui');
    }

    /**
     * Remove the specified wallet from storage.
     */
    public function destroy(Request $request, Wallet $wallet)
    {
        if ($wallet->user_id !== $request->user()->id) {
            abort(403, 'Akses tidak diizinkan.');
        }

        $wallet->delete();

        return redirect()->back()->with('success', 'Dompet / rekening berhasil dihapus');
    }
}


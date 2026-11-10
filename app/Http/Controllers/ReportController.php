<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\Wallet;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ReportController extends Controller
{
    /**
     * Display the financial report and analytics dashboard.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();
        Wallet::preloadBalances($user->id);
        $timeframe = $request->input('timeframe', '1m');
        $walletFilter = $request->input('wallet');

        if (!in_array($timeframe, ['1w', '1m', '6m', '1y'])) {
            $timeframe = '1m';
        }

        $today = Carbon::today();

        // 1. Determine date range based on timeframe
        switch ($timeframe) {
            case '1w': // Last 7 days
                $startDate = $today->copy()->subDays(6)->toDateString();
                $endDate = $today->toDateString();
                $intervalType = 'daily';
                break;
            case '1m': // Last 30 days
                $startDate = $today->copy()->subDays(29)->toDateString();
                $endDate = $today->toDateString();
                $intervalType = 'daily';
                break;
            case '6m': // Last 6 months
                $startDate = $today->copy()->subMonths(5)->startOfMonth()->toDateString();
                $endDate = $today->copy()->endOfMonth()->toDateString();
                $intervalType = 'monthly';
                break;
            case '1y': // Last 12 months
            default:
                $startDate = $today->copy()->subMonths(11)->startOfMonth()->toDateString();
                $endDate = $today->copy()->endOfMonth()->toDateString();
                $intervalType = 'monthly';
                break;
        }

        // Base query for the timeframe
        $rangeQuery = $user->transactions()
            ->whereBetween('transaction_date', [$startDate, $endDate]);

        if ($walletFilter && in_array($walletFilter, ['saldo', 'cash'])) {
            $rangeQuery->where('wallet', $walletFilter);
        }

        $rangeTransactions = $rangeQuery->get();

        // 2. Generate continuous chart buckets
        $chartBuckets = [];

        if ($intervalType === 'daily') {
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
        } else { // monthly
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

        // 3. Overall Period Metrics
        $totalPeriodIncome = (float) $rangeTransactions->where('type', 'income')->sum('amount');
        $totalPeriodExpense = (float) $rangeTransactions->where('type', 'expense')->sum('amount');
        $totalPeriodNet = $totalPeriodIncome - $totalPeriodExpense;

        // Dompet Breakdown in Period
        $periodSaldoIncome = (float) $rangeTransactions->where('wallet', 'saldo')->where('type', 'income')->sum('amount');
        $periodSaldoExpense = (float) $rangeTransactions->where('wallet', 'saldo')->where('type', 'expense')->sum('amount');
        $periodSaldoNet = $periodSaldoIncome - $periodSaldoExpense;

        $periodCashIncome = (float) $rangeTransactions->where('wallet', 'cash')->where('type', 'income')->sum('amount');
        $periodCashExpense = (float) $rangeTransactions->where('wallet', 'cash')->where('type', 'expense')->sum('amount');
        $periodCashNet = $periodCashIncome - $periodCashExpense;

        // Savings & Expense Ratio
        $expenseRatio = $totalPeriodIncome > 0
            ? min(100, round(($totalPeriodExpense / $totalPeriodIncome) * 100))
            : ($totalPeriodExpense > 0 ? 100 : 0);

        $savingsRatio = max(0, 100 - $expenseRatio);

        // Average daily / monthly calculations
        $daysCount = max(1, Carbon::parse($startDate)->diffInDays(Carbon::parse($endDate)) + 1);
        $avgDailyExpense = $totalPeriodExpense / $daysCount;

        // Top single expense
        $highestExpenseTx = $rangeTransactions
            ->where('type', 'expense')
            ->sortByDesc('amount')
            ->first();

        // 4. Category Breakdown (Expenses)
        $categoryBreakdown = $rangeTransactions
            ->where('type', 'expense')
            ->groupBy(fn ($tx) => $tx->category ?: 'Lainnya')
            ->map(function ($items, $cat) use ($totalPeriodExpense) {
                $sum = (float) $items->sum('amount');
                $pct = $totalPeriodExpense > 0 ? round(($sum / $totalPeriodExpense) * 100, 1) : 0;
                return [
                    'category' => $cat,
                    'total' => $sum,
                    'count' => $items->count(),
                    'percentage' => $pct,
                ];
            })
            ->sortByDesc('total')
            ->values()
            ->all();

        // Income Category Breakdown
        $incomeCategoryBreakdown = $rangeTransactions
            ->where('type', 'income')
            ->groupBy(fn ($tx) => $tx->category ?: 'Lainnya')
            ->map(function ($items, $cat) use ($totalPeriodIncome) {
                $sum = (float) $items->sum('amount');
                $pct = $totalPeriodIncome > 0 ? round(($sum / $totalPeriodIncome) * 100, 1) : 0;
                return [
                    'category' => $cat,
                    'total' => $sum,
                    'count' => $items->count(),
                    'percentage' => $pct,
                ];
            })
            ->sortByDesc('total')
            ->values()
            ->all();

        // 5. Filtered Transactions list for this report period
        $tableQuery = $user->transactions()
            ->with('walletAccount')
            ->whereBetween('transaction_date', [$startDate, $endDate]);

        if ($type = $request->input('type')) {
            if (in_array($type, ['income', 'expense'])) {
                $tableQuery->where('type', $type);
            }
        }

        if ($walletFilter && in_array($walletFilter, ['saldo', 'cash'])) {
            $tableQuery->where('wallet', $walletFilter);
        }

        if ($search = $request->input('search')) {
            $tableQuery->where('title', 'like', "%{$search}%");
        }

        if ($cat = $request->input('category')) {
            if ($cat !== 'all') {
                $tableQuery->where('category', $cat);
            }
        }

        $transactions = $tableQuery
            ->orderBy('transaction_date', 'desc')
            ->orderBy('id', 'desc')
            ->paginate(15)
            ->withQueryString();

        $categories = $user->transactions()
            ->whereNotNull('category')
            ->where('category', '!=', '')
            ->distinct()
            ->pluck('category');

        return Inertia::render('Report', [
            'timeframe' => $timeframe,
            'wallets' => $user->wallets()->get(),
            'dateRange' => [
                'start' => $startDate,
                'end' => $endDate,
                'formatted' => Carbon::parse($startDate)->locale('id')->isoFormat('D MMM Y') . ' — ' . Carbon::parse($endDate)->locale('id')->isoFormat('D MMM Y'),
            ],
            'chartData' => $chartData,
            'metrics' => [
                'total_income' => $totalPeriodIncome,
                'total_expense' => $totalPeriodExpense,
                'net_balance' => $totalPeriodNet,
                'wallet_saldo' => $periodSaldoNet,
                'wallet_cash' => $periodCashNet,
                'expense_ratio' => $expenseRatio,
                'savings_ratio' => $savingsRatio,
                'avg_daily_expense' => $avgDailyExpense,
                'days_count' => $daysCount,
                'highest_expense' => $highestExpenseTx ? [
                    'title' => $highestExpenseTx->title,
                    'amount' => (float) $highestExpenseTx->amount,
                    'date' => $highestExpenseTx->transaction_date->format('Y-m-d'),
                ] : null,
            ],
            'categoryBreakdown' => $categoryBreakdown,
            'incomeCategoryBreakdown' => $incomeCategoryBreakdown,
            'transactions' => $transactions,
            'filters' => [
                'type' => $request->input('type', ''),
                'wallet' => $walletFilter ?? '',
                'search' => $request->input('search', ''),
                'category' => $request->input('category', ''),
            ],
            'categories' => $categories,
        ]);
    }

    /**
     * Export transactions within timeframe as CSV.
     */
    public function exportCsv(Request $request): StreamedResponse
    {
        $user = $request->user();
        $timeframe = $request->input('timeframe', '1m');
        $walletFilter = $request->input('wallet');

        $today = Carbon::today();
        switch ($timeframe) {
            case '1w':
                $startDate = $today->copy()->subDays(6)->toDateString();
                $endDate = $today->toDateString();
                break;
            case '6m':
                $startDate = $today->copy()->subMonths(5)->startOfMonth()->toDateString();
                $endDate = $today->copy()->endOfMonth()->toDateString();
                break;
            case '1y':
                $startDate = $today->copy()->subMonths(11)->startOfMonth()->toDateString();
                $endDate = $today->copy()->endOfMonth()->toDateString();
                break;
            case '1m':
            default:
                $startDate = $today->copy()->subDays(29)->toDateString();
                $endDate = $today->toDateString();
                break;
        }

        $query = $user->transactions()
            ->whereBetween('transaction_date', [$startDate, $endDate]);

        if ($walletFilter && in_array($walletFilter, ['saldo', 'cash'])) {
            $query->where('wallet', $walletFilter);
        }

        $transactions = $query
            ->orderBy('transaction_date', 'desc')
            ->orderBy('id', 'desc')
            ->get();

        $filename = "Uangku_Laporan_{$timeframe}_" . now()->format('Ymd_His') . ".csv";

        $headers = [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
            'Pragma' => 'no-cache',
            'Cache-Control' => 'must-revalidate, post-check=0, pre-check=0',
            'Expires' => '0',
        ];

        return response()->stream(function () use ($transactions) {
            $handle = fopen('php://output', 'w');

            // UTF-8 BOM for Excel compatibility
            fprintf($handle, chr(0xEF).chr(0xBB).chr(0xBF));

            // CSV Header
            fputcsv($handle, ['ID', 'Tanggal', 'Jenis', 'Dompet', 'Judul', 'Kategori', 'Nominal (IDR)', 'Catatan']);

            foreach ($transactions as $tx) {
                fputcsv($handle, [
                    $tx->id,
                    Carbon::parse($tx->transaction_date)->format('Y-m-d'),
                    $tx->type === 'income' ? 'Pemasukan' : 'Pengeluaran',
                    $tx->wallet === 'cash' ? 'Dompet Cash' : 'Dompet Saldo',
                    $tx->title,
                    $tx->category ?? '-',
                    $tx->amount,
                    $tx->notes ?? '',
                ]);
            }

            fclose($handle);
        }, 200, $headers);
    }
}

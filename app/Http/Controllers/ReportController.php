<?php

namespace App\Http\Controllers;

use App\Models\Budget;
use App\Models\Wallet;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\HasMany;
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
        $user->seedDefaultCashWallet();
        Wallet::preloadBalances($user->id);

        $wallets = $user->wallets()->get();
        $timeframe = $request->input('timeframe', '1m');
        if (! in_array($timeframe, ['1w', '1m', '6m', '1y'], true)) {
            $timeframe = '1m';
        }

        [$startDate, $endDate, $intervalType] = $this->resolveTimeframe($timeframe);
        $walletId = $this->resolveFilteredWalletId($request, $wallets);

        // Cashflow analytics exclude internal transfers so income/expense ratios stay accurate
        $rangeQuery = $user->transactions()
            ->whereIn('type', ['income', 'expense'])
            ->whereBetween('transaction_date', [$startDate, $endDate]);

        if ($walletId !== null) {
            $rangeQuery->where('wallet_id', $walletId);
        }

        $rangeTransactions = $rangeQuery->get();

        // Generate continuous chart buckets
        $chartBuckets = [];

        if ($intervalType === 'daily') {
            $current = Carbon::parse($startDate);
            $end = Carbon::parse($endDate);

            while ($current->lte($end)) {
                $dateKey = $current->toDateString();
                $chartBuckets[$dateKey] = [
                    'key' => $dateKey,
                    'label' => $current->locale('id')->isoFormat('D MMM'),
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
                    } elseif ($tx->type === 'expense') {
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
                $chartBuckets[$monthKey] = [
                    'key' => $monthKey,
                    'label' => $current->locale('id')->isoFormat('MMM YY'),
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
                    } elseif ($tx->type === 'expense') {
                        $chartBuckets[$key]['expense'] += (float) $tx->amount;
                    }
                    $chartBuckets[$key]['net'] = $chartBuckets[$key]['income'] - $chartBuckets[$key]['expense'];
                }
            }
        }

        $chartData = array_values($chartBuckets);

        // Overall period metrics
        $totalPeriodIncome = (float) $rangeTransactions->where('type', 'income')->sum('amount');
        $totalPeriodExpense = (float) $rangeTransactions->where('type', 'expense')->sum('amount');
        $totalPeriodNet = $totalPeriodIncome - $totalPeriodExpense;

        $expenseRatio = $totalPeriodIncome > 0
            ? min(100, round(($totalPeriodExpense / $totalPeriodIncome) * 100))
            : ($totalPeriodExpense > 0 ? 100 : 0);

        $savingsRatio = max(0, 100 - $expenseRatio);

        $daysCount = max(1, Carbon::parse($startDate)->diffInDays(Carbon::parse($endDate)) + 1);
        $avgDailyExpense = $totalPeriodExpense / $daysCount;

        $highestExpenseTx = $rangeTransactions
            ->where('type', 'expense')
            ->sortByDesc('amount')
            ->first();

        $categoryBreakdown = $this->buildCategoryBreakdown($rangeTransactions, 'expense', $totalPeriodExpense);
        $incomeCategoryBreakdown = $this->buildCategoryBreakdown($rangeTransactions, 'income', $totalPeriodIncome);

        // Filtered transaction table (includes transfers touching filtered wallet)
        $tableQuery = $user->transactions()
            ->with(['walletAccount', 'toWalletAccount'])
            ->whereBetween('transaction_date', [$startDate, $endDate]);

        $this->applyWalletScope($tableQuery, $walletId);

        if ($type = $request->input('type')) {
            if (in_array($type, ['income', 'expense', 'transfer'], true)) {
                $tableQuery->where('type', $type);
            }
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

        $selectedWallet = $walletId !== null ? $wallets->firstWhere('id', $walletId) : null;

        return Inertia::render('Report', [
            'timeframe' => $timeframe,
            'wallets' => $wallets,
            'selectedWallet' => $selectedWallet ? [
                'id' => $selectedWallet->id,
                'name' => $selectedWallet->name,
                'type' => $selectedWallet->type,
            ] : null,
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
            'budgets' => Budget::progressForUser($user),
            'transactions' => $transactions,
            'filters' => [
                'type' => $request->input('type', ''),
                'wallet_id' => $walletId ? (string) $walletId : '',
                'search' => $request->input('search', ''),
                'category' => $request->input('category', ''),
            ],
            'categories' => $categories,
        ]);
    }

    /**
     * Export transactions within timeframe (and optional wallet_id filter) as CSV.
     */
    public function exportCsv(Request $request): StreamedResponse
    {
        $user = $request->user();
        $timeframe = $request->input('timeframe', '1m');
        if (! in_array($timeframe, ['1w', '1m', '6m', '1y'], true)) {
            $timeframe = '1m';
        }

        [$startDate, $endDate] = $this->resolveTimeframe($timeframe);
        $wallets = $user->wallets()->get();
        $walletId = $this->resolveFilteredWalletId($request, $wallets);

        $query = $user->transactions()
            ->with(['walletAccount', 'toWalletAccount'])
            ->whereBetween('transaction_date', [$startDate, $endDate]);

        $this->applyWalletScope($query, $walletId);

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

            fputcsv($handle, ['ID', 'Tanggal', 'Jenis', 'Dompet / Alur Dana', 'Judul', 'Kategori', 'Nominal (IDR)', 'Catatan']);

            foreach ($transactions as $tx) {
                if ($tx->type === 'transfer') {
                    $typeLabel = 'Transfer Antar Dompet';
                    $fromName = $tx->walletAccount?->name ?? 'Dompet Asal';
                    $toName = $tx->toWalletAccount?->name ?? 'Dompet Tujuan';
                    $walletLabel = "{$fromName} -> {$toName}";
                } else {
                    $typeLabel = $tx->type === 'income' ? 'Pemasukan' : 'Pengeluaran';
                    $walletLabel = $tx->walletAccount?->name ?? 'Tanpa Dompet';
                }

                fputcsv($handle, [
                    $tx->id,
                    Carbon::parse($tx->transaction_date)->format('Y-m-d'),
                    $typeLabel,
                    $walletLabel,
                    $tx->title,
                    $tx->category ?? '-',
                    $tx->amount,
                    $tx->notes ?? '',
                ]);
            }

            fclose($handle);
        }, 200, $headers);
    }

    /**
     * Resolve timeframe start, end, and chart bucket grouping mode.
     *
     * @return array{0: string, 1: string, 2: string}
     */
    private function resolveTimeframe(string $timeframe): array
    {
        $today = Carbon::today();

        return match ($timeframe) {
            '1w' => [$today->copy()->subDays(6)->toDateString(), $today->toDateString(), 'daily'],
            '6m' => [$today->copy()->subMonths(5)->startOfMonth()->toDateString(), $today->copy()->endOfMonth()->toDateString(), 'monthly'],
            '1y' => [$today->copy()->subMonths(11)->startOfMonth()->toDateString(), $today->copy()->endOfMonth()->toDateString(), 'monthly'],
            default => [$today->copy()->subDays(29)->toDateString(), $today->toDateString(), 'daily'],
        };
    }

    /**
     * Validate and resolve filtered wallet ID belonging to the current user.
     */
    private function resolveFilteredWalletId(Request $request, $wallets): ?int
    {
        $rawWalletId = $request->input('wallet_id');
        if (! $rawWalletId || $rawWalletId === 'all') {
            return null;
        }

        $matched = $wallets->firstWhere('id', (int) $rawWalletId);

        return $matched ? (int) $matched->id : null;
    }

    /**
     * Apply uniform wallet_id scoping including incoming & outgoing transfers.
     */
    private function applyWalletScope(Builder|HasMany $query, ?int $walletId): void
    {
        if ($walletId === null) {
            return;
        }

        $query->where(function (Builder $q) use ($walletId) {
            $q->where('wallet_id', $walletId)
                ->orWhere('to_wallet_id', $walletId);
        });
    }

    /**
     * Build category percentage breakdown for a given transaction type.
     *
     * @return array<int, array<string, mixed>>
     */
    private function buildCategoryBreakdown($transactions, string $type, float $total): array
    {
        return $transactions
            ->where('type', $type)
            ->groupBy(fn ($tx) => $tx->category ?: 'Lainnya')
            ->map(function ($items, $cat) use ($total) {
                $sum = (float) $items->sum('amount');
                $pct = $total > 0 ? round(($sum / $total) * 100, 1) : 0;

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
    }
}

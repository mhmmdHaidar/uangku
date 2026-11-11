import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ReportChart from '@/Components/Report/ReportChart';
import CategoryBreakdown from '@/Components/Report/CategoryBreakdown';
import TransactionList from '@/Components/Dashboard/TransactionList';
import TransactionModal from '@/Components/Dashboard/TransactionModal';
import DeleteConfirmModal from '@/Components/Dashboard/DeleteConfirmModal';
import { formatRupiah } from '@/Utils/format';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import {
    BarChart3,
    Download,
    TrendingUp,
    AlertCircle,
    Calendar,
    Flame,
} from '@/Components/Icons/PhosphorDuotone';
import {
    MoneyBadge,
    ExpenseBadge,
    WalletBadge,
    CoinsBadge,
} from '@/Components/Icons/ColorBadges';

export default function Report({
    auth,
    timeframe = '1m',
    dateRange = {},
    chartData = [],
    metrics = {},
    categoryBreakdown = [],
    incomeCategoryBreakdown = [],
    transactions = {},
    filters = {},
    categories = [],
    wallets = [],
}) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState(null);

    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [deletingTransaction, setDeletingTransaction] = useState(null);

    const handleTimeframeChange = (newTimeframe) => {
        router.get(
            route('reports.index'),
            { ...filters, timeframe: newTimeframe },
            { preserveState: true, preserveScroll: true, replace: true }
        );
    };

    const handleOpenCreate = () => {
        setEditingTransaction(null);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (transaction) => {
        setEditingTransaction(transaction);
        setIsModalOpen(true);
    };

    const handleOpenDelete = (transaction) => {
        setDeletingTransaction(transaction);
        setIsDeleteOpen(true);
    };

    const isPositiveNet = metrics.net_balance >= 0;

    return (
        <AuthenticatedLayout>
            <Head title="Laporan & Statistik Keuangan" />

            <div className="space-y-6">
                {/* Header: Title, Description, and CSV Export Action */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-semibold text-[#00105B] dark:text-zinc-300 mb-1">
                            <BarChart3 className="w-3.5 h-3.5" />
                            <span>Analisis Finansial Terpadu</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                            Laporan &amp; Riwayat Keuangan
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-0.5">
                            Pantau pergerakan kas, evaluasi tren pemasukan vs pengeluaran, dan alokasi anggaran.
                        </p>
                    </div>

                    <div className="flex items-center gap-2.5">
                        <a
                            href={route('reports.export', { timeframe })}
                            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/70 dark:bg-[#1C1C20] hover:bg-slate-100 dark:hover:bg-[#242429] border border-slate-200 dark:border-[#2C2C32] text-xs font-semibold text-slate-700 dark:text-zinc-200 transition shadow-sm"
                            download
                            title="Unduh laporan ini dalam format CSV / Excel"
                        >
                            <Download className="w-4 h-4 text-slate-400" />
                            Ekspor CSV
                        </a>
                    </div>
                </div>

                {/* 4 Summary Metric Cards for Selected Timeframe */}
                <div data-tour="reports-metrics" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* 1. Period Income */}
                    <div className="glass-card rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden group hover:border-emerald-500/30">
                        <div className="absolute top-0 right-0 w-28 h-28 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
                        <div className="relative z-10 flex items-center justify-between gap-2 text-xs text-slate-500">
                            <span className="font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 text-[11px]">Pemasukan Periode Ini</span>
                            <MoneyBadge className="w-10 h-10" />
                        </div>
                        <div className="relative z-10 my-3">
                            <p className="text-2xl sm:text-3xl font-extrabold tabular-nums text-emerald-600 dark:text-emerald-400 tracking-tight">
                                {formatRupiah(metrics.total_income)}
                            </p>
                        </div>
                        <p className="relative z-10 text-[11px] text-slate-400 dark:text-zinc-500 border-t border-slate-200 dark:border-[#2C2C32] pt-2">
                            Total arus dana masuk
                        </p>
                    </div>

                    {/* 2. Period Expense */}
                    <div className="glass-card rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden group hover:border-rose-500/30">
                        <div className="absolute top-0 right-0 w-28 h-28 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />
                        <div className="relative z-10 flex items-center justify-between gap-2 text-xs text-slate-500">
                            <span className="font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 text-[11px]">Pengeluaran Periode Ini</span>
                            <ExpenseBadge className="w-10 h-10" />
                        </div>
                        <div className="relative z-10 my-3">
                            <p className="text-2xl sm:text-3xl font-extrabold tabular-nums text-slate-900 dark:text-white tracking-tight">
                                {formatRupiah(metrics.total_expense)}
                            </p>
                        </div>
                        <p className="relative z-10 text-[11px] text-slate-400 dark:text-zinc-500 border-t border-slate-200 dark:border-[#2C2C32] pt-2">
                            Rata-rata: {formatRupiah(metrics.avg_daily_expense)} / hari
                        </p>
                    </div>

                    {/* 3. Net Balance */}
                    <div className="glass-card rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden group hover:border-[#00105B]/30 dark:hover:border-zinc-500/50">
                        <div className="absolute top-0 right-0 w-28 h-28 bg-[#00105B]/10 dark:bg-white/[0.04] rounded-full blur-2xl pointer-events-none" />
                        <div className="relative z-10 flex items-center justify-between gap-2 text-xs text-slate-500">
                            <span className="font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 text-[11px]">Selisih Bersih (Kas)</span>
                            <WalletBadge className="w-10 h-10" />
                        </div>
                        <div className="relative z-10 my-3">
                            <p className={`text-2xl sm:text-3xl font-extrabold tabular-nums tracking-tight ${isPositiveNet ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                                {isPositiveNet ? '+' : ''}{formatRupiah(metrics.net_balance)}
                            </p>
                        </div>
                        <div className="relative z-10 border-t border-slate-200 dark:border-[#2C2C32] pt-2 flex items-center justify-between text-[11px] text-slate-400 dark:text-zinc-500">
                            <span>Akumulasi Bersih</span>
                            <span className="font-semibold text-slate-700 dark:text-zinc-300">
                                {wallets.length > 0 ? `${wallets.length} Dompet Terhubung` : 'Seluruh Dompet'}
                            </span>
                        </div>
                    </div>

                    {/* 4. Savings Ratio */}
                    <div className="glass-card rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden group hover:border-amber-500/30">
                        <div className="absolute top-0 right-0 w-28 h-28 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
                        <div className="relative z-10 flex items-center justify-between gap-2 text-xs text-slate-500">
                            <span className="font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 text-[11px]">Rasio Tabungan</span>
                            <CoinsBadge className="w-10 h-10" />
                        </div>
                        <div className="relative z-10 my-3 flex items-baseline gap-2">
                            <p className="text-2xl sm:text-3xl font-extrabold tabular-nums text-slate-900 dark:text-white tracking-tight">
                                {metrics.savings_ratio}%
                            </p>
                            <span className="text-xs text-slate-400 font-semibold">tersimpan</span>
                        </div>
                        <p className="relative z-10 text-[11px] text-slate-400 dark:text-zinc-500 border-t border-slate-200 dark:border-[#2C2C32] pt-2">
                            {metrics.expense_ratio}% dialokasikan untuk belanja
                        </p>
                    </div>
                </div>

                {/* Main Interactive Chart */}
                <div data-tour="reports-chart">
                    <ReportChart
                        chartData={chartData}
                        timeframe={timeframe}
                        onTimeframeChange={handleTimeframeChange}
                        dateRangeFormatted={dateRange.formatted}
                    />
                </div>

                {/* Category Breakdown & Highlights Grid */}
                <div data-tour="reports-breakdown" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left: Category Breakdown (2 columns wide) */}
                    <div className="lg:col-span-2">
                        <CategoryBreakdown
                            expenseCategories={categoryBreakdown}
                            incomeCategories={incomeCategoryBreakdown}
                        />
                    </div>

                    {/* Right: Insights & Single Highest Expense Card */}
                    <div className="space-y-4">
                        {/* Highest Single Expense Card */}
                        {metrics.highest_expense && (
                            <div className="glass-card rounded-2xl p-5 space-y-3">
                                <div className="flex items-center gap-2 text-xs font-semibold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
                                    <Flame className="w-4 h-4" />
                                    Pengeluaran Terbesar Periode Ini
                                </div>
                                <div>
                                    <h4 className="text-base font-bold text-slate-900 dark:text-white">
                                        {metrics.highest_expense.title}
                                    </h4>
                                    <p className="text-xl font-extrabold text-rose-600 dark:text-rose-400 tabular-nums mt-1">
                                        {formatRupiah(metrics.highest_expense.amount)}
                                    </p>
                                    <p className="text-xs text-slate-400 mt-1">
                                        Tanggal transaksi: {metrics.highest_expense.date}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Financial Health Summary Tip */}
                        <div className="glass-card rounded-2xl p-5 space-y-2.5">
                            <div className="flex items-center gap-2 text-xs font-semibold text-[#00105B] dark:text-zinc-200 uppercase tracking-wider">
                                <TrendingUp className="w-4 h-4" />
                                Catatan Evaluasi Finansial
                            </div>
                            <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed">
                                {metrics.savings_ratio >= 20
                                    ? `Hebat! Rasio tabungan Anda sebesar ${metrics.savings_ratio}% berada di atas ambang rekomendasi umum 20%. Pertahankan kedisiplinan alokasi ini.`
                                    : `Rasio tabungan Anda saat ini berada di angka ${metrics.savings_ratio}%. Cobalah mengevaluasi kategori pengeluaran terbesar untuk memangkas pengeluaran yang kurang penting.`}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Filtered Transaction Table for Selected Timeframe */}
                <TransactionList
                    transactions={transactions}
                    filters={filters}
                    categories={categories}
                    wallets={wallets}
                    onAddNew={handleOpenCreate}
                    onEdit={handleOpenEdit}
                    onDelete={handleOpenDelete}
                />
            </div>

            {/* Create / Edit Modal */}
            <TransactionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                transactionToEdit={editingTransaction}
                categories={categories}
                wallets={wallets}
            />

            {/* Delete Confirmation Modal */}
            <DeleteConfirmModal
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                transaction={deletingTransaction}
            />
        </AuthenticatedLayout>
    );
}


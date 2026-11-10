import { formatRupiah } from '@/Utils/format';
import {
    PocketBadge,
    MoneyBadge,
    ExpenseBadge,
    TargetBadge,
} from '@/Components/Icons/ColorBadges';

export default function SummaryCards({ metrics }) {
    const isPositiveBalance = metrics.total_balance >= 0;

    // Calculate ratio of expense to income for this month or overall
    const totalFlow = metrics.total_income;
    const expenseRatio = totalFlow > 0 ? Math.min(100, Math.round((metrics.total_expense / totalFlow) * 100)) : 0;
    const savingsRatio = Math.max(0, 100 - expenseRatio);

    return (
        <div className="space-y-4">
            {/* Top Grid of 3 Clean Financial Metrics Aligned with Uangku Mascot Brand */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 1. Main Net Balance Card: Total Semua Uang (Golden Coin & Asset Reserve) */}
                <div className="glass-card relative overflow-hidden p-6 rounded-3xl border border-slate-200 dark:border-[#1E3158]/70 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 dark:bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative z-10 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
                                Total Seluruh Uang
                            </span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-800 dark:bg-amber-500/10 dark:text-amber-300 border border-amber-200 dark:border-amber-500/20">
                                Seluruh Dompet
                            </span>
                        </div>

                        <PocketBadge className="w-12 h-12" />
                    </div>

                    <div className="relative z-10 my-4">
                        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight tabular-nums text-slate-900 dark:text-white">
                            {formatRupiah(metrics.total_balance)}
                        </h2>

                        <div className="mt-3 flex flex-wrap items-center gap-2">
                            {/* Live Status Frosted Pill */}
                            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-md border ${
                                isPositiveBalance
                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30'
                                    : 'bg-rose-50 text-rose-800 border-rose-300 dark:bg-rose-500/15 dark:text-rose-300 dark:border-rose-500/30'
                            }`}>
                                <span className="relative flex h-2 w-2">
                                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isPositiveBalance ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                                    <span className={`relative inline-flex rounded-full h-2 w-2 ${isPositiveBalance ? 'bg-emerald-600 dark:bg-emerald-500' : 'bg-rose-600 dark:bg-rose-500'}`}></span>
                                </span>
                                <span>{isPositiveBalance ? 'Kondisi Kas Sehat' : 'Defisit Pengeluaran'}</span>
                            </div>

                            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                                Cash + Saldo Bank + E-Wallet
                            </span>
                        </div>
                    </div>

                    <div className="relative z-10 pt-3 border-t border-slate-200/80 dark:border-[#1E3158]/60 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                        <span>Pergerakan Bulan Ini:</span>
                        <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg font-semibold tabular-nums text-xs border ${
                            metrics.month_balance >= 0
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300/80 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20'
                                : 'bg-rose-50 text-rose-800 border-rose-300/80 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20'
                        }`}>
                            {metrics.month_balance >= 0 ? '+' : ''}{formatRupiah(metrics.month_balance)}
                        </div>
                    </div>
                </div>

                {/* 2. Total Pemasukan Card (Sprout Green) */}
                <div className="glass-card relative overflow-hidden p-6 rounded-3xl border border-slate-200 dark:border-[#1E3158]/70 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group">
                    <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/10 dark:bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative z-10 flex items-center justify-between">
                        <span className="text-xs font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
                            Total Pemasukan
                        </span>

                        <MoneyBadge className="w-12 h-12" />
                    </div>

                    <div className="relative z-10 my-4">
                        <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight tabular-nums text-slate-900 dark:text-white">
                            {formatRupiah(metrics.total_income)}
                        </h3>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
                            Akumulasi seluruh arus masuk
                        </p>
                    </div>

                    <div className="relative z-10 pt-3 border-t border-slate-200/80 dark:border-[#1E3158]/60 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                        <span>Pemasukan Bulan Ini:</span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-300/80 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400 font-semibold tabular-nums">
                            {formatRupiah(metrics.month_income)}
                        </span>
                    </div>
                </div>

                {/* 3. Total Pengeluaran Card (Squirrel Coral Blush) */}
                <div className="glass-card relative overflow-hidden p-6 rounded-3xl border border-slate-200 dark:border-[#1E3158]/70 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group">
                    <div className="absolute top-0 right-0 w-36 h-36 bg-rose-500/10 dark:bg-rose-500/15 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative z-10 flex items-center justify-between">
                        <span className="text-xs font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
                            Total Pengeluaran
                        </span>

                        <ExpenseBadge className="w-12 h-12" />
                    </div>

                    <div className="relative z-10 my-4">
                        <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight tabular-nums text-slate-900 dark:text-white">
                            {formatRupiah(metrics.total_expense)}
                        </h3>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
                            Akumulasi seluruh arus keluar
                        </p>
                    </div>

                    <div className="relative z-10 pt-3 border-t border-slate-200/80 dark:border-[#1E3158]/60 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                        <span>Pengeluaran Bulan Ini:</span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-rose-50 text-rose-800 border border-rose-300/80 dark:bg-rose-500/10 dark:border-rose-500/20 dark:text-rose-400 font-semibold tabular-nums">
                            {formatRupiah(metrics.month_expense)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Cashflow Proportion Bar */}
            {metrics.total_income > 0 && (
                <div className="glass-card rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-[#1E3158]/70">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs font-medium text-slate-600 dark:text-slate-300 mb-2.5">
                        <div className="flex items-center gap-2.5">
                            <TargetBadge className="w-8 h-8 rounded-xl" />
                            <span className="font-bold text-slate-800 dark:text-slate-200">
                                Alokasi Arus Kas Keseluruhan
                            </span>
                        </div>

                        <div className="flex items-center gap-3 text-xs font-semibold">
                            <div className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm"></span>
                                <span className="text-slate-600 dark:text-slate-300">Tersimpan: <strong className="text-emerald-700 dark:text-emerald-400">{savingsRatio}%</strong></span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-sm"></span>
                                <span className="text-slate-600 dark:text-slate-300">Terpakai: <strong className="text-rose-700 dark:text-rose-400">{expenseRatio}%</strong></span>
                            </div>
                        </div>
                    </div>

                    <div className="w-full h-3 rounded-full bg-slate-200/90 dark:bg-[#0A1120] p-0.5 overflow-hidden flex gap-1 border border-slate-300/60 dark:border-[#1E3158]">
                        <div
                            className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-full rounded-full transition-all duration-700 shadow-sm"
                            style={{ width: `${Math.max(2, savingsRatio)}%` }}
                            title={`Sisa tabungan: ${savingsRatio}%`}
                        />
                        <div
                            className="bg-gradient-to-r from-rose-500 to-rose-400 h-full rounded-full transition-all duration-700 shadow-sm"
                            style={{ width: `${Math.max(2, expenseRatio)}%` }}
                            title={`Pengeluaran: ${expenseRatio}%`}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

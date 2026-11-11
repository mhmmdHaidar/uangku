import { formatRupiah } from '@/Utils/format';
import { useState } from 'react';
import { PieChart, ArrowUpRight, ArrowDownLeft, Tag } from '@/Components/Icons/PhosphorDuotone';

export default function CategoryBreakdown({
    expenseCategories = [],
    incomeCategories = [],
}) {
    const [activeTab, setActiveTab] = useState('expense');

    const categories = activeTab === 'expense' ? expenseCategories : incomeCategories;
    const isExpense = activeTab === 'expense';

    return (
        <div className="glass-card rounded-3xl p-6 space-y-5 border border-slate-200/90 dark:border-white/[0.08]">
            {/* Header with Tab Switcher */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-100 dark:border-white/5">
                <div>
                    <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2 tracking-tight">
                        <PieChart className="w-5 h-5 text-blue-600 dark:text-zinc-200" />
                        Analisis Alokasi Kategori
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                        Distribusi persentase aliran dana berdasarkan kategori transaksi
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex items-center p-1 bg-slate-100/80 dark:bg-[#161619] rounded-xl border border-slate-200/60 dark:border-[#2C2C32] self-start sm:self-auto">
                    <button
                        type="button"
                        onClick={() => setActiveTab('expense')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                            activeTab === 'expense'
                                ? 'bg-white dark:bg-[#2A2A32] text-rose-600 dark:text-rose-400 shadow-sm'
                                : 'text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-200'
                        }`}
                    >
                        <ArrowUpRight className="w-3.5 h-3.5" />
                        Pengeluaran
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('income')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                            activeTab === 'income'
                                ? 'bg-white dark:bg-[#2A2A32] text-emerald-600 dark:text-emerald-400 shadow-sm'
                                : 'text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-200'
                        }`}
                    >
                        <ArrowDownLeft className="w-3.5 h-3.5" />
                        Pemasukan
                    </button>
                </div>
            </div>

            {/* Category List */}
            {categories.length > 0 ? (
                <div className="space-y-4">
                    {categories.map((item, idx) => (
                        <div key={item.category} className="space-y-1.5">
                            <div className="flex items-center justify-between text-xs font-medium">
                                <div className="flex items-center gap-2 min-w-0">
                                    <span className="w-5 h-5 rounded-lg bg-slate-100 dark:bg-white/[0.06] border border-slate-200/60 dark:border-white/5 text-[10px] font-bold flex items-center justify-center text-slate-500 dark:text-slate-400">
                                        {idx + 1}
                                    </span>
                                    <span className="font-semibold text-slate-800 dark:text-slate-100 truncate">
                                        {item.category}
                                    </span>
                                    <span className="text-slate-400 text-[11px]">
                                        ({item.count} transaksi)
                                    </span>
                                </div>
                                <div className="flex items-center gap-2.5 shrink-0">
                                    <span className="font-bold tabular-nums text-slate-900 dark:text-white">
                                        {formatRupiah(item.total)}
                                    </span>
                                    <span className="w-12 text-right font-semibold text-slate-500 dark:text-slate-400 tabular-nums">
                                        {item.percentage}%
                                    </span>
                                </div>
                            </div>

                            {/* Progress bar with smooth gradient */}
                            <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-white/[0.05] overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-500 ${
                                        isExpense
                                            ? 'bg-gradient-to-r from-rose-500 to-pink-500'
                                            : 'bg-gradient-to-r from-emerald-500 to-teal-400'
                                    }`}
                                    style={{ width: `${Math.max(2, item.percentage)}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="py-8 text-center text-xs text-slate-400 dark:text-slate-500">
                    Belum ada data transaksi {isExpense ? 'pengeluaran' : 'pemasukan'} pada periode ini.
                </div>
            )}
        </div>
    );
}


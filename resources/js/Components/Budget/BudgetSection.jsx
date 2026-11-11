import BudgetModal from '@/Components/Budget/BudgetModal';
import { formatRupiah } from '@/Utils/format';
import { Link, router } from '@inertiajs/react';
import { AlertTriangle, CheckCircle2, Gauge, Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

export default function BudgetSection({ budgets = [], compact = false }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBudget, setEditingBudget] = useState(null);

    const handleOpenCreate = () => {
        setEditingBudget(null);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (budget) => {
        setEditingBudget(budget);
        setIsModalOpen(true);
    };

    const handleDelete = (budget) => {
        if (window.confirm(`Hapus anggaran bulanan untuk kategori "${budget.category}"?`)) {
            router.delete(route('budgets.destroy', budget.id), {
                preserveScroll: true,
            });
        }
    };

    const displayedBudgets = compact ? budgets.slice(0, 4) : budgets;

    const totalLimit = budgets.reduce((sum, b) => sum + (Number(b.limit_amount) || 0), 0);
    const totalSpent = budgets.reduce((sum, b) => sum + (Number(b.spent_amount) || 0), 0);

    return (
        <>
            <section className="glass-card rounded-3xl p-5 sm:p-6 border border-slate-200/90 dark:border-[#2C2C32] space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-100 dark:border-white/5">
                    <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                            <Gauge className="w-5 h-5 text-[#00105B] dark:text-zinc-200" />
                            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
                                Anggaran Bulanan Kategori
                            </h3>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-zinc-400">
                            {budgets.length > 0
                                ? `Terpakai bulan ini ${formatRupiah(totalSpent)} dari total anggaran ${formatRupiah(totalLimit)}`
                                : 'Pantau batas pengeluaran tiap kategori secara real-time di bulan berjalan.'}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleOpenCreate}
                        className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#00105B] hover:bg-[#000B42] dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-950 text-xs font-bold shadow-xs transition active:scale-95 shrink-0"
                    >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Atur Anggaran</span>
                    </button>
                </div>

                {displayedBudgets.length > 0 ? (
                    <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                        {displayedBudgets.map((budget) => {
                            const isExceeded = budget.status === 'exceeded';
                            const isWarning = budget.status === 'warning';
                            const barWidth = Math.min(100, Math.max(2, budget.percentage));

                            const barClass = isExceeded
                                ? 'bg-gradient-to-r from-rose-500 to-red-500'
                                : isWarning
                                    ? 'bg-gradient-to-r from-amber-500 to-orange-400'
                                    : 'bg-gradient-to-r from-emerald-500 to-teal-400';

                            const badgeClass = isExceeded
                                ? 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/15 dark:text-rose-300 dark:border-rose-500/30'
                                : isWarning
                                    ? 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30'
                                    : 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30';

                            return (
                                <div
                                    key={budget.id}
                                    className="p-4 rounded-2xl bg-slate-50/90 dark:bg-[#161619] border border-slate-200/80 dark:border-[#2C2C32] space-y-2.5"
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                                                    {budget.category}
                                                </h4>
                                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${badgeClass}`}>
                                                    {isExceeded || isWarning ? (
                                                        <AlertTriangle className="w-3 h-3" />
                                                    ) : (
                                                        <CheckCircle2 className="w-3 h-3" />
                                                    )}
                                                    <span>
                                                        {isExceeded ? 'Melebihi Batas' : isWarning ? 'Hampir Habis' : 'Aman'}
                                                    </span>
                                                </span>
                                            </div>
                                            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 tabular-nums">
                                                <strong className="text-slate-800 dark:text-zinc-100">
                                                    {formatRupiah(budget.spent_amount)}
                                                </strong>{' '}
                                                / {formatRupiah(budget.limit_amount)}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-1 shrink-0">
                                            <button
                                                type="button"
                                                onClick={() => handleOpenEdit(budget)}
                                                title="Edit batas anggaran"
                                                className="p-1.5 rounded-lg text-slate-400 hover:text-[#00105B] dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-[#242429] transition"
                                            >
                                                <Pencil className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleDelete(budget)}
                                                title="Hapus anggaran"
                                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-[#242429] overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-500 ${barClass}`}
                                            style={{ width: `${barWidth}%` }}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between text-[11px] font-medium">
                                        <span className="text-slate-500 dark:text-zinc-400 tabular-nums">
                                            {budget.percentage}% terpakai
                                        </span>
                                        <span
                                            className={`font-bold tabular-nums ${
                                                budget.remaining_amount >= 0
                                                    ? 'text-emerald-700 dark:text-emerald-400'
                                                    : 'text-rose-600 dark:text-rose-400'
                                            }`}
                                        >
                                            {budget.remaining_amount >= 0
                                                ? `Sisa ${formatRupiah(budget.remaining_amount)}`
                                                : `Lewat ${formatRupiah(Math.abs(budget.remaining_amount))}`}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    {compact && budgets.length > 4 && route().has('reports.index') && (
                        <div className="pt-2 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs">
                            <span className="text-slate-500 dark:text-zinc-400">
                                Menampilkan 4 dari {budgets.length} kategori anggaran
                            </span>
                            <Link
                                href={route('reports.index')}
                                prefetch
                                className="font-bold text-[#00105B] hover:text-[#001875] dark:text-zinc-200 dark:hover:text-white transition"
                            >
                                Lihat semua di Laporan &rarr;
                            </Link>
                        </div>
                    )}
                </>
                ) : (
                    <div className="py-5 px-4 rounded-2xl bg-slate-50/70 dark:bg-[#161619]/70 border border-dashed border-slate-300 dark:border-[#2C2C32] text-center space-y-1.5">
                        <p className="text-xs font-semibold text-slate-700 dark:text-zinc-200">
                            Belum ada anggaran kategori bulan ini
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-zinc-400 max-w-md mx-auto">
                            Klik <strong>Atur Anggaran</strong> untuk menetapkan batas pengeluaran bulanan seperti Makanan, Transportasi, atau Belanja.
                        </p>
                    </div>
                )}
            </section>

            <BudgetModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                budgetToEdit={editingBudget}
                existingBudgetCategories={budgets.map((b) => b.category)}
            />
        </>
    );
}


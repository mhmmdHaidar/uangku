import Modal from '@/Components/Modal';
import GoldCoinLoader from '@/Components/Loaders/GoldCoinLoader';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { DEFAULT_CATEGORIES, formatNumberInput, terbilangRupiah } from '@/Utils/format';
import { useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { X } from '@/Components/Icons/PhosphorDuotone';

export default function BudgetModal({
    isOpen,
    onClose,
    budgetToEdit = null,
    existingBudgetCategories = [],
}) {
    const isEditing = !!budgetToEdit;
    const { user_categories = [] } = usePage().props;

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        category: '',
        limit_amount: '',
    });

    const [displayLimit, setDisplayLimit] = useState('');

    useEffect(() => {
        if (isOpen) {
            clearErrors();
            if (budgetToEdit) {
                const initVal = budgetToEdit.limit_amount || '';
                setDisplayLimit(initVal ? formatNumberInput(initVal) : '');
                setData({
                    category: budgetToEdit.category || '',
                    limit_amount: initVal,
                });
            } else {
                reset();
                setDisplayLimit('');
                setData({
                    category: '',
                    limit_amount: '',
                });
            }
        }
    }, [isOpen, budgetToEdit]);

    const handleAmountChange = (e) => {
        const rawDigits = e.target.value.replace(/\D/g, '');
        if (!rawDigits) {
            setDisplayLimit('');
            setData('limit_amount', '');
            return;
        }
        const numericVal = parseInt(rawDigits, 10);
        setDisplayLimit(new Intl.NumberFormat('id-ID').format(numericVal));
        setData('limit_amount', numericVal);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (isEditing) {
            put(route('budgets.update', budgetToEdit.id), {
                preserveScroll: true,
                onSuccess: () => {
                    onClose();
                    reset();
                },
            });
        } else {
            post(route('budgets.store'), {
                preserveScroll: true,
                onSuccess: () => {
                    onClose();
                    reset();
                },
            });
        }
    };

    // Build expense category chips
    const dbExpenseCategories = (user_categories || [])
        .filter((c) => c.type === 'expense')
        .map((c) => c.name);
    const categorySuggestions = Array.from(
        new Set([...dbExpenseCategories, ...(DEFAULT_CATEGORIES.expense || [])])
    );

    return (
        <>
            <Modal show={isOpen} onClose={onClose} maxWidth="md" closeable={!processing}>
                <div className="relative">
                    <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-[#2C2C32]">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                {isEditing ? 'Edit Anggaran Bulanan' : 'Atur Anggaran Kategori'}
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-zinc-400">
                                Tetapkan batas pengeluaran bulanan agar belanja tetap terkontrol.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={onClose}
                            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-[#242429] transition"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                        {/* Kategori Pengeluaran */}
                        <div>
                            <InputLabel
                                htmlFor="budget-category"
                                value="Kategori Pengeluaran"
                                className="text-xs uppercase tracking-wider text-slate-500 dark:text-zinc-400 font-semibold"
                            />
                            <TextInput
                                id="budget-category"
                                type="text"
                                placeholder="Pilih chip di bawah atau ketik nama kategori..."
                                value={data.category}
                                onChange={(e) => setData('category', e.target.value)}
                                className="mt-1 w-full text-sm"
                                disabled={isEditing}
                                required
                            />
                            {!isEditing && (
                                <div className="mt-2 flex flex-wrap gap-1.5">
                                    {categorySuggestions.map((name) => {
                                        const isSelected = data.category === name;
                                        const alreadySet = existingBudgetCategories.includes(name);
                                        return (
                                            <button
                                                key={name}
                                                type="button"
                                                onClick={() => setData('category', name)}
                                                className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition ${
                                                    isSelected
                                                        ? 'bg-[#00105B]/10 dark:bg-[#26262C] text-[#00105B] dark:text-white border-[#00105B] dark:border-zinc-300 font-semibold'
                                                        : 'bg-white dark:bg-[#151518] text-slate-700 dark:text-zinc-400 border-slate-300 dark:border-[#2C2C32] hover:border-slate-400'
                                                }`}
                                            >
                                                {name}{alreadySet ? ' •' : ''}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                            <InputError message={errors.category} className="mt-1" />
                        </div>

                        {/* Batas Anggaran Bulanan */}
                        <div>
                            <InputLabel
                                htmlFor="budget-limit"
                                value="Batas Anggaran per Bulan (Rp)"
                                className="text-xs uppercase tracking-wider text-slate-500 dark:text-zinc-400 font-semibold"
                            />
                            <div className="relative mt-1">
                                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-zinc-500 font-bold text-sm">
                                    Rp
                                </span>
                                <TextInput
                                    id="budget-limit"
                                    type="text"
                                    inputMode="numeric"
                                    placeholder="Contoh: 1.500.000"
                                    value={displayLimit}
                                    onChange={handleAmountChange}
                                    className="pl-11 w-full text-base font-bold tabular-nums"
                                    required
                                />
                            </div>

                            {data.limit_amount > 0 && (
                                <div className="mt-1.5 flex items-center gap-1.5 text-xs text-[#00105B] dark:text-zinc-200 bg-[#00105B]/10 dark:bg-[#242429] px-2.5 py-1 rounded-xl border border-[#00105B]/20 dark:border-[#32323A]">
                                    <span className="font-semibold shrink-0">Terbaca:</span>
                                    <span className="italic font-medium truncate">
                                        {terbilangRupiah(data.limit_amount)}
                                    </span>
                                </div>
                            )}

                            <InputError message={errors.limit_amount} className="mt-1" />
                        </div>

                        <div className="pt-3 border-t border-slate-200 dark:border-white/10 flex items-center justify-end gap-3">
                            <SecondaryButton type="button" onClick={onClose} disabled={processing}>
                                Batal
                            </SecondaryButton>
                            <PrimaryButton type="submit" disabled={processing}>
                                {processing ? 'Menyimpan...' : isEditing ? 'Simpan Perubahan' : 'Simpan Anggaran'}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </Modal>

            <GoldCoinLoader
                show={processing}
                message="Menyimpan anggaran bulanan..."
                subMessage="Menyelaraskan target pengeluaran"
            />
        </>
    );
}

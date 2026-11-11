import Modal from '@/Components/Modal';
import GoldCoinLoader from '@/Components/Loaders/GoldCoinLoader';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { DEFAULT_CATEGORIES, formatNumberInput, terbilangRupiah } from '@/Utils/format';
import { useForm, usePage, router } from '@inertiajs/react';
import { ArrowLeftRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
    ArrowDownLeft,
    ArrowUpRight,
    X,
    Calendar,
    Tag,
    FileText,
    Banknote,
    CreditCard,
    Smartphone,
    TrendingUp,
    WalletIcon,
    Plus,
} from '@/Components/Icons/PhosphorDuotone';
import {
    CardBadge,
    MoneyBadge,
    PhoneBadge,
    CoinsBadge,
    WalletBadge,
} from '@/Components/Icons/ColorBadges';

const WALLET_BADGES = {
    bank: CardBadge,
    cash: MoneyBadge,
    ewallet: PhoneBadge,
    investment: CoinsBadge,
    other: WalletBadge,
};

export default function TransactionModal({
    isOpen,
    onClose,
    transactionToEdit = null,
    wallets = [],
    categories = [],
    defaultWalletId = null,
}) {
    const isEditing = !!transactionToEdit;

    // Get today's date formatted as YYYY-MM-DD
    const today = new Date().toISOString().split('T')[0];
    const fallbackWalletId = defaultWalletId || (wallets.length > 0 ? wallets[0].id : '');
    const fallbackToWalletId = wallets.find((w) => String(w.id) !== String(fallbackWalletId))?.id || '';

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        title: '',
        type: 'expense', // 'expense' | 'income' | 'transfer'
        wallet_id: fallbackWalletId,
        to_wallet_id: fallbackToWalletId,
        amount: '',
        category: '',
        transaction_date: today,
        notes: '',
    });

    const [displayAmount, setDisplayAmount] = useState('');

    const { user_categories = [], categories: sharedCategories = [] } = usePage().props;
    const [isAddingCategory, setIsAddingCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [categoryLoading, setCategoryLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            clearErrors();
            setIsAddingCategory(false);
            setNewCategoryName('');
            if (transactionToEdit) {
                const initAmount = transactionToEdit.amount || '';
                const editFromId = transactionToEdit.wallet_id || fallbackWalletId;
                const editToId =
                    transactionToEdit.to_wallet_id ||
                    wallets.find((w) => String(w.id) !== String(editFromId))?.id ||
                    '';
                setDisplayAmount(initAmount ? formatNumberInput(initAmount) : '');
                setData({
                    title: transactionToEdit.title || '',
                    type: transactionToEdit.type || 'expense',
                    wallet_id: editFromId,
                    to_wallet_id: editToId,
                    amount: initAmount,
                    category: transactionToEdit.category || '',
                    transaction_date: transactionToEdit.transaction_date
                        ? transactionToEdit.transaction_date.substring(0, 10)
                        : today,
                    notes: transactionToEdit.notes || '',
                });
            } else {
                reset();
                setDisplayAmount('');
                setData({
                    title: '',
                    type: 'expense',
                    wallet_id: fallbackWalletId,
                    to_wallet_id: fallbackToWalletId,
                    amount: '',
                    category: '',
                    transaction_date: today,
                    notes: '',
                });
            }
        }
    }, [isOpen, transactionToEdit, wallets, defaultWalletId]);

    const handleTypeSwitch = (nextType) => {
        if (nextType === 'transfer') {
            const firstOther = wallets.find((w) => String(w.id) !== String(data.wallet_id))?.id || '';
            setData((prev) => ({
                ...prev,
                type: 'transfer',
                to_wallet_id: String(prev.to_wallet_id) && String(prev.to_wallet_id) !== String(prev.wallet_id) ? prev.to_wallet_id : firstOther,
                category: '',
            }));
            return;
        }
        setData('type', nextType);
    };

    const handleSourceWalletChange = (newFromId) => {
        if (data.type === 'transfer' && String(data.to_wallet_id) === String(newFromId)) {
            const other = wallets.find((w) => String(w.id) !== String(newFromId))?.id || '';
            setData((prev) => ({ ...prev, wallet_id: newFromId, to_wallet_id: other }));
            return;
        }
        setData('wallet_id', newFromId);
    };

    const handleAmountChange = (e) => {
        const rawDigits = e.target.value.replace(/\D/g, '');
        if (!rawDigits) {
            setDisplayAmount('');
            setData('amount', '');
            return;
        }
        const numericVal = parseInt(rawDigits, 10);
        setDisplayAmount(new Intl.NumberFormat('id-ID').format(numericVal));
        setData('amount', numericVal);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (isEditing) {
            put(route('transactions.update', transactionToEdit.id), {
                preserveScroll: true,
                onSuccess: () => {
                    onClose();
                    reset();
                },
            });
        } else {
            post(route('transactions.store'), {
                preserveScroll: true,
                onSuccess: () => {
                    onClose();
                    reset();
                },
            });
        }
    };

    // Category suggestions for the current type
    // Prefer user_categories from DB, then categories prop/shared, fallback to DEFAULT_CATEGORIES
    const allCategoriesList = (user_categories && user_categories.length > 0)
        ? user_categories
        : (categories && categories.length > 0 && typeof categories[0] === 'object')
            ? categories
            : (sharedCategories && sharedCategories.length > 0 && typeof sharedCategories[0] === 'object')
                ? sharedCategories
                : null;

    let categoryOptions = [];
    if (allCategoriesList) {
        categoryOptions = allCategoriesList
            .filter((c) => (c.type ? c.type === data.type : true))
            .map((c) => ({ id: c.id, name: c.name, type: c.type || data.type }));
    } else {
        const fallbackList = (categories && categories.length > 0) ? categories : (DEFAULT_CATEGORIES[data.type] || []);
        categoryOptions = fallbackList.map((item) => ({
            id: typeof item === 'object' ? item.id : null,
            name: typeof item === 'object' ? item.name : String(item),
            type: data.type,
        }));
    }

    const handleAddCategory = () => {
        const trimmed = newCategoryName.trim();
        if (!trimmed) return;

        setCategoryLoading(true);
        router.post(
            route('categories.store'),
            {
                name: trimmed,
                type: data.type,
            },
            {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    setData('category', trimmed);
                    setNewCategoryName('');
                    setIsAddingCategory(false);
                    setCategoryLoading(false);
                },
                onError: () => {
                    setCategoryLoading(false);
                },
            }
        );
    };

    const handleDeleteCategory = (cat) => {
        if (!cat || !cat.id) return;
        if (window.confirm(`Hapus kategori "${cat.name}"?`)) {
            router.delete(route('categories.destroy', cat.id), {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    if (data.category === cat.name) {
                        setData('category', '');
                    }
                },
            });
        }
    };

    return (
        <>
            <Modal show={isOpen} onClose={onClose} maxWidth="lg" closeable={!processing}>
            <div className="relative">
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-white/10">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                            {isEditing ? 'Perbarui Transaksi' : 'Catat Transaksi Baru'}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            {isEditing
                                ? 'Ubah rincian transaksi keuangan Anda.'
                                : 'Catat setiap pemasukan atau pengeluaran secara teratur.'}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#242429] transition"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                    {/* 1. Transaction Type Toggle (Pengeluaran / Pemasukan / Transfer) */}
                    <div>
                        <InputLabel value="Jenis Transaksi" className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold mb-1" />
                        <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 dark:bg-[#161619] rounded-2xl border border-slate-200 dark:border-[#2C2C32]">
                            <button
                                type="button"
                                onClick={() => handleTypeSwitch('expense')}
                                className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-150 ${
                                    data.type === 'expense'
                                        ? 'bg-white dark:bg-[#2A2A32] text-rose-600 dark:text-rose-400 shadow-sm border border-slate-300 dark:border-[#3E3E46]'
                                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                                }`}
                            >
                                <ArrowUpRight className="w-4 h-4 shrink-0" />
                                <span>Keluar</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => handleTypeSwitch('income')}
                                className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-150 ${
                                    data.type === 'income'
                                        ? 'bg-white dark:bg-[#2A2A32] text-emerald-600 dark:text-emerald-400 shadow-sm border border-slate-300 dark:border-[#3E3E46]'
                                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                                }`}
                            >
                                <ArrowDownLeft className="w-4 h-4 shrink-0" />
                                <span>Masuk</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => handleTypeSwitch('transfer')}
                                className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-150 ${
                                    data.type === 'transfer'
                                        ? 'bg-white dark:bg-[#2A2A32] text-[#00105B] dark:text-sky-400 shadow-sm border border-slate-300 dark:border-[#3E3E46]'
                                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                                }`}
                            >
                                <span className="text-sm leading-none font-bold">⇄</span>
                                <span>Transfer</span>
                            </button>
                        </div>
                        <InputError message={errors.type} className="mt-1" />
                    </div>

                    {/* 2. Wallet Selector (User's Registered Wallets) */}
                    <div>
                        <InputLabel
                            value={data.type === 'transfer' ? 'Dompet Asal (Pengirim)' : 'Pilih Dompet / Rekening'}
                            className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold mb-1"
                        />
                        {wallets.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {wallets.map((w) => {
                                    const Badge = WALLET_BADGES[w.type] || WalletBadge;
                                    const isSelected = String(data.wallet_id) === String(w.id);
                                    return (
                                        <button
                                            key={w.id}
                                            type="button"
                                            onClick={() => handleSourceWalletChange(w.id)}
                                            className={`flex items-center gap-2.5 p-2 rounded-xl border text-left transition-all ${
                                                isSelected
                                                    ? 'bg-[#00105B]/10 dark:bg-[#26262C] border-[#00105B] dark:border-zinc-300 text-[#00105B] dark:text-white ring-1 ring-[#00105B]/25 dark:ring-zinc-300/20 shadow-xs'
                                                    : 'bg-white dark:bg-[#151518] border-slate-300 dark:border-[#2C2C32] text-slate-700 dark:text-zinc-300 hover:border-slate-400 dark:hover:border-[#3E3E46] shadow-2xs'
                                            }`}
                                        >
                                            <Badge className="w-8 h-8 rounded-xl shrink-0" />
                                            <div className="min-w-0">
                                                <p className="text-xs font-bold leading-tight truncate">{w.name}</p>
                                                <p className="text-[10px] text-slate-400 truncate capitalize">{w.type}</p>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-xs text-slate-400 italic">
                                Belum ada dompet terdaftar. Tambahkan dompet terlebih dahulu di halaman Dompet.
                            </div>
                        )}
                        <InputError message={errors.wallet_id} className="mt-1" />
                    </div>

                    {/* 2b. Destination Wallet Selector (Hanya untuk Transfer) */}
                    {data.type === 'transfer' && (
                        <div>
                            <InputLabel value="Dompet Tujuan (Penerima)" className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold mb-1" />
                            {wallets.length >= 2 ? (
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                    {wallets
                                        .filter((w) => String(w.id) !== String(data.wallet_id))
                                        .map((w) => {
                                            const Badge = WALLET_BADGES[w.type] || WalletBadge;
                                            const isSelected = String(data.to_wallet_id) === String(w.id);
                                            return (
                                                <button
                                                    key={w.id}
                                                    type="button"
                                                    onClick={() => setData('to_wallet_id', w.id)}
                                                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition-all duration-150 ${
                                                        isSelected
                                                            ? 'border-[#00105B] bg-[#00105B]/10 text-[#00105B] dark:border-sky-400/60 dark:bg-sky-500/15 dark:text-sky-300 shadow-sm'
                                                            : 'border-slate-200 dark:border-[#2C2C32] bg-slate-50/70 dark:bg-[#161619] text-slate-700 dark:text-zinc-300 hover:border-slate-300 dark:hover:border-white/20'
                                                    }`}
                                                >
                                                    <Badge className="w-6 h-6 shrink-0" />
                                                    <span className="text-xs font-semibold truncate">{w.name}</span>
                                                </button>
                                            );
                                        })}
                                </div>
                            ) : (
                                <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
                                    Transfer membutuhkan minimal 2 dompet. Tambahkan dompet lain terlebih dahulu di menu Dompet.
                                </div>
                            )}
                            <InputError message={errors.to_wallet_id} className="mt-1" />
                        </div>
                    )}

                    {/* 3. Amount Input with Indonesian Rupiah formatting & Terbilang preview */}
                    <div>
                        <div className="flex items-center justify-between">
                            <InputLabel htmlFor="amount" value="Nominal Transaksi (Rp)" className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold" />
                            {data.amount > 0 && (
                                <span className="text-[11px] font-bold text-[#00105B] dark:text-zinc-200 tabular-nums">
                                    Rp {displayAmount}
                                </span>
                            )}
                        </div>
                        <div className="relative mt-1">
                            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500 font-bold text-sm">
                                Rp
                            </span>
                            <TextInput
                                id="amount"
                                type="text"
                                inputMode="numeric"
                                placeholder="0"
                                value={displayAmount}
                                onChange={handleAmountChange}
                                className="pl-11 w-full text-lg sm:text-xl font-bold tabular-nums tracking-wide"
                                required
                                autoFocus={!isEditing}
                            />
                        </div>

                        {/* Live Terbilang Preview to prevent typos/extra zeros */}
                        {data.amount > 0 && (
                            <div className="mt-1.5 flex items-center gap-1.5 text-xs text-[#00105B] dark:text-zinc-200 bg-[#00105B]/10 dark:bg-[#242429] px-2.5 py-1 rounded-xl border border-[#00105B]/20 dark:border-[#32323A]">
                                <span className="font-semibold shrink-0">Terbaca:</span>
                                <span className="italic font-medium truncate">{terbilangRupiah(data.amount)}</span>
                            </div>
                        )}

                        <InputError message={errors.amount} className="mt-1" />
                    </div>

                    {/* 4. Title / Description */}
                    <div>
                        <InputLabel htmlFor="title" value="Judul / Keterangan" className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold" />
                        <TextInput
                            id="title"
                            type="text"
                            placeholder={
                                data.type === 'transfer'
                                    ? 'Contoh: Tarik Tunai ATM, Top Up GoPay'
                                    : data.type === 'expense'
                                      ? 'Contoh: Makan Siang, Bensin, Beli Pulsa'
                                      : 'Contoh: Gaji Bulanan, Bonus Proyek'
                            }
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            className="mt-1 w-full"
                            required
                        />
                        <InputError message={errors.title} className="mt-1" />
                    </div>

                    {/* 5. Category & Quick Chips (disembunyikan untuk Transfer) */}
                    {data.type !== 'transfer' && (
                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <InputLabel htmlFor="category" value="Kategori" className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold" />
                            <div className="flex items-center gap-2">
                                {!isAddingCategory && (
                                    <button
                                        type="button"
                                        onClick={() => setIsAddingCategory(true)}
                                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#00105B] dark:text-zinc-200 hover:opacity-80 dark:hover:text-white transition"
                                    >
                                        <Plus className="w-3.5 h-3.5" />
                                        <span>Kategori Baru</span>
                                    </button>
                                )}
                                <span className="text-[11px] text-slate-400">Opsional</span>
                            </div>
                        </div>

                        {/* Inline Add Category Input */}
                        {isAddingCategory && (
                            <div className="mb-2 p-2 rounded-xl bg-slate-50 dark:bg-[#161619] border border-[#00105B]/25 dark:border-[#32323A] flex items-center gap-2">
                                <input
                                    type="text"
                                    placeholder={`Nama kategori ${data.type === 'expense' ? 'pengeluaran' : 'pemasukan'}...`}
                                    value={newCategoryName}
                                    onChange={(e) => setNewCategoryName(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleAddCategory();
                                        } else if (e.key === 'Escape') {
                                            setIsAddingCategory(false);
                                            setNewCategoryName('');
                                        }
                                    }}
                                    className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-[#2C2C32] bg-white dark:bg-[#151518] text-slate-800 dark:text-zinc-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00105B]/20 dark:focus:ring-zinc-400/20 focus:border-[#00105B] dark:focus:border-zinc-400"
                                    autoFocus
                                    disabled={categoryLoading}
                                />
                                <button
                                    type="button"
                                    onClick={handleAddCategory}
                                    disabled={categoryLoading || !newCategoryName.trim()}
                                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#00105B] hover:bg-[#000B42] dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-950 transition disabled:opacity-50 shrink-0 shadow-xs"
                                >
                                    {categoryLoading ? '...' : 'Tambah'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsAddingCategory(false);
                                        setNewCategoryName('');
                                    }}
                                    disabled={categoryLoading}
                                    className="px-2 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-[#242429] transition shrink-0"
                                >
                                    Batal
                                </button>
                            </div>
                        )}

                        <TextInput
                            id="category"
                            type="text"
                            placeholder="Pilih di bawah atau ketik manual..."
                            value={data.category}
                            onChange={(e) => setData('category', e.target.value)}
                            className="mt-1 w-full text-sm"
                        />
                        {/* Quick Category Chips with Delete Option */}
                        <div className="mt-2 flex flex-wrap gap-1.5">
                            {categoryOptions.map((cat) => {
                                const isSelected = data.category === cat.name;
                                return (
                                    <div
                                        key={cat.id || cat.name}
                                        className={`group inline-flex items-center rounded-lg text-xs font-medium border transition-colors ${
                                            isSelected
                                                ? 'bg-[#00105B]/10 dark:bg-[#26262C] text-[#00105B] dark:text-white border-[#00105B] dark:border-zinc-300 shadow-2xs font-semibold'
                                                : 'bg-white dark:bg-[#151518] text-slate-700 dark:text-zinc-400 border-slate-300 dark:border-[#2C2C32] hover:border-slate-400 dark:hover:border-[#3E3E46] shadow-2xs'
                                        }`}
                                    >
                                        <button
                                            type="button"
                                            onClick={() => setData('category', cat.name)}
                                            className="px-2.5 py-1 text-left"
                                        >
                                            {cat.name}
                                        </button>
                                        {cat.id && (
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteCategory(cat);
                                                }}
                                                title={`Hapus kategori "${cat.name}"`}
                                                className="pr-1.5 pl-0.5 py-1 text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 transition"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                        <InputError message={errors.category} className="mt-1" />
                    </div>
                    )}

                    {/* 6. Date */}
                    <div>
                        <InputLabel htmlFor="transaction_date" value="Tanggal Transaksi" className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold" />
                        <div className="relative mt-1">
                            <TextInput
                                id="transaction_date"
                                type="date"
                                value={data.transaction_date}
                                onChange={(e) => setData('transaction_date', e.target.value)}
                                className="w-full text-sm"
                                required
                            />
                        </div>
                        <InputError message={errors.transaction_date} className="mt-1" />
                    </div>

                    {/* 7. Notes (Optional) */}
                    <div>
                        <div className="flex items-center justify-between">
                            <InputLabel htmlFor="notes" value="Catatan Tambahan" className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold" />
                            <span className="text-[11px] text-slate-400">Opsional</span>
                        </div>
                        <textarea
                            id="notes"
                            rows={2}
                            placeholder="Rincian tambahan atau catatan..."
                            value={data.notes}
                            onChange={(e) => setData('notes', e.target.value)}
                            className="mt-1 w-full rounded-xl border border-slate-300 dark:border-[#2C2C32] bg-white dark:bg-[#151518] text-slate-800 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500 shadow-xs focus:border-[#00105B] dark:focus:border-zinc-400 focus:ring-2 focus:ring-[#00105B]/20 dark:focus:ring-zinc-400/20 text-sm resize-none"
                        />
                        <InputError message={errors.notes} className="mt-1" />
                    </div>

                    {/* Actions */}
                    <div className="pt-3 border-t border-slate-200 dark:border-white/10 flex items-center justify-end gap-3">
                        <SecondaryButton type="button" onClick={onClose} disabled={processing}>
                            Batal
                        </SecondaryButton>
                        <PrimaryButton
                            type="submit"
                            disabled={processing || (data.type === 'transfer' && wallets.length < 2)}
                        >
                            {processing
                                ? 'Menyimpan...'
                                : isEditing
                                  ? 'Simpan Perubahan'
                                  : data.type === 'transfer'
                                    ? 'Kirim Transfer'
                                    : 'Catat Transaksi'}
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </Modal>

        <GoldCoinLoader
            show={processing}
            message={isEditing ? 'Memperbarui transaksi...' : 'Mencatat transaksimu...'}
            subMessage="Menyelaraskan saldo dompet"
        />
    </>
    );
}

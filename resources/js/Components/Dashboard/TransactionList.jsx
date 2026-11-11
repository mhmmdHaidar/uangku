import { formatRupiah, formatDate } from '@/Utils/format';
import {
    ArrowDownLeftDuotone,
    ArrowUpRightDuotone,
    MagnifyingGlassDuotone,
    FunnelDuotone,
    PlusCircleDuotone,
    PencilSimpleDuotone,
    TrashDuotone,
    CaretLeftDuotone,
    CaretRightDuotone,
    XDuotone,
} from '@/Components/Icons/PhosphorDuotone';
import {
    SalaryBadge,
    FoodBadge,
    TransportBadge,
    ShoppingBadge,
    UtilityBadge,
    HealthBadge,
    EducationBadge,
    CoinsBadge,
    TechBadge,
    MoneyBadge,
    ExpenseBadge,
} from '@/Components/Icons/ColorBadges';
import { Link } from '@inertiajs/react';
import { useState, useMemo, useEffect } from 'react';

const getCategoryVisuals = (category = '', title = '', isIncome = false) => {
    const text = `${category} ${title}`.toLowerCase();

    if (text.includes('gaji') || text.includes('payroll') || text.includes('honor')) {
        return {
            Badge: SalaryBadge,
            glow: 'shadow-[0_0_12px_rgba(34,197,94,0.3)]',
        };
    }
    if (text.includes('makan') || text.includes('restoran') || text.includes('kuliner') || text.includes('kopi') || text.includes('sarapan') || text.includes('seafood') || text.includes('roti')) {
        return {
            Badge: FoodBadge,
            glow: 'shadow-[0_0_12px_rgba(249,115,22,0.3)]',
        };
    }
    if (text.includes('bensin') || text.includes('spbu') || text.includes('pertamax') || text.includes('transport') || text.includes('motor') || text.includes('mobil') || text.includes('parkir') || text.includes('servis')) {
        return {
            Badge: TransportBadge,
            glow: 'shadow-[0_0_12px_rgba(2,132,199,0.3)]',
        };
    }
    if (text.includes('belanja') || text.includes('supermarket') || text.includes('pasar') || text.includes('mall') || text.includes('baju') || text.includes('jaket')) {
        return {
            Badge: ShoppingBadge,
            glow: 'shadow-[0_0_12px_rgba(168,85,247,0.3)]',
        };
    }
    if (text.includes('listrik') || text.includes('pam') || text.includes('air') || text.includes('tagihan') || text.includes('internet') || text.includes('fiber') || text.includes('wifi')) {
        return {
            Badge: UtilityBadge,
            glow: 'shadow-[0_0_12px_rgba(234,179,8,0.3)]',
        };
    }
    if (text.includes('obat') || text.includes('apotek') || text.includes('sehat') || text.includes('dokter') || text.includes('vitamin') || text.includes('klinik')) {
        return {
            Badge: HealthBadge,
            glow: 'shadow-[0_0_12px_rgba(244,63,94,0.3)]',
        };
    }
    if (text.includes('buku') || text.includes('pendidikan') || text.includes('kursus') || text.includes('kuliah') || text.includes('sekolah')) {
        return {
            Badge: EducationBadge,
            glow: 'shadow-[0_0_12px_rgba(79,70,229,0.3)]',
        };
    }
    if (text.includes('dividen') || text.includes('reksadana') || text.includes('investasi') || text.includes('saham') || text.includes('kripto') || text.includes('bibit')) {
        return {
            Badge: CoinsBadge,
            glow: 'shadow-[0_0_12px_rgba(245,158,11,0.3)]',
        };
    }
    if (text.includes('freelance') || text.includes('proyek') || text.includes('klien') || text.includes('ui/ux') || text.includes('coding') || text.includes('aplikasi')) {
        return {
            Badge: TechBadge,
            glow: 'shadow-[0_0_12px_rgba(8,145,178,0.3)]',
        };
    }

    // Fallbacks
    if (isIncome) {
        return {
            Badge: MoneyBadge,
            glow: 'shadow-[0_0_12px_rgba(34,197,94,0.3)]',
        };
    }
    return {
        Badge: ExpenseBadge,
        glow: 'shadow-[0_0_12px_rgba(239,68,68,0.3)]',
    };
};

export default function TransactionList({
    transactions,
    allTransactions = [],
    wallets = [],
    filters = {},
    categories = [],
    hideWalletFilter = false,
    title = null,
    subtitle = null,
    onAddNew,
    onEdit,
    onDelete,
}) {
    // Determine raw full source of transactions
    const rawList = useMemo(() => {
        if (allTransactions && allTransactions.length > 0) return allTransactions;
        if (transactions?.data) return transactions.data;
        if (Array.isArray(transactions)) return transactions;
        return [];
    }, [allTransactions, transactions]);

    const [search, setSearch] = useState(filters.search || '');
    const [selectedType, setSelectedType] = useState(filters.type || '');
    const [selectedWalletId, setSelectedWalletId] = useState(filters.wallet_id || '');
    const [selectedCategory, setSelectedCategory] = useState(filters.category || '');
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 15;

    // Instant in-memory real-time filtering (0ms latency, zero load/reload)
    const filteredList = useMemo(() => {
        return rawList.filter((item) => {
            // Type filter
            if (selectedType && item.type !== selectedType) {
                return false;
            }
            // Wallet filter
            if (selectedWalletId && selectedWalletId !== 'all') {
                const matchId = String(item.wallet_id) === String(selectedWalletId);
                const matchLegacy = selectedWalletId === 'cash' && item.wallet === 'cash';
                if (!matchId && !matchLegacy) return false;
            }
            // Category filter
            if (selectedCategory && selectedCategory !== 'all') {
                if (item.category !== selectedCategory) return false;
            }
            // Search query
            if (search.trim()) {
                const q = search.toLowerCase();
                const matchTitle = item.title && item.title.toLowerCase().includes(q);
                const matchNotes = item.notes && item.notes.toLowerCase().includes(q);
                const matchCat = item.category && item.category.toLowerCase().includes(q);
                if (!matchTitle && !matchNotes && !matchCat) return false;
            }
            return true;
        });
    }, [rawList, selectedType, selectedWalletId, selectedCategory, search]);

    // Reset pagination to page 1 on any filter change
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedType, selectedWalletId, selectedCategory, search]);

    // Pagination calculations
    const totalFiltered = filteredList.length;
    const totalPages = Math.max(1, Math.ceil(totalFiltered / pageSize));
    const paginatedItems = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return filteredList.slice(start, start + pageSize);
    }, [filteredList, currentPage, pageSize]);

    const handleTypeChange = (type) => {
        setSelectedType((prev) => (prev === type ? '' : type));
    };

    const handleResetFilters = () => {
        setSearch('');
        setSelectedType('');
        setSelectedWalletId('');
        setSelectedCategory('');
        setCurrentPage(1);
    };

    const hasActiveFilters = Boolean(search || selectedType || selectedWalletId || selectedCategory);

    return (
        <div className="glass-card rounded-3xl p-5 sm:p-6 space-y-5 border border-slate-200 dark:border-[#1E3158]/70 shadow-sm">
            {/* Header: Title, Count & Add Button */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-200/80 dark:border-[#1E3158]/60">
                <div>
                    <div className="flex items-center gap-3">
                        <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
                            {title || 'Riwayat Transaksi'}
                        </h3>
                        {route().has('transactions.index') && (
                            <Link
                                href={route('transactions.index')}
                                prefetch
                                className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition group"
                            >
                                <span>Lihat Riwayat Lengkap</span>
                                <CaretRightDuotone className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                            </Link>
                        )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {subtitle || `${totalFiltered} catatan pergerakan arus kas`}
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={onAddNew}
                        type="button"
                        className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-xs font-semibold shadow-md shadow-blue-600/20 active:scale-95 transition-all duration-150 focus:outline-none"
                    >
                        <PlusCircleDuotone className="w-3.5 h-3.5" />
                        <span>Catat Transaksi</span>
                    </button>
                </div>
            </div>

            {/* Filter Toolbar: Real-Time Instant Filtering (No Loading / No Server Roundtrip) */}
            <div className="flex flex-col lg:flex-row gap-3">
                {/* Search Box */}
                <div className="relative flex-1">
                    <MagnifyingGlassDuotone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Cari transaksi langsung..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-9 pr-9 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-[#1E3158] bg-white dark:bg-[#0A1120]/80 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 shadow-xs transition"
                    />
                    {search && (
                        <button
                            type="button"
                            onClick={() => setSearch('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                        >
                            <XDuotone className="w-3.5 h-3.5" />
                        </button>
                    )}
                </div>

                {/* Filter Controls: Type, Wallet & Category Dropdown */}
                <div className="flex flex-wrap items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
                    {/* Phosphor Duotone Segmented Type Filter */}
                    <div className="flex items-center p-1 bg-slate-200/70 dark:bg-[#0A1120] rounded-xl border border-slate-300/80 dark:border-[#1E3158] shrink-0">
                        <button
                            type="button"
                            onClick={() => handleTypeChange('')}
                            className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                                selectedType === ''
                                    ? 'bg-white dark:bg-[#112143] text-slate-900 dark:text-white shadow-sm border border-slate-300/80 dark:border-blue-500/30'
                                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                            }`}
                        >
                            Semua
                        </button>
                        <button
                            type="button"
                            onClick={() => handleTypeChange('income')}
                            className={`px-3 py-1 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                                selectedType === 'income'
                                    ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 shadow-sm border border-emerald-500/30'
                                    : 'text-slate-600 dark:text-slate-400 hover:text-emerald-700'
                            }`}
                        >
                            <ArrowDownLeftDuotone className="w-3.5 h-3.5" />
                            <span>Pemasukan</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => handleTypeChange('expense')}
                            className={`px-3 py-1 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                                selectedType === 'expense'
                                    ? 'bg-rose-500/20 text-rose-700 dark:text-rose-400 shadow-sm border border-rose-500/30'
                                    : 'text-slate-600 dark:text-slate-400 hover:text-rose-700'
                            }`}
                        >
                            <ArrowUpRightDuotone className="w-3.5 h-3.5" />
                            <span>Pengeluaran</span>
                        </button>
                    </div>

                    {/* Wallet Filter Dropdown */}
                    {!hideWalletFilter && wallets.length > 0 && (
                        <select
                            value={selectedWalletId}
                            onChange={(e) => setSelectedWalletId(e.target.value)}
                            aria-label="Filter berdasarkan dompet"
                            className="text-xs py-1.5 px-3 rounded-xl border border-slate-300 dark:border-[#1E3158] bg-white dark:bg-[#0A1120] text-slate-800 dark:text-slate-200 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shrink-0 font-semibold shadow-xs"
                        >
                            <option value="">Semua Dompet / Rekening</option>
                            {wallets.map((w) => (
                                <option key={w.id} value={w.id}>
                                    {w.name}
                                </option>
                            ))}
                        </select>
                    )}

                    {/* Category filter if categories exist */}
                    {categories.length > 0 && (
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            aria-label="Filter berdasarkan kategori"
                            className="text-xs py-1.5 px-3 rounded-xl border border-slate-300 dark:border-[#1E3158] bg-white dark:bg-[#0A1120] text-slate-800 dark:text-slate-200 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shrink-0 font-semibold shadow-xs"
                        >
                            <option value="">Semua Kategori</option>
                            {categories.map((c) => (
                                <option key={c} value={c}>
                                    {c}
                                </option>
                            ))}
                        </select>
                    )}

                    {/* Clear Button */}
                    {hasActiveFilters && (
                        <button
                            type="button"
                            onClick={handleResetFilters}
                            className="p-1.5 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition flex items-center gap-1"
                        >
                            <XDuotone className="w-3.5 h-3.5" />
                            <span>Reset</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Transaction Items */}
            {paginatedItems.length > 0 ? (
                <div className="space-y-1.5 -mx-2 sm:mx-0">
                    {paginatedItems.map((item) => {
                        const isIncome = item.type === 'income';
                        const walletName = item.wallet_account?.name || (item.wallet === 'cash' ? 'Uang Tunai' : 'Rekening Utama');
                        const visuals = getCategoryVisuals(item.category, item.title, isIncome);
                        const CategoryBadge = visuals.Badge;

                        return (
                            <div
                                key={item.id}
                                className="px-3.5 sm:px-4 py-3 rounded-2xl flex items-center justify-between bg-white dark:bg-[#0E1A33]/70 hover:bg-slate-50 dark:hover:bg-[#112143]/90 transition-all duration-150 border border-slate-200/90 hover:border-slate-300 dark:border-[#1E3158]/60 dark:hover:border-[#1E3158] shadow-xs group"
                            >
                                {/* Left Side: Icon & Info */}
                                <div className="flex items-center gap-3.5 min-w-0 pr-3">
                                    {/* Category Illustrated Squircle Badge */}
                                    <div className="relative shrink-0">
                                        <CategoryBadge className={`w-10 h-10 ${visuals.glow}`} />
                                        {/* Directional mini pip */}
                                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-sm ${isIncome ? 'bg-emerald-500' : 'bg-rose-500'}`}>
                                            {isIncome ? '+' : '–'}
                                        </div>
                                    </div>

                                    <div className="min-w-0">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                                                {item.title}
                                            </p>

                                            {/* Refined Frosted Wallet Badge */}
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700 dark:bg-[#112143] dark:text-slate-200 border border-slate-200 dark:border-[#1E3158] shrink-0">
                                                <span className={`w-1.5 h-1.5 rounded-full ${isIncome ? 'bg-emerald-500' : 'bg-blue-500'}`} />
                                                <span>{walletName}</span>
                                            </span>

                                            {item.category && (
                                                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-600 dark:bg-[#112143]/70 dark:text-slate-300 border border-slate-200 dark:border-[#1E3158]/50">
                                                    {item.category}
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
                                            <span>{formatDate(item.transaction_date)}</span>
                                            {item.notes && (
                                                <>
                                                    <span>&bull;</span>
                                                    <span className="truncate max-w-[240px] text-slate-600 dark:text-slate-400 font-medium">
                                                        {item.notes}
                                                    </span>
                                                </>
                                            )}
                                            {item.category && (
                                                <span className="sm:hidden font-medium text-blue-700 dark:text-blue-400">
                                                    &bull; {item.category}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Right Side: Amount & Action Buttons */}
                                <div className="flex items-center gap-3 shrink-0">
                                    <span
                                        className={`text-sm sm:text-base font-extrabold tabular-nums tracking-tight ${
                                            isIncome
                                                ? 'text-emerald-600 dark:text-emerald-400'
                                                : 'text-slate-900 dark:text-white'
                                        }`}
                                    >
                                        {isIncome ? '+' : '–'} {formatRupiah(item.amount)}
                                    </span>

                                    <div className="flex items-center gap-1">
                                        <button
                                            type="button"
                                            onClick={() => onEdit(item)}
                                            title="Ubah Transaksi"
                                            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:white hover:bg-slate-200/60 dark:hover:bg-white/10 transition"
                                        >
                                            <PencilSimpleDuotone className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => onDelete(item)}
                                            title="Hapus Transaksi"
                                            className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
                                        >
                                            <TrashDuotone className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                /* Empty State with Mascot */
                <div className="py-12 px-4 text-center">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-2xl bg-gradient-to-br from-[#112143] via-[#0E1A33] to-[#0A1120] p-1.5 border border-[#1E3158] mb-3 shadow-md flex items-center justify-center overflow-hidden group">
                        <img
                            src="/assets/mascot-avatar.png"
                            alt="Si Uangku"
                            className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                        />
                    </div>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                        {hasActiveFilters ? 'Tidak ada transaksi yang cocok' : 'Belum ada catatan transaksi'}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto leading-relaxed">
                        {hasActiveFilters
                            ? 'Coba atur ulang kata kunci pencarian atau sesuaikan filter Anda.'
                            : 'Si Uangku siap mencatat seluruh pemasukan dan pengeluaranmu. Yuk mulai catat transaksi pertamamu!'}
                    </p>
                    <div className="mt-4">
                        {hasActiveFilters ? (
                            <button
                                type="button"
                                onClick={handleResetFilters}
                                className="inline-flex items-center px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-[#112143] dark:hover:bg-[#162A54] border border-slate-300/80 dark:border-[#1E3158] transition"
                            >
                                Hapus Filter
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={onAddNew}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition shadow-sm"
                            >
                                <PlusCircleDuotone className="w-3.5 h-3.5" />
                                <span>Catat Transaksi Pertama</span>
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Instant Real-Time Client Pagination Controls (0ms Delay) */}
            {totalPages > 1 && (
                <div className="pt-4 border-t border-slate-200/80 dark:border-[#1E3158]/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
                    <div>
                        Menampilkan <span className="font-semibold text-slate-700 dark:text-slate-200">{(currentPage - 1) * pageSize + 1}</span> sampai{' '}
                        <span className="font-semibold text-slate-700 dark:text-slate-200">{Math.min(currentPage * pageSize, totalFiltered)}</span> dari{' '}
                        <span className="font-semibold text-slate-700 dark:text-slate-200">{totalFiltered}</span> data
                    </div>

                    <div className="flex items-center gap-1">
                        <button
                            type="button"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            className="p-1.5 rounded-lg border border-slate-200 dark:border-[#1E3158] text-slate-600 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-[#112143]"
                        >
                            <CaretLeftDuotone className="w-4 h-4" />
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                            // Show first, last, and window around current
                            if (pageNum !== 1 && pageNum !== totalPages && Math.abs(pageNum - currentPage) > 1) {
                                if (Math.abs(pageNum - currentPage) === 2) {
                                    return <span key={pageNum} className="px-1 text-slate-400">...</span>;
                                }
                                return null;
                            }
                            return (
                                <button
                                    key={pageNum}
                                    type="button"
                                    onClick={() => setCurrentPage(pageNum)}
                                    className={`px-3 py-1.5 rounded-lg font-bold transition text-xs ${
                                        currentPage === pageNum
                                            ? 'bg-blue-600 text-white shadow-xs'
                                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#112143] border border-transparent'
                                    }`}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}

                        <button
                            type="button"
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            className="p-1.5 rounded-lg border border-slate-200 dark:border-[#1E3158] text-slate-600 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-[#112143]"
                        >
                            <CaretRightDuotone className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

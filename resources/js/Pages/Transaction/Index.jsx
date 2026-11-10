import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import TransactionModal from '@/Components/Dashboard/TransactionModal';
import DeleteConfirmModal from '@/Components/Dashboard/DeleteConfirmModal';
import TransactionDetailModal from '@/Components/Transaction/TransactionDetailModal';
import { formatRupiah, formatDate, formatFullDate } from '@/Utils/format';
import {
    ReceiptTextBold,
    CoinsBold,
    IncomeBold,
    ExpenseBold,
    TrendingUpBold,
    SearchBold,
    FilterBold,
    CalendarBold,
    TagBold,
    EyeBold,
    EditBold,
    TrashBold,
    PlusBold,
    ExportBold,
    NotesBold,
    X,
    ChevronLeft,
    ChevronRight,
    LayoutList,
    TableIcon,
} from '@/Components/Icons/PhosphorDuotone';
import {
    PocketBadge,
    MoneyBadge,
    ExpenseBadge,
    CoinsBadge,
    TargetBadge,
    SalaryBadge,
    FoodBadge,
    TransportBadge,
    ShoppingBadge,
    UtilityBadge,
    HealthBadge,
    EducationBadge,
    TechBadge,
} from '@/Components/Icons/ColorBadges';
import { Head, Link } from '@inertiajs/react';
import { useState, useMemo, useEffect } from 'react';

const PERIOD_OPTIONS = [
    { key: 'all', label: 'Semua Waktu' },
    { key: 'today', label: 'Hari Ini' },
    { key: 'yesterday', label: 'Kemarin' },
    { key: '7_days', label: '7 Hari Terakhir' },
    { key: 'this_month', label: 'Bulan Ini' },
    { key: 'last_month', label: 'Bulan Lalu' },
    { key: 'this_year', label: 'Tahun Ini' },
    { key: 'custom', label: 'Rentang Kustom' },
];

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

// Client-side date check helper for 0ms filtering
const isDateInPeriod = (dateStr, periodKey, customStart, customEnd) => {
    if (!dateStr) return false;
    if (periodKey === 'all') return true;

    const txDate = new Date(dateStr);
    txDate.setHours(0, 0, 0, 0);

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    if (periodKey === 'today') {
        return txDate.getTime() === today.getTime();
    }
    if (periodKey === 'yesterday') {
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        return txDate.getTime() === yesterday.getTime();
    }
    if (periodKey === '7_days') {
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 6);
        return txDate >= sevenDaysAgo && txDate <= today;
    }
    if (periodKey === 'this_month') {
        return txDate.getFullYear() === today.getFullYear() && txDate.getMonth() === today.getMonth();
    }
    if (periodKey === 'last_month') {
        const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);
        return txDate >= lastMonthStart && txDate <= lastMonthEnd;
    }
    if (periodKey === 'this_year') {
        return txDate.getFullYear() === today.getFullYear();
    }
    if (periodKey === 'custom') {
        if (customStart && customEnd) {
            const start = new Date(customStart);
            start.setHours(0, 0, 0, 0);
            const end = new Date(customEnd);
            end.setHours(23, 59, 59, 999);
            return txDate >= start && txDate <= end;
        }
        return true;
    }
    return true;
};

export default function TransactionIndex({
    transactions,
    all_transactions = [],
    wallets = [],
    categories = [],
    filters = {},
}) {
    // Determine raw full source of transactions
    const rawList = useMemo(() => {
        if (all_transactions && all_transactions.length > 0) return all_transactions;
        if (transactions?.data) return transactions.data;
        if (Array.isArray(transactions)) return transactions;
        return [];
    }, [all_transactions, transactions]);

    // Filter states
    const [search, setSearch] = useState(filters.search || '');
    const [selectedPeriod, setSelectedPeriod] = useState(filters.period || 'all');
    const [startDate, setStartDate] = useState(filters.start_date || '');
    const [endDate, setEndDate] = useState(filters.end_date || '');
    const [selectedType, setSelectedType] = useState(filters.type || '');
    const [selectedWalletId, setSelectedWalletId] = useState(filters.wallet_id || '');
    const [selectedCategory, setSelectedCategory] = useState(filters.category || '');
    const [selectedSort, setSelectedSort] = useState(filters.sort || 'date_desc');
    const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'table'
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 20;

    // Modals
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState(null);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [deletingTransaction, setDeletingTransaction] = useState(null);
    const [detailTransaction, setDetailTransaction] = useState(null);

    // Silent URL sync without server load/reload
    const syncUrl = (newFilters) => {
        try {
            const url = new URL(window.location.href);
            Object.keys(newFilters).forEach((k) => {
                const val = newFilters[k];
                if (val && val !== 'all' && val !== 'date_desc') {
                    url.searchParams.set(k, val);
                } else {
                    url.searchParams.delete(k);
                }
            });
            window.history.replaceState({}, '', url.toString());
        } catch (e) {
            // Safe fallback
        }
    };

    // Update URL query silently when filter states change
    useEffect(() => {
        syncUrl({
            period: selectedPeriod,
            start_date: startDate,
            end_date: endDate,
            search,
            type: selectedType,
            wallet_id: selectedWalletId,
            category: selectedCategory,
            sort: selectedSort,
        });
        setCurrentPage(1);
    }, [selectedPeriod, startDate, endDate, search, selectedType, selectedWalletId, selectedCategory, selectedSort]);

    // 0ms Real-Time In-Memory Filtering
    const filteredList = useMemo(() => {
        let list = rawList.filter((item) => {
            // 1. Period check
            if (!isDateInPeriod(item.transaction_date, selectedPeriod, startDate, endDate)) {
                return false;
            }
            // 2. Type check
            if (selectedType && item.type !== selectedType) {
                return false;
            }
            // 3. Wallet check
            if (selectedWalletId && selectedWalletId !== 'all') {
                const matchId = String(item.wallet_id) === String(selectedWalletId);
                const matchLegacy = selectedWalletId === 'cash' && item.wallet === 'cash';
                if (!matchId && !matchLegacy) return false;
            }
            // 4. Category check
            if (selectedCategory && selectedCategory !== 'all') {
                if (item.category !== selectedCategory) return false;
            }
            // 5. Search check
            if (search.trim()) {
                const q = search.toLowerCase();
                const matchTitle = item.title && item.title.toLowerCase().includes(q);
                const matchNotes = item.notes && item.notes.toLowerCase().includes(q);
                const matchCat = item.category && item.category.toLowerCase().includes(q);
                if (!matchTitle && !matchNotes && !matchCat) return false;
            }
            return true;
        });

        // 6. Sorting
        list.sort((a, b) => {
            if (selectedSort === 'date_asc') {
                return new Date(a.transaction_date) - new Date(b.transaction_date) || a.id - b.id;
            }
            if (selectedSort === 'amount_desc') {
                return Number(b.amount) - Number(a.amount);
            }
            if (selectedSort === 'amount_asc') {
                return Number(a.amount) - Number(b.amount);
            }
            // Default: date_desc
            return new Date(b.transaction_date) - new Date(a.transaction_date) || b.id - a.id;
        });

        return list;
    }, [rawList, selectedPeriod, startDate, endDate, selectedType, selectedWalletId, selectedCategory, search, selectedSort]);

    // Live Summary Metrics recalculated instantly in real-time (0ms)
    const liveSummary = useMemo(() => {
        let inc = 0;
        let exp = 0;
        let incCount = 0;
        let expCount = 0;
        const categoryMap = {};

        filteredList.forEach((tx) => {
            const amount = Number(tx.amount) || 0;
            if (tx.type === 'income') {
                inc += amount;
                incCount++;
            } else {
                exp += amount;
                expCount++;
                if (tx.category) {
                    categoryMap[tx.category] = (categoryMap[tx.category] || 0) + amount;
                }
            }
        });

        let topCat = null;
        let maxCatAmount = 0;
        Object.keys(categoryMap).forEach((cat) => {
            if (categoryMap[cat] > maxCatAmount) {
                maxCatAmount = categoryMap[cat];
                topCat = { name: cat, total: maxCatAmount };
            }
        });

        return {
            total_count: filteredList.length,
            income_count: incCount,
            expense_count: expCount,
            total_income: inc,
            total_expense: exp,
            net_cashflow: inc - exp,
            avg_expense: expCount > 0 ? Math.round(exp / expCount) : 0,
            avg_income: incCount > 0 ? Math.round(inc / incCount) : 0,
            top_expense_category: topCat,
        };
    }, [filteredList]);

    // Client-side pagination
    const totalFiltered = filteredList.length;
    const totalPages = Math.max(1, Math.ceil(totalFiltered / pageSize));
    const paginatedItems = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return filteredList.slice(start, start + pageSize);
    }, [filteredList, currentPage, pageSize]);

    const handleResetAll = () => {
        setSearch('');
        setSelectedPeriod('all');
        setStartDate('');
        setEndDate('');
        setSelectedType('');
        setSelectedWalletId('');
        setSelectedCategory('');
        setSelectedSort('date_desc');
        setCurrentPage(1);
    };

    const hasActiveFilters = Boolean(
        search ||
        selectedPeriod !== 'all' ||
        selectedType ||
        selectedWalletId ||
        selectedCategory ||
        selectedSort !== 'date_desc'
    );

    // Dynamic export query
    const currentExportQuery = {
        period: selectedPeriod,
        start_date: startDate,
        end_date: endDate,
        search,
        type: selectedType,
        wallet_id: selectedWalletId,
        category: selectedCategory,
    };

    return (
        <AuthenticatedLayout>
            <Head title="Riwayat Transaksi Lengkap" />

            <div className="space-y-6">
                {/* Header: Title, Subtitle, & Primary Actions with Solar Bold Icons */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                            <ReceiptTextBold className="w-4 h-4" />
                            <span>Audit &amp; Catatan Keuangan</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
                            Riwayat Transaksi Lengkap
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                            Filter instan secara real-time tanpa jeda waktu untuk memantau seluruh mutasi arus kas.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                        {/* Export CSV Button */}
                        <a
                            href={route('transactions.export', currentExportQuery)}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white dark:bg-[#0E1A33] border border-slate-300 dark:border-[#1E3158] hover:border-emerald-500 dark:hover:border-emerald-500/50 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-bold shadow-xs hover:shadow-sm transition"
                        >
                            <ExportBold className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                            <span>Ekspor CSV</span>
                        </a>

                        {/* Catat Transaksi Baru */}
                        <button
                            type="button"
                            onClick={() => {
                                setEditingTransaction(null);
                                setIsCreateOpen(true);
                            }}
                            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-600/25 transition-all duration-200 focus:outline-none"
                        >
                            <PlusBold className="w-4 h-4" />
                            <span>Catat Transaksi Baru</span>
                        </button>
                    </div>
                </div>

                {/* ======================================================== */}
                {/* 1. INFORMASI PENTING (REAL-TIME INSTANT SUMMARY METRICS) */}
                {/* ======================================================== */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Card 1: Total Transaksi */}
                    <div className="glass-card rounded-3xl p-5 border border-slate-200 dark:border-[#1E3158]/70 shadow-sm flex flex-col justify-between group">
                        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            <span>Total Transaksi</span>
                            <PocketBadge className="w-10 h-10" />
                        </div>
                        <div className="my-3">
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tabular-nums">
                                {liveSummary.total_count}
                            </h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                {liveSummary.income_count} Pemasukan • {liveSummary.expense_count} Pengeluaran
                            </p>
                        </div>
                        <div className="pt-2.5 border-t border-slate-100 dark:border-[#1E3158]/60 text-[11px] text-slate-400">
                            Terhitung instan real-time
                        </div>
                    </div>

                    {/* Card 2: Total Pemasukan Periode Ini */}
                    <div className="glass-card rounded-3xl p-5 border border-slate-200 dark:border-[#1E3158]/70 shadow-sm flex flex-col justify-between group">
                        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            <span>Pemasukan Terfilter</span>
                            <MoneyBadge className="w-10 h-10" />
                        </div>
                        <div className="my-3">
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 tabular-nums">
                                {formatRupiah(liveSummary.total_income)}
                            </h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                Rata-rata: {formatRupiah(liveSummary.avg_income)} / trx
                            </p>
                        </div>
                        <div className="pt-2.5 border-t border-slate-100 dark:border-[#1E3158]/60 text-[11px] text-slate-400">
                            {liveSummary.income_count} catatan arus masuk
                        </div>
                    </div>

                    {/* Card 3: Total Pengeluaran Periode Ini */}
                    <div className="glass-card rounded-3xl p-5 border border-slate-200 dark:border-[#1E3158]/70 shadow-sm flex flex-col justify-between group">
                        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            <span>Pengeluaran Terfilter</span>
                            <ExpenseBadge className="w-10 h-10" />
                        </div>
                        <div className="my-3">
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-rose-600 dark:text-rose-400 tabular-nums">
                                {formatRupiah(liveSummary.total_expense)}
                            </h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                Rata-rata: {formatRupiah(liveSummary.avg_expense)} / trx
                            </p>
                        </div>
                        <div className="pt-2.5 border-t border-slate-100 dark:border-[#1E3158]/60 text-[11px] text-slate-400">
                            {liveSummary.expense_count} catatan arus keluar
                        </div>
                    </div>

                    {/* Card 4: Arus Kas Bersih (Net Cash Flow) */}
                    <div className="glass-card rounded-3xl p-5 border border-slate-200 dark:border-[#1E3158]/70 shadow-sm flex flex-col justify-between group">
                        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            <span>Arus Kas Bersih (Net)</span>
                            <CoinsBadge className="w-10 h-10" />
                        </div>
                        <div className="my-3">
                            <h2
                                className={`text-2xl sm:text-3xl font-extrabold tracking-tight tabular-nums ${
                                    liveSummary.net_cashflow >= 0
                                        ? 'text-emerald-600 dark:text-emerald-400'
                                        : 'text-rose-600 dark:text-rose-400'
                                }`}
                            >
                                {liveSummary.net_cashflow >= 0 ? '+' : ''}{formatRupiah(liveSummary.net_cashflow)}
                            </h2>
                            <div className="mt-1 flex items-center gap-1.5">
                                <span
                                    className={`w-2 h-2 rounded-full ${
                                        liveSummary.net_cashflow >= 0 ? 'bg-emerald-500' : 'bg-rose-500'
                                    }`}
                                />
                                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                                    {liveSummary.net_cashflow >= 0 ? 'Surplus Finansial' : 'Defisit Pengeluaran'}
                                </span>
                            </div>
                        </div>
                        <div className="pt-2.5 border-t border-slate-100 dark:border-[#1E3158]/60 text-[11px] text-slate-400 truncate">
                            {liveSummary.top_expense_category ? `Terbesar: ${liveSummary.top_expense_category.name}` : 'Saldo Arus Terkonsolidasi'}
                        </div>
                    </div>
                </div>

                {/* ======================================================== */}
                {/* 2. FILTER & SEARCH CONTROL SUITE (REAL-TIME 0MS)         */}
                {/* ======================================================== */}
                <div className="glass-card rounded-3xl p-5 sm:p-6 space-y-4 border border-slate-200 dark:border-[#1E3158]/70 shadow-sm">
                    {/* Period Selector Tabs */}
                    <div>
                        <div className="flex items-center justify-between mb-2.5">
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                                <CalendarBold className="w-3.5 h-3.5 text-emerald-500" />
                                Filter Periode Waktu
                            </span>
                            {hasActiveFilters && (
                                <button
                                    type="button"
                                    onClick={handleResetAll}
                                    className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1"
                                >
                                    <X className="w-3.5 h-3.5" />
                                    Reset Semua Filter
                                </button>
                            )}
                        </div>

                        {/* Period Pills Bar (Instant Click / Zero Load) */}
                        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
                            {PERIOD_OPTIONS.map((opt) => (
                                <button
                                    key={opt.key}
                                    type="button"
                                    onClick={() => setSelectedPeriod(opt.key)}
                                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all duration-150 ${
                                        selectedPeriod === opt.key
                                            ? 'bg-emerald-600 text-white shadow-sm'
                                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-[#112143] dark:text-slate-300 dark:hover:bg-[#162A54] border border-slate-200 dark:border-[#1E3158]'
                                    }`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>

                        {/* Custom Date Inputs if 'custom' is active */}
                        {selectedPeriod === 'custom' && (
                            <div className="mt-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0A1120] border border-slate-200 dark:border-[#1E3158] flex flex-wrap items-center gap-3 text-xs">
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold text-slate-500 dark:text-slate-400">Mulai:</span>
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="py-1.5 px-3 rounded-xl border border-slate-300 dark:border-[#1E3158] bg-white dark:bg-[#0E1A33] text-slate-800 dark:text-slate-200 font-semibold focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold text-slate-500 dark:text-slate-400">Sampai:</span>
                                    <input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        className="py-1.5 px-3 rounded-xl border border-slate-300 dark:border-[#1E3158] bg-white dark:bg-[#0E1A33] text-slate-800 dark:text-slate-200 font-semibold focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Filter & Search Toolbar */}
                    <div className="pt-3 border-t border-slate-200/80 dark:border-[#1E3158]/60 flex flex-col lg:flex-row gap-3">
                        {/* Search Input (Real-time live typing) */}
                        <div className="relative flex-1">
                            <SearchBold className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Cari judul, catatan, atau kategori..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-9 pr-9 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-[#1E3158] bg-white dark:bg-[#0A1120] text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 shadow-xs transition"
                            />
                            {search && (
                                <button
                                    type="button"
                                    onClick={() => setSearch('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>

                        {/* Dropdown Filters with Real-Time Response */}
                        <div className="flex flex-wrap items-center gap-2">
                            {/* Type Filter */}
                            <select
                                value={selectedType}
                                onChange={(e) => setSelectedType(e.target.value)}
                                aria-label="Filter Jenis Transaksi"
                                className="text-xs py-2 px-3 rounded-xl border border-slate-300 dark:border-[#1E3158] bg-white dark:bg-[#0A1120] text-slate-800 dark:text-slate-200 font-semibold shadow-xs focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 shrink-0"
                            >
                                <option value="">Semua Jenis (Masuk &amp; Keluar)</option>
                                <option value="income">Pemasukan (+)</option>
                                <option value="expense">Pengeluaran (-)</option>
                            </select>

                            {/* Wallet Filter */}
                            {wallets.length > 0 && (
                                <select
                                    value={selectedWalletId}
                                    onChange={(e) => setSelectedWalletId(e.target.value)}
                                    aria-label="Filter Dompet / Rekening"
                                    className="text-xs py-2 px-3 rounded-xl border border-slate-300 dark:border-[#1E3158] bg-white dark:bg-[#0A1120] text-slate-800 dark:text-slate-200 font-semibold shadow-xs focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 shrink-0"
                                >
                                    <option value="">Semua Dompet / Rekening</option>
                                    {wallets.map((w) => (
                                        <option key={w.id} value={w.id}>
                                            {w.name}
                                        </option>
                                    ))}
                                </select>
                            )}

                            {/* Category Filter */}
                            {categories.length > 0 && (
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    aria-label="Filter Kategori"
                                    className="text-xs py-2 px-3 rounded-xl border border-slate-300 dark:border-[#1E3158] bg-white dark:bg-[#0A1120] text-slate-800 dark:text-slate-200 font-semibold shadow-xs focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 shrink-0"
                                >
                                    <option value="">Semua Kategori</option>
                                    {categories.map((c) => (
                                        <option key={c} value={c}>
                                            {c}
                                        </option>
                                    ))}
                                </select>
                            )}

                            {/* Sort Filter */}
                            <select
                                value={selectedSort}
                                onChange={(e) => setSelectedSort(e.target.value)}
                                aria-label="Urutkan Transaksi"
                                className="text-xs py-2 px-3 rounded-xl border border-slate-300 dark:border-[#1E3158] bg-white dark:bg-[#0A1120] text-slate-800 dark:text-slate-200 font-semibold shadow-xs focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 shrink-0"
                            >
                                <option value="date_desc">Tanggal: Terbaru</option>
                                <option value="date_asc">Tanggal: Terlama</option>
                                <option value="amount_desc">Nominal: Terbesar</option>
                                <option value="amount_asc">Nominal: Terkecil</option>
                            </select>

                            {/* View Mode Toggle: Cards vs Table */}
                            <div className="flex items-center p-0.5 rounded-xl bg-slate-200/80 dark:bg-[#0A1120] border border-slate-300/80 dark:border-[#1E3158] shrink-0">
                                <button
                                    type="button"
                                    onClick={() => setViewMode('cards')}
                                    title="Tampilan Kartu Detail"
                                    className={`p-1.5 rounded-lg transition ${
                                        viewMode === 'cards'
                                            ? 'bg-white dark:bg-[#112143] text-emerald-600 dark:text-emerald-400 shadow-sm'
                                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                                    }`}
                                >
                                    <LayoutList className="w-4 h-4" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setViewMode('table')}
                                    title="Tampilan Tabel Ringkas"
                                    className={`p-1.5 rounded-lg transition ${
                                        viewMode === 'table'
                                            ? 'bg-white dark:bg-[#112143] text-emerald-600 dark:text-emerald-400 shadow-sm'
                                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                                    }`}
                                >
                                    <TableIcon className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ======================================================== */}
                {/* 3. DETAILED TRANSACTION LIST / TABLE VIEW                */}
                {/* ======================================================== */}
                <div className="glass-card rounded-3xl p-5 sm:p-6 space-y-4 border border-slate-200 dark:border-[#1E3158]/70 shadow-sm">
                    {/* Header: Found count */}
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pb-2 border-b border-slate-100 dark:border-[#1E3158]/60">
                        <span className="font-semibold">
                            Menampilkan <strong>{totalFiltered}</strong> catatan transaksi
                        </span>
                        <span>
                            Halaman <strong>{currentPage}</strong> dari <strong>{totalPages}</strong>
                        </span>
                    </div>

                    {paginatedItems.length > 0 ? (
                        viewMode === 'cards' ? (
                            /* --- VIEW MODE 1: DETAILED CARDS --- */
                            <div className="space-y-3">
                                {paginatedItems.map((item) => {
                                    const isIncome = item.type === 'income';
                                    const wallet = item.wallet_account;
                                    const walletName = wallet?.name || (item.wallet === 'cash' ? 'Uang Tunai (Cash)' : 'Rekening Utama');
                                    const visuals = getCategoryVisuals(item.category, item.title, isIncome);
                                    const CategoryBadge = visuals.Badge;

                                    return (
                                        <div
                                            key={item.id}
                                            className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#0E1A33]/70 hover:bg-slate-50/90 dark:hover:bg-[#112143]/80 border border-slate-200/90 hover:border-slate-300 dark:border-[#1E3158]/60 dark:hover:border-[#1E3158] transition-all duration-150 shadow-2xs group flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                                        >
                                            {/* Left Section: Icon, Title, Badges & Notes */}
                                            <div className="flex items-start gap-3.5 min-w-0">
                                                {/* Category Squircle Avatar with Glow */}
                                                <div className="relative shrink-0 mt-0.5">
                                                    <CategoryBadge className={`w-11 h-11 ${visuals.glow}`} />
                                                    <div
                                                        className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-sm ${
                                                            isIncome ? 'bg-emerald-500' : 'bg-rose-500'
                                                        }`}
                                                    >
                                                        {isIncome ? '+' : '–'}
                                                    </div>
                                                </div>

                                                <div className="min-w-0 space-y-1">
                                                    {/* Title & Category Badge */}
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">
                                                            {item.title}
                                                        </h3>

                                                        {item.category && (
                                                            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-700 dark:bg-[#112143] dark:text-slate-300 border border-slate-200 dark:border-[#1E3158]">
                                                                <TagBold className="w-3 h-3 mr-1 text-slate-400" />
                                                                {item.category}
                                                            </span>
                                                        )}

                                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700 dark:bg-[#112143] dark:text-slate-200 border border-slate-200 dark:border-[#1E3158]">
                                                            <span className={`w-1.5 h-1.5 rounded-full ${isIncome ? 'bg-emerald-500' : 'bg-blue-500'}`} />
                                                            <span>{walletName}</span>
                                                            {wallet?.account_number && (
                                                                <span className="text-slate-400 font-mono">
                                                                    ({wallet.account_number})
                                                                </span>
                                                            )}
                                                        </span>
                                                    </div>

                                                    {/* Full Date with Day of Week */}
                                                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                                                        <CalendarBold className="w-3.5 h-3.5 text-slate-400" />
                                                        <span>{formatFullDate(item.transaction_date)}</span>
                                                        <span className="text-slate-300 dark:text-slate-600">•</span>
                                                        <span className="font-mono text-[11px] text-slate-400">
                                                            ID: #TRX-{String(item.id).padStart(5, '0')}
                                                        </span>
                                                    </div>

                                                    {/* Full Unclipped Notes (if any) */}
                                                    {item.notes && (
                                                        <div className="mt-2 text-xs text-slate-600 dark:text-slate-300 p-2.5 rounded-xl bg-slate-100/70 dark:bg-[#0A1120]/60 border border-slate-200/70 dark:border-[#1E3158]/50 flex items-start gap-2 max-w-2xl">
                                                            <NotesBold className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                                                            <span className="whitespace-pre-wrap leading-relaxed">
                                                                {item.notes}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Right Section: Amount & Actions */}
                                            <div className="flex items-center justify-between md:justify-end gap-4 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-[#1E3158]/40">
                                                <div className="text-left md:text-right">
                                                    <p
                                                        className={`text-base sm:text-lg font-extrabold tabular-nums tracking-tight ${
                                                            isIncome
                                                                ? 'text-emerald-600 dark:text-emerald-400'
                                                                : 'text-slate-900 dark:text-white'
                                                        }`}
                                                    >
                                                        {isIncome ? '+' : '–'} {formatRupiah(item.amount)}
                                                    </p>
                                                    <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                                                        {isIncome ? 'Arus Masuk' : 'Arus Keluar'}
                                                    </span>
                                                </div>

                                                {/* Action Buttons with Solar Bold */}
                                                <div className="flex items-center gap-1.5">
                                                    <button
                                                        type="button"
                                                        onClick={() => setDetailTransaction(item)}
                                                        title="Lihat Detail Transaksi"
                                                        className="p-2 rounded-xl text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-[#112143] border border-transparent hover:border-slate-300 dark:hover:border-[#1E3158] transition"
                                                    >
                                                        <EyeBold className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setEditingTransaction(item);
                                                            setIsCreateOpen(true);
                                                        }}
                                                        title="Ubah Transaksi"
                                                        className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#112143] border border-transparent hover:border-slate-300 dark:hover:border-[#1E3158] transition"
                                                    >
                                                        <EditBold className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setDeletingTransaction(item);
                                                            setIsDeleteOpen(true);
                                                        }}
                                                        title="Hapus Transaksi"
                                                        className="p-2 rounded-xl text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 border border-transparent hover:border-rose-200 dark:hover:border-rose-900/40 transition"
                                                    >
                                                        <TrashBold className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            /* --- VIEW MODE 2: COMPLETE TABLE --- */
                            <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-[#1E3158]/70">
                                <table className="w-full text-left text-xs border-collapse">
                                    <thead>
                                        <tr className="bg-slate-100/80 dark:bg-[#0A1120] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200 dark:border-[#1E3158]/70">
                                            <th className="py-3 px-4">Tanggal</th>
                                            <th className="py-3 px-4">Judul &amp; Catatan</th>
                                            <th className="py-3 px-4">Kategori</th>
                                            <th className="py-3 px-4">Dompet / Rekening</th>
                                            <th className="py-3 px-4">Jenis</th>
                                            <th className="py-3 px-4 text-right">Nominal</th>
                                            <th className="py-3 px-4 text-center">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200/70 dark:divide-[#1E3158]/50">
                                        {paginatedItems.map((item) => {
                                            const isIncome = item.type === 'income';
                                            const wallet = item.wallet_account;
                                            const walletName = wallet?.name || (item.wallet === 'cash' ? 'Uang Tunai' : 'Rekening Utama');

                                            return (
                                                <tr
                                                    key={item.id}
                                                    className="hover:bg-slate-50/80 dark:hover:bg-white/[0.02] transition-colors"
                                                >
                                                    <td className="py-3.5 px-4 whitespace-nowrap font-medium text-slate-700 dark:text-slate-300">
                                                        {formatDate(item.transaction_date)}
                                                    </td>
                                                    <td className="py-3.5 px-4 max-w-xs">
                                                        <div className="font-bold text-slate-900 dark:text-white truncate">
                                                            {item.title}
                                                        </div>
                                                        {item.notes && (
                                                            <div className="text-slate-500 dark:text-slate-400 text-[11px] truncate mt-0.5">
                                                                {item.notes}
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="py-3.5 px-4 whitespace-nowrap">
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700 dark:bg-[#112143] dark:text-slate-300 border border-slate-200 dark:border-[#1E3158]">
                                                            {item.category || '-'}
                                                        </span>
                                                    </td>
                                                    <td className="py-3.5 px-4 whitespace-nowrap">
                                                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                                                            {walletName}
                                                        </span>
                                                        {wallet?.account_number && (
                                                            <div className="text-[10px] text-slate-400 font-mono">
                                                                {wallet.account_number}
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="py-3.5 px-4 whitespace-nowrap">
                                                        <span
                                                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                                                isIncome
                                                                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300'
                                                                    : 'bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300'
                                                            }`}
                                                        >
                                                            {isIncome ? 'Pemasukan' : 'Pengeluaran'}
                                                        </span>
                                                    </td>
                                                    <td className="py-3.5 px-4 whitespace-nowrap text-right font-bold tabular-nums">
                                                        <span className={isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}>
                                                            {isIncome ? '+' : '–'} {formatRupiah(item.amount)}
                                                        </span>
                                                    </td>
                                                    <td className="py-3.5 px-4 whitespace-nowrap text-center">
                                                        <div className="inline-flex items-center gap-1">
                                                            <button
                                                                type="button"
                                                                onClick={() => setDetailTransaction(item)}
                                                                className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-[#112143]"
                                                                title="Detail"
                                                            >
                                                                <EyeBold className="w-3.5 h-3.5" />
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    setEditingTransaction(item);
                                                                    setIsCreateOpen(true);
                                                                }}
                                                                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#112143]"
                                                                title="Ubah"
                                                            >
                                                                <EditBold className="w-3.5 h-3.5" />
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    setDeletingTransaction(item);
                                                                    setIsDeleteOpen(true);
                                                                }}
                                                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                                                                title="Hapus"
                                                            >
                                                                <TrashBold className="w-3.5 h-3.5" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )
                    ) : (
                        /* Empty State with Mascot */
                        <div className="py-14 px-4 text-center">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-2xl bg-gradient-to-br from-[#112143] via-[#0E1A33] to-[#0A1120] p-1.5 border border-[#1E3158] mb-3.5 shadow-md flex items-center justify-center overflow-hidden group">
                                <img
                                    src="/assets/mascot-avatar.png"
                                    alt="Si Uangku"
                                    className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                                />
                            </div>
                            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                                {hasActiveFilters ? 'Tidak ada transaksi yang cocok' : 'Belum ada riwayat transaksi'}
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto leading-relaxed">
                                {hasActiveFilters
                                    ? 'Coba ganti filter periode, kata kunci pencarian, atau reset filter untuk menampilkan seluruh transaksi.'
                                    : 'Mulai catat transaksi pertamamu untuk melacak mutasi kas dan rekening secara terperinci!'}
                            </p>
                            <div className="mt-4 flex items-center justify-center gap-2">
                                {hasActiveFilters && (
                                    <button
                                        type="button"
                                        onClick={handleResetAll}
                                        className="inline-flex items-center px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-[#112143] dark:hover:bg-[#162A54] border border-slate-300/80 dark:border-[#1E3158] transition"
                                    >
                                        Reset Filter
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditingTransaction(null);
                                        setIsCreateOpen(true);
                                    }}
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition shadow-sm"
                                >
                                    <PlusBold className="w-4 h-4" />
                                    <span>Catat Transaksi Baru</span>
                                </button>
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
                                    <ChevronLeft className="w-4 h-4" />
                                </button>

                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
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
                                                    ? 'bg-emerald-600 text-white shadow-xs'
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
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Create / Edit Modal */}
            <TransactionModal
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                transactionToEdit={editingTransaction}
                wallets={wallets}
                categories={categories}
            />

            {/* Delete Confirmation Modal */}
            <DeleteConfirmModal
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                transaction={deletingTransaction}
            />

            {/* Detailed Transaction View Modal */}
            <TransactionDetailModal
                isOpen={Boolean(detailTransaction)}
                onClose={() => setDetailTransaction(null)}
                transaction={detailTransaction}
                onEdit={(item) => {
                    setEditingTransaction(item);
                    setIsCreateOpen(true);
                }}
                onDelete={(item) => {
                    setDeletingTransaction(item);
                    setIsDeleteOpen(true);
                }}
            />
        </AuthenticatedLayout>
    );
}

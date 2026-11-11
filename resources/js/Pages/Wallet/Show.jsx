import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import WalletChart from '@/Components/Wallet/WalletChart';
import WalletModal from '@/Components/Wallet/WalletModal';
import DeleteWalletModal from '@/Components/Wallet/DeleteWalletModal';
import TransactionList from '@/Components/Dashboard/TransactionList';
import TransactionModal from '@/Components/Dashboard/TransactionModal';
import DeleteConfirmModal from '@/Components/Dashboard/DeleteConfirmModal';
import { formatRupiah } from '@/Utils/format';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import {
    ArrowLeft,
    WalletIcon,
    CreditCard,
    Banknote,
    Smartphone,
    TrendingUp,
    PlusCircle,
    Edit3,
    Trash2,
    ArrowDownLeft,
    ArrowUpRight,
    Calendar,
    Layers,
    Sparkles,
    Copy,
    Check,
} from '@/Components/Icons/PhosphorDuotone';
import {
    PocketBadge,
    MoneyBadge,
    ExpenseBadge,
    CoinsBadge,
} from '@/Components/Icons/ColorBadges';

const WALLET_THEMES = {
    bank: {
        label: 'Rekening Bank',
        icon: CreditCard,
        bgGradient: 'bg-gradient-to-br from-[#112143] via-[#0b162f] to-[#060c1b]',
        glowColor: 'bg-blue-500/25',
        borderColor: 'border-[#1E3A6E]',
        pillClass: 'bg-blue-500/20 text-blue-200 border-blue-400/40',
    },
    cash: {
        label: 'Uang Tunai (Cash)',
        icon: Banknote,
        bgGradient: 'bg-gradient-to-br from-[#381e0b] via-[#241306] to-[#0e0702]',
        glowColor: 'bg-amber-500/25',
        borderColor: 'border-amber-600/40',
        pillClass: 'bg-amber-500/20 text-amber-200 border-amber-400/40',
    },
    ewallet: {
        label: 'E-Wallet',
        icon: Smartphone,
        bgGradient: 'bg-gradient-to-br from-[#0b2b48] via-[#061729] to-[#030d17]',
        glowColor: 'bg-cyan-500/20',
        borderColor: 'border-cyan-500/30',
        pillClass: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
    },
    investment: {
        label: 'Investasi',
        icon: TrendingUp,
        bgGradient: 'bg-gradient-to-br from-[#0c2e17] via-[#071d0e] to-[#030d06]',
        glowColor: 'bg-emerald-500/25',
        borderColor: 'border-emerald-600/40',
        pillClass: 'bg-emerald-500/20 text-emerald-200 border-emerald-400/40',
    },
    other: {
        label: 'Kas Lainnya',
        icon: WalletIcon,
        bgGradient: 'bg-gradient-to-br from-[#27272D] via-[#1C1C21] to-[#111114]',
        glowColor: 'bg-white/[0.06]',
        borderColor: 'border-[#32323A]',
        pillClass: 'bg-white/10 text-zinc-200 border-white/15',
    },
};

const SmartCardChip = () => (
    <svg className="w-8 h-6 rounded-md shrink-0 shadow-sm" viewBox="0 0 36 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="36" height="28" rx="4" fill="url(#chipGradShow)" />
        <rect x="0.5" y="0.5" width="35" height="27" rx="3.5" stroke="#FDE68A" strokeOpacity="0.5" strokeWidth="1" />
        <path d="M0 10H12M0 18H12M24 10H36M24 18H36M12 0V28M24 0V28M12 14H24" stroke="#92400E" strokeOpacity="0.4" strokeWidth="1" />
        <rect x="12" y="9" width="12" height="10" rx="2" fill="none" stroke="#78350F" strokeOpacity="0.4" strokeWidth="1" />
        <defs>
            <linearGradient id="chipGradShow" x1="0" y1="0" x2="36" y2="28" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FDE68A" />
                <stop offset="0.5" stopColor="#F59E0B" />
                <stop offset="1" stopColor="#D97706" />
            </linearGradient>
        </defs>
    </svg>
);

const ContactlessSymbol = () => (
    <svg className="w-4 h-4 text-white/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M8.5 16.5a5 5 0 0 1 0-7" />
        <path d="M12 19a8.5 8.5 0 0 0 0-12" />
        <path d="M15.5 21.5a12 12 0 0 0 0-17" />
    </svg>
);

export default function WalletShow({
    auth,
    wallet,
    timeframe = '1m',
    dateRange = {},
    metrics = {},
    chartData = [],
    transactions = {},
    filters = {},
    categories = [],
    walletCategories = [],
    wallets = [],
}) {
    // Transaction modals
    const [isTxModalOpen, setIsTxModalOpen] = useState(false);
    const [editingTx, setEditingTx] = useState(null);
    const [isDeleteTxOpen, setIsDeleteTxOpen] = useState(false);
    const [deletingTx, setDeletingTx] = useState(null);

    // Wallet edit/delete modals
    const [isEditWalletOpen, setIsEditWalletOpen] = useState(false);
    const [isDeleteWalletOpen, setIsDeleteWalletOpen] = useState(false);

    const [copied, setCopied] = useState(false);

    const theme = WALLET_THEMES[wallet.type] || WALLET_THEMES.other;

    const handleTimeframeChange = (newTimeframe) => {
        router.get(
            route('wallets.show', wallet.id),
            { ...filters, timeframe: newTimeframe },
            { preserveState: true, preserveScroll: true, replace: true }
        );
    };

    const handleOpenCreateTx = () => {
        setEditingTx(null);
        setIsTxModalOpen(true);
    };

    const handleOpenEditTx = (tx) => {
        setEditingTx(tx);
        setIsTxModalOpen(true);
    };

    const handleOpenDeleteTx = (tx) => {
        setDeletingTx(tx);
        setIsDeleteTxOpen(true);
    };

    const handleCopy = () => {
        if (wallet.account_number) {
            navigator.clipboard.writeText(wallet.account_number);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Dompet: ${wallet.name}`} />

            <div className="space-y-7">
                {/* Back Button & Top Navigation */}
                <div className="flex items-center justify-between">
                    <Link
                        href={route('wallets.index')}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-zinc-300 dark:hover:text-white bg-white/60 dark:bg-[#1C1C20] border border-slate-200/60 dark:border-[#2C2C32] transition shadow-sm hover:shadow"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Kembali ke Semua Dompet</span>
                    </Link>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setIsEditWalletOpen(true)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-zinc-200 bg-white/70 dark:bg-[#1C1C20] hover:bg-slate-100 dark:hover:bg-[#242429] border border-slate-200/80 dark:border-[#2C2C32] transition shadow-sm"
                        >
                            <Edit3 className="w-3.5 h-3.5 text-slate-400" />
                            <span>Edit Dompet</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsDeleteWalletOpen(true)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50/70 dark:bg-rose-950/30 hover:bg-rose-100 dark:hover:bg-rose-950/50 border border-rose-200/60 dark:border-rose-900/40 transition shadow-sm"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Hapus</span>
                        </button>
                    </div>
                </div>

                {/* Hero Asset Card for Current Wallet */}
                <div className={`relative rounded-3xl p-6 sm:p-7 text-white overflow-hidden ${theme.bgGradient} border ${theme.borderColor} shadow-2xl space-y-6`}>
                    {/* Ambient Glow & Reflection */}
                    <div className={`absolute top-0 right-0 w-64 h-64 ${theme.glowColor} rounded-full blur-3xl pointer-events-none`} />
                    <div className="absolute inset-0 card-reflection pointer-events-none" />

                    <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2.5">
                                <SmartCardChip />
                                <ContactlessSymbol />
                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase backdrop-blur-md border ${theme.pillClass}`}>
                                    {theme.label}
                                </span>
                                {wallet.account_number && (
                                    <div className="flex items-center gap-1.5 bg-black/30 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/10 text-xs font-mono text-white/70">
                                        <span>{wallet.account_number}</span>
                                        <button onClick={handleCopy} className="text-white/40 hover:text-white transition">
                                            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                        </button>
                                    </div>
                                )}
                            </div>

                            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight drop-shadow-sm">
                                {wallet.name}
                            </h1>
                        </div>

                        <button
                            type="button"
                            onClick={handleOpenCreateTx}
                            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 dark:bg-none dark:bg-zinc-100 dark:hover:bg-white active:scale-95 text-white dark:text-zinc-950 text-xs sm:text-sm font-bold shadow-lg shadow-blue-600/25 dark:shadow-none transition-all duration-200 focus:outline-none shrink-0"
                        >
                            <PlusCircle className="w-4 h-4" />
                            <span>Catat Transaksi di Dompet Ini</span>
                        </button>
                    </div>

                    {/* 4 Summary Stat Cards for this specific wallet */}
                    <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-white/10">
                        {/* 1. Current Balance */}
                        <div className="p-4 rounded-2xl bg-black/25 backdrop-blur-md border border-white/10 flex flex-col justify-between">
                            <div className="flex items-center justify-between text-xs text-white/60">
                                <span className="font-bold uppercase tracking-wider text-[10px]">Saldo Saat Ini</span>
                                <PocketBadge className="w-8 h-8 rounded-xl" />
                            </div>
                            <div className="my-2">
                                <p className="text-2xl font-extrabold tabular-nums text-white">
                                    {formatRupiah(wallet.current_balance)}
                                </p>
                            </div>
                            <p className="text-[10px] text-white/50">
                                Saldo bersih saat ini
                            </p>
                        </div>

                        {/* 2. Initial Balance */}
                        <div className="p-4 rounded-2xl bg-black/25 backdrop-blur-md border border-white/10 flex flex-col justify-between">
                            <div className="flex items-center justify-between text-xs text-white/60">
                                <span className="font-bold uppercase tracking-wider text-[10px]">Saldo Awal</span>
                                <CoinsBadge className="w-8 h-8 rounded-xl" />
                            </div>
                            <div className="my-2">
                                <p className="text-2xl font-extrabold tabular-nums text-white/90">
                                    {formatRupiah(wallet.initial_balance)}
                                </p>
                            </div>
                            <p className="text-[10px] text-white/50">
                                Terdaftar sejak {wallet.created_at}
                            </p>
                        </div>

                        {/* 3. Total Income in this wallet */}
                        <div className="p-4 rounded-2xl bg-black/25 backdrop-blur-md border border-white/10 flex flex-col justify-between">
                            <div className="flex items-center justify-between text-xs text-white/60">
                                <span className="font-bold uppercase tracking-wider text-[10px]">Total Pemasukan</span>
                                <MoneyBadge className="w-8 h-8 rounded-xl" />
                            </div>
                            <div className="my-2">
                                <p className="text-2xl font-extrabold tabular-nums text-emerald-400">
                                    {formatRupiah(wallet.total_income)}
                                </p>
                            </div>
                            <p className="text-[10px] text-white/50">
                                Seluruh uang masuk
                            </p>
                        </div>

                        {/* 4. Total Expense in this wallet */}
                        <div className="p-4 rounded-2xl bg-black/25 backdrop-blur-md border border-white/10 flex flex-col justify-between">
                            <div className="flex items-center justify-between text-xs text-white/60">
                                <span className="font-bold uppercase tracking-wider text-[10px]">Total Pengeluaran</span>
                                <ExpenseBadge className="w-8 h-8 rounded-xl" />
                            </div>
                            <div className="my-2">
                                <p className="text-2xl font-extrabold tabular-nums text-rose-400">
                                    {formatRupiah(wallet.total_expense)}
                                </p>
                            </div>
                            <p className="text-[10px] text-white/50">
                                Seluruh uang keluar
                            </p>
                        </div>
                    </div>
                </div>

                {/* Interactive Chart for This Wallet */}
                <WalletChart
                    chartData={chartData}
                    timeframe={timeframe}
                    onTimeframeChange={handleTimeframeChange}
                    dateRangeFormatted={dateRange.formatted}
                    walletName={wallet.name}
                />

                {/* Filtered Transaction Table Specifically for this Wallet */}
                <TransactionList
                    transactions={transactions}
                    wallets={wallets}
                    filters={filters}
                    categories={categories}
                    targetRoute="wallets.show"
                    targetParams={{ wallet: wallet.id }}
                    hideWalletFilter={true}
                    title={`Riwayat Transaksi • ${wallet.name}`}
                    subtitle={`${transactions.total || 0} catatan transaksi di dompet ini`}
                    onAddNew={handleOpenCreateTx}
                    onEdit={handleOpenEditTx}
                    onDelete={handleOpenDeleteTx}
                />
            </div>

            {/* Create / Edit Transaction Modal */}
            <TransactionModal
                isOpen={isTxModalOpen}
                onClose={() => setIsTxModalOpen(false)}
                transactionToEdit={editingTx}
                wallets={wallets}
                categories={categories}
                defaultWalletId={wallet.id}
            />

            {/* Delete Transaction Confirmation Modal */}
            <DeleteConfirmModal
                isOpen={isDeleteTxOpen}
                onClose={() => setIsDeleteTxOpen(false)}
                transaction={deletingTx}
            />

            {/* Edit Wallet Modal */}
            <WalletModal
                isOpen={isEditWalletOpen}
                onClose={() => setIsEditWalletOpen(false)}
                walletToEdit={wallet}
            />

            {/* Delete Wallet Modal */}
            <DeleteWalletModal
                isOpen={isDeleteWalletOpen}
                onClose={() => setIsDeleteWalletOpen(false)}
                wallet={wallet}
            />
        </AuthenticatedLayout>
    );
}

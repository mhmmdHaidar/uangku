import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import WalletModal from '@/Components/Wallet/WalletModal';
import DeleteWalletModal from '@/Components/Wallet/DeleteWalletModal';
import { formatRupiah } from '@/Utils/format';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import {
    WalletIcon,
    Plus,
    CreditCard,
    Banknote,
    Smartphone,
    TrendingUp,
    Edit3,
    Trash2,
    ArrowUpRight,
    Sparkles,
    ShieldCheck,
    Layers,
    Copy,
    Check,
} from '@/Components/Icons/PhosphorDuotone';
import {
    PocketBadge,
    CardBadge,
    PhoneBadge,
    MoneyBadge,
    CoinsBadge,
    WalletBadge,
} from '@/Components/Icons/ColorBadges';

const WALLET_THEMES = {
    bank: {
        label: 'Rekening Bank',
        icon: CreditCard,
        bgGradient: 'bg-gradient-to-br from-[#112143] via-[#0b162f] to-[#060c1b]',
        glowColor: 'bg-blue-500/25',
        borderColor: 'border-[#1E3A6E] hover:border-blue-400/60',
        pillClass: 'bg-blue-500/20 text-blue-200 border-blue-400/40',
        accentShadow: 'hover:shadow-[0_16px_40px_-10px_rgba(30,58,110,0.45)]',
    },
    cash: {
        label: 'Uang Tunai (Cash)',
        icon: Banknote,
        bgGradient: 'bg-gradient-to-br from-[#381e0b] via-[#241306] to-[#0e0702]',
        glowColor: 'bg-amber-500/25',
        borderColor: 'border-amber-600/40 hover:border-amber-400/60',
        pillClass: 'bg-amber-500/20 text-amber-200 border-amber-400/40',
        accentShadow: 'hover:shadow-[0_16px_40px_-10px_rgba(245,158,11,0.35)]',
    },
    ewallet: {
        label: 'E-Wallet',
        icon: Smartphone,
        bgGradient: 'bg-gradient-to-br from-[#0b2b48] via-[#061729] to-[#030d17]',
        glowColor: 'bg-cyan-500/20',
        borderColor: 'border-cyan-500/30 hover:border-cyan-400/50',
        pillClass: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
        accentShadow: 'hover:shadow-[0_16px_40px_-10px_rgba(6,182,212,0.35)]',
    },
    investment: {
        label: 'Investasi',
        icon: TrendingUp,
        bgGradient: 'bg-gradient-to-br from-[#0c2e17] via-[#071d0e] to-[#030d06]',
        glowColor: 'bg-emerald-500/25',
        borderColor: 'border-emerald-600/40 hover:border-emerald-400/60',
        pillClass: 'bg-emerald-500/20 text-emerald-200 border-emerald-400/40',
        accentShadow: 'hover:shadow-[0_16px_40px_-10px_rgba(16,185,129,0.35)]',
    },
    other: {
        label: 'Kas Lainnya',
        icon: WalletIcon,
        bgGradient: 'bg-gradient-to-br from-[#1e2533] via-[#10141d] to-[#07090d]',
        glowColor: 'bg-slate-500/20',
        borderColor: 'border-slate-500/30 hover:border-slate-400/50',
        pillClass: 'bg-slate-500/15 text-slate-300 border-slate-500/30',
        accentShadow: 'hover:shadow-[0_16px_40px_-10px_rgba(100,116,139,0.35)]',
    },
};

const SmartCardChip = () => (
    <svg className="w-8 h-6 rounded-md shrink-0 shadow-sm" viewBox="0 0 36 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="36" height="28" rx="4" fill="url(#chipGradient)" />
        <rect x="0.5" y="0.5" width="35" height="27" rx="3.5" stroke="#FDE68A" strokeOpacity="0.5" strokeWidth="1" />
        <path d="M0 10H12M0 18H12M24 10H36M24 18H36M12 0V28M24 0V28M12 14H24" stroke="#92400E" strokeOpacity="0.4" strokeWidth="1" />
        <rect x="12" y="9" width="12" height="10" rx="2" fill="none" stroke="#78350F" strokeOpacity="0.4" strokeWidth="1" />
        <defs>
            <linearGradient id="chipGradient" x1="0" y1="0" x2="36" y2="28" gradientUnits="userSpaceOnUse">
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

export default function WalletIndex({ auth, wallets = [], summary = {} }) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingWallet, setEditingWallet] = useState(null);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deletingWallet, setDeletingWallet] = useState(null);

    const [copiedId, setCopiedId] = useState(null);

    const handleOpenCreate = () => {
        setEditingWallet(null);
        setIsCreateModalOpen(true);
    };

    const handleOpenEdit = (wallet) => {
        setEditingWallet(wallet);
        setIsCreateModalOpen(true);
    };

    const handleOpenDelete = (wallet) => {
        setDeletingWallet(wallet);
        setIsDeleteModalOpen(true);
    };

    const handleCopyAccount = (e, wallet) => {
        e.stopPropagation();
        if (wallet.account_number) {
            navigator.clipboard.writeText(wallet.account_number);
            setCopiedId(wallet.id);
            setTimeout(() => setCopiedId(null), 2000);
        }
    };

    const formatCardNumber = (accountNo) => {
        if (!accountNo) return 'AKUN FINANSIAL AKTIF';
        const clean = accountNo.replace(/\s+/g, '');
        if (clean.length > 4) {
            return `•••• •••• •••• ${clean.slice(-4)}`;
        }
        return `•••• ${clean}`;
    };

    return (
        <AuthenticatedLayout>
            <Head title="Dompet & Rekening Keuangan" />

            <div className="space-y-7">
                {/* Header: Title and Add Wallet Button */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">
                            <Layers className="w-3.5 h-3.5" />
                            <span>Portofolio &amp; Sumber Kas Terintegrasi</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                            Dompet &amp; Rekening Saya
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                            Kelola rekening bank, uang tunai, dan e-wallet Anda layaknya kartu digital modern.
                        </p>
                    </div>

                    <button
                        type="button"
                        data-tour="wallets-add"
                        onClick={handleOpenCreate}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 active:scale-[0.98] text-white text-xs sm:text-sm font-semibold shadow-lg shadow-blue-600/20 transition-all duration-200 focus:outline-none"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Tambah Dompet Baru</span>
                    </button>
                </div>

                {/* Top Summary: 4 Refined Metric Cards */}
                <div data-tour="wallets-summary" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* 1. Total Semua Uang */}
                    <div className="glass-card rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden group hover:border-indigo-500/30">
                        <div className="absolute top-0 right-0 w-28 h-28 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
                        <div className="flex items-center justify-between text-xs text-slate-500">
                            <span className="font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-[11px]">
                                Total Semua Saldo
                            </span>
                            <PocketBadge className="w-10 h-10" />
                        </div>
                        <div className="my-3">
                            <h2 className="text-2xl sm:text-3xl font-extrabold tabular-nums text-slate-900 dark:text-white tracking-tight">
                                {formatRupiah(summary.total_all ?? 0)}
                            </h2>
                        </div>
                        <p className="text-[11px] text-slate-400 border-t border-slate-200 dark:border-white/5 pt-2 flex items-center justify-between">
                            <span>Akumulasi portofolio</span>
                            <strong className="text-slate-700 dark:text-slate-300 font-semibold">{summary.wallet_count ?? wallets.length} Akun</strong>
                        </p>
                    </div>

                    {/* 2. Total Rekening Bank */}
                    <div className="glass-card rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden group hover:border-blue-500/30">
                        <div className="absolute top-0 right-0 w-28 h-28 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
                        <div className="flex items-center justify-between text-xs text-slate-500">
                            <span className="font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-[11px]">
                                Rekening Bank
                            </span>
                            <CardBadge className="w-10 h-10" />
                        </div>
                        <div className="my-3">
                            <h3 className="text-2xl sm:text-3xl font-extrabold tabular-nums text-slate-900 dark:text-white tracking-tight">
                                {formatRupiah(summary.total_bank ?? 0)}
                            </h3>
                        </div>
                        <p className="text-[11px] text-slate-400 border-t border-slate-200 dark:border-white/5 pt-2">
                            Giro &amp; tabungan perbankan
                        </p>
                    </div>

                    {/* 3. Total E-Wallet */}
                    <div className="glass-card rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden group hover:border-cyan-500/30">
                        <div className="absolute top-0 right-0 w-28 h-28 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
                        <div className="flex items-center justify-between text-xs text-slate-500">
                            <span className="font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-[11px]">
                                Dompet Digital (E-Wallet)
                            </span>
                            <PhoneBadge className="w-10 h-10" />
                        </div>
                        <div className="my-3">
                            <h3 className="text-2xl sm:text-3xl font-extrabold tabular-nums text-slate-900 dark:text-white tracking-tight">
                                {formatRupiah(summary.total_ewallet ?? 0)}
                            </h3>
                        </div>
                        <p className="text-[11px] text-slate-400 border-t border-slate-200 dark:border-white/5 pt-2">
                            GoPay, OVO, QRIS &amp; e-money
                        </p>
                    </div>

                    {/* 4. Total Uang Tunai & Lainnya */}
                    <div className="glass-card rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden group hover:border-amber-500/30">
                        <div className="absolute top-0 right-0 w-28 h-28 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
                        <div className="flex items-center justify-between text-xs text-slate-500">
                            <span className="font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-[11px]">
                                Kas Fisik &amp; Aset
                            </span>
                            <MoneyBadge className="w-10 h-10" />
                        </div>
                        <div className="my-3">
                            <h3 className="text-2xl sm:text-3xl font-extrabold tabular-nums text-slate-900 dark:text-white tracking-tight">
                                {formatRupiah((summary.total_cash ?? 0) + (summary.total_investment ?? 0))}
                            </h3>
                        </div>
                        <p className="text-[11px] text-slate-400 border-t border-slate-200 dark:border-white/5 pt-2">
                            Uang tunai &amp; investasi likuid
                        </p>
                    </div>
                </div>

                {/* Section Title */}
                <div data-tour="wallets-grid">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                Kartu Dompet &amp; Rekening
                            </h3>
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-200/70 dark:bg-white/[0.06] text-slate-700 dark:text-slate-300 border border-slate-300/80 dark:border-white/5">
                                {wallets.length} Akun Terhubung
                            </span>
                        </div>
                        <p className="text-xs text-slate-400 hidden sm:block">
                            Klik kartu untuk melihat rincian riwayat &amp; grafik transaksi
                        </p>
                    </div>

                    {/* Responsive Grid of Luxury Smart Cards */}
                    {wallets.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {wallets.map((wallet) => {
                                const theme = WALLET_THEMES[wallet.type] || WALLET_THEMES.other;
                                const isCopied = copiedId === wallet.id;

                                return (
                                    <Link
                                        key={wallet.id}
                                        href={route('wallets.show', wallet.id)}
                                        prefetch
                                        className={`block relative rounded-3xl p-6 text-white overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1.5 ${theme.bgGradient} border ${theme.borderColor} shadow-lg ${theme.accentShadow} group select-none`}
                                    >
                                        {/* Radial Ambient Glow */}
                                        <div className={`absolute top-0 right-0 w-44 h-44 ${theme.glowColor} rounded-full blur-3xl pointer-events-none`} />

                                        {/* Subtle Diagonal Card Sheen Texture */}
                                        <div className="absolute inset-0 card-reflection pointer-events-none" />

                                        {/* Top Row: Chip, Contactless, and Quick Actions */}
                                        <div className="relative z-10 flex items-start justify-between gap-3 mb-5">
                                            <div className="flex items-center gap-2.5">
                                                <SmartCardChip />
                                                <ContactlessSymbol />
                                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase backdrop-blur-md border ${theme.pillClass}`}>
                                                    {theme.label}
                                                </span>
                                            </div>

                                            {/* Action Buttons: Edit and Delete */}
                                            <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleOpenEdit(wallet);
                                                    }}
                                                    title="Ubah Dompet"
                                                    className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white/80 hover:text-white backdrop-blur-md border border-white/10 transition shadow-sm"
                                                >
                                                    <Edit3 className="w-3.5 h-3.5" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleOpenDelete(wallet);
                                                    }}
                                                    title="Hapus Dompet"
                                                    className="p-1.5 rounded-xl bg-white/10 hover:bg-rose-500/30 active:scale-95 text-white/80 hover:text-rose-200 backdrop-blur-md border border-white/10 transition shadow-sm"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Middle: Masked Account Number & Wallet Name */}
                                        <div className="relative z-10 my-4 space-y-1">
                                            <div className="flex items-center gap-2">
                                                <p className="text-xs font-mono text-white/60 tracking-wider">
                                                    {formatCardNumber(wallet.account_number)}
                                                </p>
                                                {wallet.account_number && (
                                                    <button
                                                        type="button"
                                                        onClick={(e) => handleCopyAccount(e, wallet)}
                                                        title="Salin nomor akun"
                                                        className="text-white/40 hover:text-white transition"
                                                    >
                                                        {isCopied ? (
                                                            <Check className="w-3 h-3 text-emerald-400" />
                                                        ) : (
                                                            <Copy className="w-3 h-3" />
                                                        )}
                                                    </button>
                                                )}
                                            </div>

                                            <h4 className="text-xl font-bold tracking-tight text-white drop-shadow-sm truncate">
                                                {wallet.name}
                                            </h4>
                                        </div>

                                        {/* Bottom: Balance & Navigation Indicator */}
                                        <div className="relative z-10 pt-4 border-t border-white/10 mt-5">
                                            <span className="text-[10px] uppercase font-bold tracking-widest text-white/50 block">
                                                Saldo Saat Ini
                                            </span>
                                            <p className="text-2xl sm:text-3xl font-extrabold tabular-nums tracking-tight text-white mt-0.5">
                                                {formatRupiah(wallet.current_balance)}
                                            </p>

                                            <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-xs font-semibold text-white/80">
                                                <span className="text-[11px] text-white/50 font-normal">
                                                    Awal: {formatRupiah(wallet.initial_balance)}
                                                </span>
                                                <div className="flex items-center gap-1.5 text-sky-400 group-hover:text-sky-300 font-semibold transition-colors">
                                                    <span>Lihat Rincian</span>
                                                    <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="glass-card rounded-3xl p-10 sm:p-12 text-center border border-slate-200 dark:border-[#1E3158]/70">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-2xl bg-gradient-to-br from-[#112143] via-[#0E1A33] to-[#0A1120] p-1.5 border border-[#1E3158] mb-3 shadow-md flex items-center justify-center overflow-hidden group">
                                <img
                                    src="/assets/mascot-avatar.png"
                                    alt="Si Uangku"
                                    className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                                />
                            </div>
                            <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">
                                Belum Ada Dompet Terdaftar
                            </h4>
                            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1 mb-5 leading-relaxed">
                                Daftarkan rekening bank, akun e-wallet, atau pos uang tunai Anda untuk memisahkan dan memantau aset finansial dengan rapi.
                            </p>
                            <button
                                type="button"
                                onClick={handleOpenCreate}
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 via-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md shadow-blue-600/25 transition active:scale-95"
                            >
                                <Plus className="w-4 h-4" />
                                Tambah Dompet Pertama
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Create & Edit Wallet Modal */}
            <WalletModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                walletToEdit={editingWallet}
            />

            {/* Delete Confirmation Modal */}
            <DeleteWalletModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                wallet={deletingWallet}
            />
        </AuthenticatedLayout>
    );
}

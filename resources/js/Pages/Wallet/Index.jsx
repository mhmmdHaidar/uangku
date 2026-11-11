import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import WalletModal from '@/Components/Wallet/WalletModal';
import DeleteWalletModal from '@/Components/Wallet/DeleteWalletModal';
import { formatRupiah } from '@/Utils/format';
import { getWalletCardTheme } from '@/Utils/walletThemes';
import { Head, Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import {
    Plus,
    Edit3,
    Trash2,
    ArrowUpRight,
    Layers,
    Copy,
    Check,
} from '@/Components/Icons/PhosphorDuotone';
import { PocketBadge } from '@/Components/Icons/ColorBadges';

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

    useEffect(() => {
        const handleTourOpenWalletModal = () => {
            setEditingWallet(null);
            setIsCreateModalOpen(true);
        };
        window.addEventListener('uangku:tour-open-wallet-modal', handleTourOpenWalletModal);
        return () => window.removeEventListener('uangku:tour-open-wallet-modal', handleTourOpenWalletModal);
    }, []);

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
                        <div className="flex items-center gap-2 text-xs font-semibold text-[#00105B] dark:text-zinc-300 mb-1">
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
                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-[#00105B] hover:bg-[#000B42] dark:bg-zinc-100 dark:hover:bg-white active:scale-[0.98] text-white dark:text-zinc-950 text-xs sm:text-sm font-semibold shadow-lg shadow-[#00105B]/20 dark:shadow-none transition-all duration-200 focus:outline-none"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Tambah Dompet Baru</span>
                    </button>
                </div>

                {/* Condensed 1-Card Total Balance Summary with Category Chips */}
                <div data-tour="wallets-summary" className="glass-card rounded-3xl p-5 sm:p-6 relative overflow-hidden border border-slate-200 dark:border-[#2C2C32]">
                    <div className="absolute top-0 right-0 w-44 h-44 bg-[#00105B]/10 dark:bg-white/[0.04] rounded-full blur-3xl pointer-events-none" />
                    <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex items-center gap-3.5">
                            <PocketBadge className="w-12 h-12 shrink-0" />
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 text-[11px]">
                                        Total Semua Saldo
                                    </span>
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#00105B]/10 dark:bg-[#242429] text-[#00105B] dark:text-zinc-200 border border-[#00105B]/20 dark:border-[#32323A]">
                                        {summary.wallet_count ?? wallets.length} Akun Terhubung
                                    </span>
                                </div>
                                <h2 className="text-2xl sm:text-3xl font-extrabold tabular-nums text-slate-900 dark:text-white tracking-tight mt-0.5">
                                    {formatRupiah(summary.total_all ?? 0)}
                                </h2>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 text-xs">
                            <div className="px-3 py-1.5 rounded-xl bg-slate-100/90 dark:bg-[#161619] border border-slate-200/80 dark:border-[#2C2C32] flex items-center gap-1.5">
                                <span className="text-slate-500 dark:text-zinc-400 font-medium">Bank:</span>
                                <strong className="font-bold text-slate-800 dark:text-zinc-100 tabular-nums">
                                    {formatRupiah(summary.total_bank ?? 0)}
                                </strong>
                            </div>
                            <div className="px-3 py-1.5 rounded-xl bg-slate-100/90 dark:bg-[#161619] border border-slate-200/80 dark:border-[#2C2C32] flex items-center gap-1.5">
                                <span className="text-slate-500 dark:text-zinc-400 font-medium">E-Wallet:</span>
                                <strong className="font-bold text-slate-800 dark:text-zinc-100 tabular-nums">
                                    {formatRupiah(summary.total_ewallet ?? 0)}
                                </strong>
                            </div>
                            <div className="px-3 py-1.5 rounded-xl bg-slate-100/90 dark:bg-[#161619] border border-slate-200/80 dark:border-[#2C2C32] flex items-center gap-1.5">
                                <span className="text-slate-500 dark:text-zinc-400 font-medium">Cash &amp; Aset:</span>
                                <strong className="font-bold text-slate-800 dark:text-zinc-100 tabular-nums">
                                    {formatRupiah((summary.total_cash ?? 0) + (summary.total_investment ?? 0))}
                                </strong>
                            </div>
                        </div>
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
                                const theme = getWalletCardTheme(wallet);
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
                                                <div className="flex items-center gap-1.5 text-zinc-200 group-hover:text-white font-semibold transition-colors">
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
                        <div className="glass-card rounded-3xl p-10 sm:p-12 text-center border border-slate-200 dark:border-[#2C2C32]">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-2xl bg-gradient-to-br from-[#001875] via-[#00105B] to-[#000833] dark:from-[#26262C] dark:via-[#1E1E24] dark:to-[#161619] p-1.5 border border-[#00105B] dark:border-[#32323A] mb-3 shadow-md flex items-center justify-center overflow-hidden group">
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
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white dark:text-zinc-950 bg-[#00105B] hover:bg-[#000B42] dark:bg-zinc-100 dark:hover:bg-white shadow-md shadow-[#00105B]/25 dark:shadow-none transition active:scale-95"
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

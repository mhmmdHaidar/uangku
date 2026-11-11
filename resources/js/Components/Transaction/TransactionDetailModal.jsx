import Modal from '@/Components/Modal';
import { formatRupiah, formatFullDate, formatDateTime } from '@/Utils/format';
import {
    X,
    Calendar,
    Tag,
    FileText,
    CreditCard,
    Banknote,
    Smartphone,
    TrendingUp,
    WalletIcon,
    ArrowDownLeft,
    ArrowUpRight,
    Edit3,
    Trash2,
    Clock,
    Hash,
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

const WALLET_ICONS = {
    bank: CreditCard,
    cash: Banknote,
    ewallet: Smartphone,
    investment: TrendingUp,
    other: WalletIcon,
};

const WALLET_TYPE_LABELS = {
    bank: 'Rekening Bank',
    cash: 'Uang Tunai (Cash)',
    ewallet: 'E-Wallet',
    investment: 'Investasi',
    other: 'Dompet Lainnya',
};

export default function TransactionDetailModal({
    isOpen,
    onClose,
    transaction,
    onEdit,
    onDelete,
}) {
    if (!transaction) return null;

    const isIncome = transaction.type === 'income';
    const wallet = transaction.wallet_account;
    const walletType = wallet?.type || (transaction.wallet === 'cash' ? 'cash' : 'bank');
    const WalletTypeIcon = WALLET_ICONS[walletType] || WalletIcon;
    const WalletBadgeComponent = WALLET_BADGES[walletType] || WalletBadge;
    const walletName = wallet?.name || (transaction.wallet === 'cash' ? 'Uang Tunai (Cash)' : 'Rekening Utama');

    return (
        <Modal show={isOpen} onClose={onClose} maxWidth="lg">
            <div className="p-6 space-y-6">
                {/* Header: ID, Title & Close Button */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-[#2C2C32]">
                    <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-slate-100 dark:bg-[#242429] text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-[#32323A]">
                            <Hash className="w-3 h-3 text-slate-400" />
                            TRX-{String(transaction.id).padStart(5, '0')}
                        </span>
                        <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${
                                isIncome
                                    ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30'
                                    : 'bg-rose-50 text-rose-800 dark:bg-rose-500/15 dark:text-rose-300 border-rose-200 dark:border-rose-500/30'
                            }`}
                        >
                            {isIncome ? <ArrowDownLeft className="w-3.5 h-3.5" /> : <ArrowUpRight className="w-3.5 h-3.5" />}
                            <span>{isIncome ? 'Pemasukan' : 'Pengeluaran'}</span>
                        </span>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-[#2A2A30] transition"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Big Amount Card */}
                <div
                    className={`p-5 rounded-2xl border text-center relative overflow-hidden ${
                        isIncome
                            ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-500/30 text-emerald-900 dark:text-emerald-200'
                            : 'bg-rose-50/60 dark:bg-rose-950/20 border-rose-200 dark:border-rose-500/30 text-rose-900 dark:text-rose-200'
                    }`}
                >
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-1">
                        Nominal Transaksi
                    </p>
                    <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight tabular-nums">
                        {isIncome ? '+' : '–'} {formatRupiah(transaction.amount)}
                    </h2>
                    <p className="text-sm font-bold text-slate-800 dark:text-zinc-100 mt-2 truncate">
                        {transaction.title}
                    </p>
                </div>

                {/* Detailed Spec List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                    {/* Date */}
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#161619] border border-slate-200/80 dark:border-[#2C2C32]">
                        <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                            <Calendar className="w-3.5 h-3.5 text-[#00105B] dark:text-zinc-300" />
                            <span className="font-semibold">Tanggal Transaksi</span>
                        </div>
                        <p className="font-bold text-slate-800 dark:text-zinc-200 text-sm">
                            {formatFullDate(transaction.transaction_date)}
                        </p>
                    </div>

                    {/* Category */}
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#161619] border border-slate-200/80 dark:border-[#2C2C32]">
                        <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                            <Tag className="w-3.5 h-3.5 text-amber-500" />
                            <span className="font-semibold">Kategori</span>
                        </div>
                        <p className="font-bold text-slate-800 dark:text-zinc-200 text-sm">
                            {transaction.category || 'Tanpa Kategori'}
                        </p>
                    </div>

                    {/* Source Wallet / Rekening */}
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#161619] border border-slate-200/80 dark:border-[#2C2C32] sm:col-span-2">
                        <div className="flex items-center gap-1.5 text-slate-400 mb-1.5">
                            <WalletTypeIcon className="w-3.5 h-3.5 text-[#00105B] dark:text-zinc-300" />
                            <span className="font-semibold">Dompet / Rekening Terkait</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <WalletBadgeComponent className="w-9 h-9 rounded-xl shrink-0" />
                                <div>
                                    <p className="font-bold text-slate-900 dark:text-white text-sm">
                                        {walletName}
                                    </p>
                                    <p className="text-slate-500 dark:text-zinc-400 text-xs mt-0.5">
                                        {WALLET_TYPE_LABELS[walletType]} {wallet?.account_number ? `• ${wallet.account_number}` : ''}
                                    </p>
                                </div>
                            </div>
                            {wallet?.current_balance !== undefined && (
                                <div className="text-right">
                                    <p className="text-[10px] text-slate-400 font-medium">Saldo Dompet Saat Ini</p>
                                    <p className="font-bold text-slate-800 dark:text-zinc-200 tabular-nums">
                                        {formatRupiah(wallet.current_balance)}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Complete Notes */}
                    {transaction.notes && (
                        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#161619] border border-slate-200/80 dark:border-[#2C2C32] sm:col-span-2">
                            <div className="flex items-center gap-1.5 text-slate-400 mb-1.5">
                                <FileText className="w-3.5 h-3.5 text-slate-500" />
                                <span className="font-semibold">Catatan / Keterangan</span>
                            </div>
                            <p className="text-slate-700 dark:text-zinc-300 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                                {transaction.notes}
                            </p>
                        </div>
                    )}

                    {/* Timestamp */}
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#161619] border border-slate-200/80 dark:border-[#2C2C32] sm:col-span-2 flex items-center justify-between text-xs text-slate-400">
                        <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            <span>Waktu Pencatatan:</span>
                        </div>
                        <span className="font-semibold text-slate-600 dark:text-zinc-300">
                            {formatDateTime(transaction.created_at)}
                        </span>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="pt-4 border-t border-slate-200 dark:border-[#2C2C32] flex items-center justify-between gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-[#2A2A30] transition"
                    >
                        Tutup
                    </button>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => {
                                onClose();
                                onEdit(transaction);
                            }}
                            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 dark:text-zinc-200 bg-slate-100 hover:bg-slate-200 dark:bg-[#242429] dark:hover:bg-[#2E2E35] border border-slate-200 dark:border-[#32323A] transition"
                        >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Ubah</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                onClose();
                                onDelete(transaction);
                            }}
                            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/30 dark:hover:bg-rose-950/50 border border-rose-200 dark:border-rose-900/40 transition"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Hapus</span>
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
}


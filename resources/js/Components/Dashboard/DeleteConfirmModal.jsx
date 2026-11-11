import Modal from '@/Components/Modal';
import DangerButton from '@/Components/DangerButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { formatRupiah } from '@/Utils/format';
import { useForm } from '@inertiajs/react';
import { WarningCircleDuotone } from '@/Components/Icons/PhosphorDuotone';

export default function DeleteConfirmModal({ isOpen, onClose, transaction }) {
    const { delete: destroy, processing } = useForm();

    if (!transaction) return null;

    const handleDelete = (e) => {
        e.preventDefault();
        destroy(route('transactions.destroy', transaction.id), {
            preserveScroll: true,
            onSuccess: () => {
                onClose();
            },
        });
    };

    return (
        <Modal show={isOpen} onClose={onClose} maxWidth="sm">
            <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40">
                    <WarningCircleDuotone className="h-6 w-6" />
                </div>

                <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
                    Hapus Transaksi?
                </h3>
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                    {transaction.type === 'transfer' ? 'Transfer' : 'Transaksi'}{' '}
                    <span className="font-semibold text-slate-800 dark:text-slate-200">"{transaction.title}"</span>{' '}
                    ({transaction.type === 'transfer'
                        ? `${transaction.wallet_account?.name || 'Dompet Asal'} → ${transaction.to_wallet_account?.name || 'Dompet Tujuan'}`
                        : (transaction.wallet_account?.name || 'Tanpa Dompet')}) sebesar{' '}
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{formatRupiah(transaction.amount)}</span> akan dihapus secara permanen. Tindakan ini tidak dapat dibatalkan.
                </p>

                <div className="mt-6 flex items-center justify-center gap-3">
                    <SecondaryButton onClick={onClose} disabled={processing} className="w-full">
                        Batal
                    </SecondaryButton>
                    <DangerButton onClick={handleDelete} disabled={processing} className="w-full">
                        {processing ? 'Menghapus...' : 'Hapus'}
                    </DangerButton>
                </div>
            </div>
        </Modal>
    );
}


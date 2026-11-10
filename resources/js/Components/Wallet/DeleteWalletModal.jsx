import Modal from '@/Components/Modal';
import DangerButton from '@/Components/DangerButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { formatRupiah } from '@/Utils/format';
import { useForm } from '@inertiajs/react';
import { WarningCircleDuotone } from '@/Components/Icons/PhosphorDuotone';

export default function DeleteWalletModal({ isOpen, onClose, wallet }) {
    const { delete: destroy, processing } = useForm();

    if (!wallet) return null;

    const handleDelete = (e) => {
        e.preventDefault();
        destroy(route('wallets.destroy', wallet.id), {
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
                    Hapus Dompet / Rekening?
                </h3>
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Dompet <span className="font-semibold text-slate-800 dark:text-slate-200">"{wallet.name}"</span> dengan saldo{' '}
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{formatRupiah(wallet.current_balance)}</span> akan dihapus. Riwayat transaksi yang terkait dengan dompet ini akan tetap tersimpan.
                </p>

                <div className="mt-6 flex items-center justify-center gap-3">
                    <SecondaryButton onClick={onClose} disabled={processing} className="w-full">
                        Batal
                    </SecondaryButton>
                    <DangerButton onClick={handleDelete} disabled={processing} className="w-full">
                        {processing ? 'Menghapus...' : 'Hapus Dompet'}
                    </DangerButton>
                </div>
            </div>
        </Modal>
    );
}


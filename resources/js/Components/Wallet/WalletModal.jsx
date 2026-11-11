import Modal from '@/Components/Modal';
import GoldCoinLoader from '@/Components/Loaders/GoldCoinLoader';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { formatNumberInput, terbilangRupiah } from '@/Utils/format';
import { WALLET_GRADIENT_OPTIONS, WALLET_TYPES } from '@/Utils/walletThemes';
import { useForm, usePage } from '@inertiajs/react';
import { Check } from 'lucide-react';
import { useEffect, useState } from 'react';
import { X } from '@/Components/Icons/PhosphorDuotone';

export default function WalletModal({
    isOpen,
    onClose,
    walletToEdit = null,
}) {
    const isEditing = !!walletToEdit;
    const { auth } = usePage().props;
    const showTupiWalletHint = !isEditing && auth?.user?.has_created_wallet === false;

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        name: '',
        type: 'bank',
        account_number: '',
        initial_balance: '',
        color: 'navy',
    });

    const [displayBalance, setDisplayBalance] = useState('');

    // Notify interactive onboarding tour whether wallet modal is open
    useEffect(() => {
        if (typeof window === 'undefined') return;
        window.dispatchEvent(new CustomEvent('uangku:wallet-modal-state', { detail: { isOpen } }));
        return () => {
            if (isOpen) {
                window.dispatchEvent(new CustomEvent('uangku:wallet-modal-state', { detail: { isOpen: false } }));
            }
        };
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) {
            clearErrors();
            if (walletToEdit) {
                const initBal = walletToEdit.initial_balance !== undefined ? walletToEdit.initial_balance : '';
                setDisplayBalance(initBal ? formatNumberInput(initBal) : '');
                setData({
                    name: walletToEdit.name || '',
                    type: walletToEdit.type || 'bank',
                    account_number: walletToEdit.account_number || '',
                    initial_balance: initBal,
                    color: walletToEdit.color || 'navy',
                });
            } else {
                reset();
                setDisplayBalance('');
                setData({
                    name: '',
                    type: 'bank',
                    account_number: '',
                    initial_balance: '',
                    color: 'navy',
                });
            }
        }
    }, [isOpen, walletToEdit]);

    const handleBalanceChange = (e) => {
        const rawDigits = e.target.value.replace(/\D/g, '');
        if (!rawDigits) {
            setDisplayBalance('');
            setData('initial_balance', '');
            return;
        }
        const numericVal = parseInt(rawDigits, 10);
        setDisplayBalance(new Intl.NumberFormat('id-ID').format(numericVal));
        setData('initial_balance', numericVal);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (isEditing) {
            put(route('wallets.update', walletToEdit.id), {
                preserveScroll: true,
                onSuccess: () => {
                    onClose();
                    reset();
                },
            });
        } else {
            post(route('wallets.store'), {
                preserveScroll: true,
                onSuccess: () => {
                    if (typeof window !== 'undefined') {
                        window.dispatchEvent(new CustomEvent('uangku:wallet-created-in-tour'));
                    }
                    onClose();
                    reset();
                },
            });
        }
    };

    return (
        <>
            <Modal show={isOpen} onClose={onClose} maxWidth="md" closeable={!processing}>
            <div className="relative">
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-white/10">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                            {isEditing ? 'Perbarui Dompet / Rekening' : 'Tambah Dompet Baru'}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            {isEditing
                                ? 'Ubah informasi rekening atau dompet Anda.'
                                : 'Daftarkan rekening bank, dompet tunai, atau e-wallet Anda.'}
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

                {showTupiWalletHint && (
                    <div className="mt-4 flex items-center gap-3 p-3 rounded-2xl bg-[#00105B]/8 dark:bg-[#242429] border border-[#00105B]/20 dark:border-[#3E3E46]">
                        <img
                            src="/assets/tupi/tupi-point.png"
                            alt="Panduan Tupi"
                            className="w-10 h-10 object-contain shrink-0"
                        />
                        <p className="text-xs text-slate-700 dark:text-zinc-300 leading-relaxed">
                            <strong className="text-[#00105B] dark:text-white">Arahan Tupi:</strong> Pilih tipe (Rekening Bank, E-Wallet, atau lainnya), beri nama dompet &amp; saldo awal opsional, lalu klik <strong>Tambah Dompet</strong>.
                        </p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                    {/* 1. Tipe Dompet */}
                    <div>
                        <InputLabel value="Tipe Dompet / Rekening" className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold mb-1" />
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {WALLET_TYPES.map((t) => {
                                const Icon = t.icon;
                                const isSelected = data.type === t.key;
                                return (
                                    <button
                                        key={t.key}
                                        type="button"
                                        onClick={() => setData('type', t.key)}
                                        className={`flex flex-col items-start p-2.5 rounded-xl border text-left transition-all ${
                                            isSelected
                                                ? 'bg-[#00105B]/10 dark:bg-[#26262C] border-[#00105B] dark:border-zinc-300 text-[#00105B] dark:text-white ring-1 ring-[#00105B]/25 dark:ring-zinc-300/20 shadow-xs'
                                                : 'bg-white dark:bg-[#151518] border-slate-300 dark:border-[#2C2C32] text-slate-700 dark:text-zinc-300 hover:border-slate-400 dark:hover:border-[#3E3E46] shadow-2xs'
                                        }`}
                                    >
                                        <Icon className={`w-4 h-4 mb-1.5 ${isSelected ? 'text-[#00105B] dark:text-white' : 'text-slate-400'}`} />
                                        <span className="text-xs font-bold leading-tight">{t.label}</span>
                                        <span className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{t.desc}</span>
                                    </button>
                                );
                            })}
                        </div>
                        <InputError message={errors.type} className="mt-1" />
                    </div>

                    {/* 2. Nama Dompet */}
                    <div>
                        <InputLabel htmlFor="name" value="Nama Dompet / Rekening" className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold" />
                        <TextInput
                            id="name"
                            type="text"
                            placeholder="Contoh: Rekening BCA, Dompet Fisik, GoPay Utama"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="mt-1 w-full"
                            required
                        />
                        <InputError message={errors.name} className="mt-1" />
                    </div>

                    {/* 3. Nomor Akun / Rekening (Opsional) */}
                    <div>
                        <div className="flex items-center justify-between">
                            <InputLabel htmlFor="account_number" value="Nomor Rekening / Keterangan Akun" className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold" />
                            <span className="text-[11px] text-slate-400">Opsional</span>
                        </div>
                        <TextInput
                            id="account_number"
                            type="text"
                            placeholder="Contoh: 1234-5678-90 atau 08123456789"
                            value={data.account_number}
                            onChange={(e) => setData('account_number', e.target.value)}
                            className="mt-1 w-full text-sm font-mono"
                        />
                        <InputError message={errors.account_number} className="mt-1" />
                    </div>

                    {/* 4. Saldo Awal (Opsional) */}
                    <div>
                        <div className="flex items-center justify-between">
                            <InputLabel htmlFor="initial_balance" value="Saldo Awal Saat Ini (Rp)" className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold" />
                            <span className="text-[11px] text-slate-400">Opsional</span>
                        </div>
                        <div className="relative mt-1">
                            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 font-bold text-sm">
                                Rp
                            </span>
                            <TextInput
                                id="initial_balance"
                                type="text"
                                inputMode="numeric"
                                placeholder="0"
                                value={displayBalance}
                                onChange={handleBalanceChange}
                                className="pl-11 w-full text-base font-bold tabular-nums"
                            />
                        </div>

                        {data.initial_balance > 0 && (
                            <div className="mt-1.5 flex items-center gap-1.5 text-xs text-[#00105B] dark:text-zinc-200 bg-[#00105B]/10 dark:bg-[#242429] px-2.5 py-1 rounded-xl border border-[#00105B]/20 dark:border-[#32323A]">
                                <span className="font-semibold shrink-0">Terbaca:</span>
                                <span className="italic font-medium truncate">{terbilangRupiah(data.initial_balance)}</span>
                            </div>
                        )}

                        <p className="mt-1 text-[11px] text-slate-400">
                            Saldo awal yang ada di dompet/rekening ini sebelum pencatatan transaksi dimulai.
                        </p>
                        <InputError message={errors.initial_balance} className="mt-1" />
                    </div>

                    {/* 5. Aksen Warna Gradasi Kartu */}
                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <InputLabel value="Aksen Warna Gradasi Kartu" className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold" />
                            <span className="text-[11px] font-semibold text-slate-500 dark:text-zinc-400">
                                {WALLET_GRADIENT_OPTIONS.find((g) => g.key === data.color)?.label || 'Samudra Navy'}
                            </span>
                        </div>
                        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                            {WALLET_GRADIENT_OPTIONS.map((c) => {
                                const isSelected = data.color === c.key;
                                return (
                                    <button
                                        key={c.key}
                                        type="button"
                                        onClick={() => setData('color', c.key)}
                                        title={c.label}
                                        aria-label={c.label}
                                        className={`h-9 rounded-xl ${c.swatchGradient} flex items-center justify-center border border-black/15 dark:border-white/20 shadow-sm transition-transform ${
                                            isSelected
                                                ? 'ring-2 ring-offset-2 ring-[#00105B] dark:ring-white dark:ring-offset-[#1C1C20] scale-105'
                                                : 'opacity-85 hover:opacity-100 hover:scale-105'
                                        }`}
                                    >
                                        {isSelected && <Check className="w-4 h-4 text-white drop-shadow" />}
                                    </button>
                                );
                            })}
                        </div>
                        <InputError message={errors.color} className="mt-1" />
                    </div>

                    {/* Actions */}
                    <div className="pt-3 border-t border-slate-200 dark:border-white/10 flex items-center justify-end gap-3">
                        <SecondaryButton type="button" onClick={onClose} disabled={processing}>
                            Batal
                        </SecondaryButton>
                        <PrimaryButton type="submit" disabled={processing}>
                            {processing ? 'Menyimpan...' : isEditing ? 'Simpan Perubahan' : 'Tambah Dompet'}
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </Modal>

        <GoldCoinLoader
            show={processing}
            message={isEditing ? 'Memperbarui dompet...' : 'Menambahkan dompet baru...'}
            subMessage="Menyiapkan sumber dana"
        />
    </>
    );
}


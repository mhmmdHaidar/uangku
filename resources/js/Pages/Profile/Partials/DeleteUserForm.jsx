import DangerButton from '@/Components/DangerButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';

export default function DeleteUserForm({ className = '' }) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef();

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);

        clearErrors();
        reset();
    };

    return (
        <section className={`space-y-6 ${className}`}>
            <header>
                <h2 className="text-base font-bold text-rose-600 dark:text-rose-400">
                    Hapus Akun
                </h2>

                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Setelah akun Anda dihapus, semua data profil dan seluruh riwayat transaksi akan dihapus secara permanen. Sebelum menghapus akun, pastikan Anda telah mencatat informasi penting yang ingin disimpan.
                </p>
            </header>

            <DangerButton onClick={confirmUserDeletion}>
                Hapus Akun Saya
            </DangerButton>

            <Modal show={confirmingUserDeletion} onClose={closeModal} maxWidth="md">
                <form onSubmit={deleteUser} className="p-2">
                    <h2 className="text-base font-bold text-slate-900 dark:text-white">
                        Apakah Anda yakin ingin menghapus akun?
                    </h2>

                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        Setelah akun Anda dihapus, seluruh data keuangan dan transaksi Anda akan terhapus permanen. Silakan masukkan kata sandi Anda untuk mengonfirmasi penghapusan akun.
                    </p>

                    <div className="mt-5">
                        <InputLabel
                            htmlFor="password"
                            value="Kata Sandi Konfirmasi"
                            className="sr-only"
                        />

                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) =>
                                setData('password', e.target.value)
                            }
                            className="mt-1 block w-full"
                            isFocused
                            placeholder="Ketik kata sandi Anda..."
                        />

                        <InputError
                            message={errors.password}
                            className="mt-2"
                        />
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <SecondaryButton onClick={closeModal}>
                            Batal
                        </SecondaryButton>

                        <DangerButton disabled={processing}>
                            {processing ? 'Menghapus...' : 'Hapus Akun'}
                        </DangerButton>
                    </div>
                </form>
            </Modal>
        </section>
    );
}

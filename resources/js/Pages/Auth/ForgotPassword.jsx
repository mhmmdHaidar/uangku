import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Mail } from '@/Components/Icons/PhosphorDuotone';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title="Lupa Kata Sandi" />

            <div className="mb-6 text-center">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    Pemulihan Kata Sandi
                </h2>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Masukkan email Anda, dan kami akan mengirimkan tautan untuk mengatur ulang kata sandi.
                </p>
            </div>

            {status && (
                <div className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-4">
                <div>
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="block w-full"
                        isFocused={true}
                        placeholder="nama@email.com"
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />

                    <InputError message={errors.email} className="mt-1" />
                </div>

                <div className="pt-2">
                    <PrimaryButton className="w-full justify-center gap-2" disabled={processing}>
                        <Mail className="w-4 h-4" />
                        {processing ? 'Mengirim Tautan...' : 'Kirim Tautan Reset Sandi'}
                    </PrimaryButton>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-white/5 text-center text-xs text-slate-500 dark:text-slate-400">
                    <Link
                        href={route('login')}
                        className="inline-flex items-center gap-1.5 font-semibold text-blue-600 dark:text-zinc-200 hover:underline"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        Kembali ke halaman Masuk
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}

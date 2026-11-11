import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { LogIn } from '@/Components/Icons/PhosphorDuotone';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Masuk ke Akun" />

            <div className="mb-6 text-center">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    Masuk ke Uangku
                </h2>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Kelola arus kas keuangan pribadimu dengan tenang.
                </p>
            </div>

            {status && (
                <div className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-4">
                <div>
                    <InputLabel htmlFor="email" value="Alamat Email" className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        placeholder="nama@email.com"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />

                    <InputError message={errors.email} className="mt-1" />
                </div>

                <div>
                    <div className="flex items-center justify-between">
                        <InputLabel htmlFor="password" value="Kata Sandi" className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold" />
                        {canResetPassword && (
                            <Link
                                href={route('password.request')}
                                className="text-xs font-medium text-blue-600 dark:text-zinc-200 hover:underline"
                            >
                                Lupa sandi?
                            </Link>
                        )}
                    </div>

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="current-password"
                        placeholder="••••••••"
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />

                    <InputError message={errors.password} className="mt-1" />
                </div>

                <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center cursor-pointer select-none">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) =>
                                setData('remember', e.target.checked)
                            }
                            className="rounded-md text-blue-600 dark:text-zinc-200 focus:ring-blue-500 dark:focus:ring-zinc-400 border-slate-300 dark:border-[#32323A] dark:bg-[#151518]"
                        />
                        <span className="ms-2 text-xs text-slate-600 dark:text-slate-400">
                            Ingat saya di perangkat ini
                        </span>
                    </label>
                </div>

                <div className="pt-2">
                    <PrimaryButton className="w-full justify-center gap-2" disabled={processing}>
                        <LogIn className="w-4 h-4" />
                        {processing ? 'Memproses...' : 'Masuk ke Akun'}
                    </PrimaryButton>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-white/5 text-center text-xs text-slate-500 dark:text-slate-400">
                    Belum memiliki akun?{' '}
                    <Link
                        href={route('register')}
                        className="font-semibold text-blue-600 dark:text-zinc-200 hover:underline"
                    >
                        Daftar sekarang
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}

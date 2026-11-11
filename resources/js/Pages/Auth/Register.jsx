import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { UserPlus } from '@/Components/Icons/PhosphorDuotone';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Daftar Akun Baru" />

            <div className="mb-6 text-center">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    Buat Akun Uangku
                </h2>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Mulai perjalanan pengelolaan keuangan pribadimu hari ini.
                </p>
            </div>

            <form onSubmit={submit} className="space-y-4">
                <div>
                    <InputLabel htmlFor="name" value="Nama Lengkap" className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold" />

                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        className="mt-1 block w-full"
                        autoComplete="name"
                        placeholder="Contoh: Budi Santoso"
                        isFocused={true}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                    />

                    <InputError message={errors.name} className="mt-1" />
                </div>

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
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />

                    <InputError message={errors.email} className="mt-1" />
                </div>

                <div>
                    <InputLabel htmlFor="password" value="Kata Sandi" className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        placeholder="Minimal 8 karakter"
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />

                    <InputError message={errors.password} className="mt-1" />
                </div>

                <div>
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Ulangi Kata Sandi"
                        className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold"
                    />

                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        placeholder="Ketik ulang kata sandi"
                        onChange={(e) =>
                            setData('password_confirmation', e.target.value)
                        }
                        required
                    />

                    <InputError
                        message={errors.password_confirmation}
                        className="mt-1"
                    />
                </div>

                <div className="pt-2">
                    <PrimaryButton className="w-full justify-center gap-2" disabled={processing}>
                        <UserPlus className="w-4 h-4" />
                        {processing ? 'Mendaftarkan Akun...' : 'Daftar Akun Sekarang'}
                    </PrimaryButton>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-white/5 text-center text-xs text-slate-500 dark:text-slate-400">
                    Sudah memiliki akun?{' '}
                    <Link
                        href={route('login')}
                        className="font-semibold text-[#00105B] dark:text-zinc-200 hover:underline"
                    >
                        Masuk di sini
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}

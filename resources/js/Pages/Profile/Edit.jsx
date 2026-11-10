import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import { UserCheck } from '@/Components/Icons/PhosphorDuotone';

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-800/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                        <UserCheck className="w-4 h-4" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                            Pengaturan Akun &amp; Profil
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Kelola informasi identitas, kata sandi, dan keamanan data Anda.
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="Pengaturan Akun" />

            <div className="space-y-6 max-w-4xl">
                <div className="glass-card rounded-2xl p-6 sm:p-8">
                    <UpdateProfileInformationForm
                        mustVerifyEmail={mustVerifyEmail}
                        status={status}
                        className="max-w-xl"
                    />
                </div>

                <div className="glass-card rounded-2xl p-6 sm:p-8">
                    <UpdatePasswordForm className="max-w-xl" />
                </div>

                <div className="glass-card rounded-2xl p-6 sm:p-8 border-rose-200/50 dark:border-rose-900/30">
                    <DeleteUserForm className="max-w-xl" />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

import { Head, Link } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import ThemeToggle from '@/Components/ThemeToggle';
import { SquaresFourDuotone, ArrowLeft } from '@/Components/Icons/PhosphorDuotone';

export default function Error({ status = 404 }) {
    const errorDetails = {
        404: {
            title: '404 - Halaman Tidak Ditemukan',
            subtitle: 'Ups! Halaman yang kamu cari tidak ditemukan atau sudah dipindahkan.',
            description: 'Jangan khawatir, uang dan catatan keuanganmu tetap aman bersama Si Uangku.',
        },
        403: {
            title: '403 - Akses Dibatasi',
            subtitle: 'Kamu tidak memiliki izin untuk mengakses halaman atau data ini.',
            description: 'Silakan periksa kembali akunmu atau hubungi administrator bila merasa ini adalah kekeliruan.',
        },
        500: {
            title: '500 - Terjadi Kendala Sistem',
            subtitle: 'Maaf, server sedang mengalami gangguan teknis sementara.',
            description: 'Tim kami sedang memperbaiki masalah ini. Silakan coba muat ulang beberapa saat lagi.',
        },
        503: {
            title: '503 - Pemeliharaan Sistem',
            subtitle: 'Layanan Uangku sedang dalam pemeliharaan berkala.',
            description: 'Kami sedang melakukan peningkatan performa. Kami akan segera kembali dalam sekejap!',
        },
    };

    const currentError = errorDetails[status] || errorDetails[404];

    return (
        <div className="min-h-screen bg-[#F1F5F9] dark:bg-[#121214] text-slate-800 dark:text-zinc-100 flex flex-col justify-between p-4 sm:p-6 relative overflow-hidden transition-colors duration-200">
            <Head title={currentError.title} />

            {/* Zero-lag ambient background glow */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 ambient-bg-glow" />

            {/* Header: Logo & Theme Switcher */}
            <header className="relative z-10 max-w-7xl w-full mx-auto flex items-center justify-between">
                <Link href="/" className="focus:outline-none transition-transform hover:scale-105 active:scale-95">
                    <ApplicationLogo className="h-10 sm:h-11 w-auto" />
                </Link>
                <ThemeToggle />
            </header>

            {/* Content Card with Mascot */}
            <main className="relative z-10 max-w-lg w-full mx-auto my-auto py-8 text-center">
                <div className="glass-card rounded-3xl p-8 sm:p-10 border border-slate-200 dark:border-[#2C2C32] shadow-xl">
                    {/* Mascot Illustration with Gentle Float */}
                    <div className="relative w-40 h-40 sm:w-48 sm:h-48 mx-auto mb-6 flex items-center justify-center">
                        <div className="absolute inset-0 bg-[#00105B]/15 dark:bg-white/[0.06] rounded-full blur-2xl" />
                        <img
                            src="/assets/mascot.png"
                            alt="Si Uangku"
                            className="relative z-10 w-full h-full object-contain drop-shadow-md animate-bounce [animation-duration:4s]"
                        />
                    </div>

                    {/* Status Pill */}
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300 border border-rose-200 dark:border-rose-500/30 mb-3">
                        <span>Kode Status: {status}</span>
                    </div>

                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        {currentError.subtitle}
                    </h1>

                    <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-zinc-400 leading-relaxed max-w-sm mx-auto">
                        {currentError.description}
                    </p>

                    {/* Action Buttons */}
                    <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                        <Link
                            href={route('dashboard')}
                            prefetch
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-[#00105B] hover:bg-[#000B42] dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-950 active:scale-95 text-white text-xs sm:text-sm font-bold shadow-md shadow-[#00105B]/25 dark:shadow-black/40 transition duration-150"
                        >
                            <SquaresFourDuotone className="w-4 h-4" />
                            <span>Buka Dashboard</span>
                        </Link>

                        <button
                            type="button"
                            onClick={() => window.history.back()}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-[#242429] dark:hover:bg-[#2E2E35] text-slate-700 dark:text-zinc-200 text-xs sm:text-sm font-bold transition active:scale-95 border border-slate-200 dark:border-[#2C2C32]"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span>Kembali</span>
                        </button>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="relative z-10 max-w-7xl w-full mx-auto text-center text-xs text-slate-400 dark:text-zinc-500 py-3 space-y-1">
                <p>&copy; {new Date().getFullYear()} Uangku &bull; Kelola Keuangan Lebih Mudah &amp; Aman</p>
                <p>
                    Dibuat oleh{' '}
                    <a
                        href="https://my-portfolio-alpha-roan-39.vercel.app"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-[#00105B] dark:text-zinc-200 hover:underline hover:opacity-80 dark:hover:text-white transition inline-flex items-center gap-1"
                    >
                        <span>Nur Muhammad Haidar</span>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                    </a>
                </p>
            </footer>
        </div>
    );
}

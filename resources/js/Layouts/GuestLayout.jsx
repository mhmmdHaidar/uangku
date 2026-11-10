import ApplicationLogo from '@/Components/ApplicationLogo';
import ThemeToggle from '@/Components/ThemeToggle';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen relative flex flex-col justify-center items-center px-4 py-12 bg-[#F1F5F9] dark:bg-[#0A1120] transition-colors duration-200">
            {/* Ambient background glows matching Uangku palette */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 opacity-60 dark:opacity-40">
                <div className="absolute top-10 left-1/4 w-80 h-80 bg-emerald-500/10 dark:bg-emerald-500/15 rounded-full blur-3xl" />
                <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-amber-500/10 dark:bg-amber-500/15 rounded-full blur-3xl" />
            </div>

            {/* Top theme switcher */}
            <div className="absolute top-5 right-5 z-20">
                <ThemeToggle />
            </div>

            <div className="relative z-10 w-full max-w-md">
                <div className="flex justify-center mb-6">
                    <Link href="/" className="focus:outline-none transition-transform hover:scale-105 duration-150">
                        <ApplicationLogo className="h-14 sm:h-16 w-auto" />
                    </Link>
                </div>

                <div className="w-full glass-card border border-slate-300 dark:border-[#1E3158]/70 rounded-3xl p-6 sm:p-8 shadow-sm dark:shadow-2xl">
                    {children}
                </div>

                <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400 space-y-1">
                    <p>&copy; {new Date().getFullYear()} Uangku &bull; Kelola keuangan pribadi lebih mudah</p>
                    <p>
                        Dibuat oleh{' '}
                        <a
                            href="https://my-portfolio-alpha-roan-39.vercel.app"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline hover:text-emerald-500 transition inline-flex items-center gap-1"
                        >
                            <span>Nur Muhammad Haidar</span>
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}

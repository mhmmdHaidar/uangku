import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import ThemeToggle from '@/Components/ThemeToggle';
import TupiOnboardingTour, { launchTupiTour } from '@/Components/Tutorial/TupiOnboardingTour';
import {
    SquaresFourDuotone,
    ReceiptDuotone,
    WalletDuotone,
    ChartBarDuotone,
    UserDuotone,
    SignOutDuotone,
    ShieldCheckDuotone,
    ListDuotone,
    XDuotone,
    CheckCircleDuotone,
    WarningCircleDuotone,
} from '@/Components/Icons/PhosphorDuotone';
import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function AuthenticatedLayout({ header, children }) {
    const { auth, flash } = usePage().props;
    const user = auth.user;

    const [showingProfileDrawer, setShowingProfileDrawer] = useState(false);
    const [toastMessage, setToastMessage] = useState(null);
    const [toastType, setToastType] = useState('success');

    // Prevent body scrolling when mobile drawer is open
    useEffect(() => {
        if (showingProfileDrawer) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [showingProfileDrawer]);

    // Handle Escape key to close drawer
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') setShowingProfileDrawer(false);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    useEffect(() => {
        if (flash?.success) {
            setToastMessage(flash.success);
            setToastType('success');
            const timer = setTimeout(() => setToastMessage(null), 4000);
            return () => clearTimeout(timer);
        } else if (flash?.error) {
            setToastMessage(flash.error);
            setToastType('error');
            const timer = setTimeout(() => setToastMessage(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    return (
        <div className="min-h-screen bg-[#F1F5F9] dark:bg-[#0A1120] transition-colors duration-200 relative selection:bg-emerald-500/25 selection:text-emerald-800 dark:selection:text-emerald-200">
            {/* Zero-lag hardware-accelerated ambient background */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 ambient-bg-glow" />

            {/* Toast Notification */}
            {toastMessage && (
                <div className="fixed top-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl glass-card border border-slate-300 dark:border-[#1E3158] shadow-2xl text-sm font-medium animate-in fade-in slide-in-from-top-4 duration-200">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${toastType === 'success' ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/15 text-rose-500 dark:text-rose-400 border border-rose-500/20'}`}>
                        {toastType === 'success' ? (
                            <CheckCircleDuotone className="w-4 h-4" />
                        ) : (
                            <WarningCircleDuotone className="w-4 h-4" />
                        )}
                    </div>
                    <span className="text-slate-800 dark:text-slate-100">{toastMessage}</span>
                    <button
                        onClick={() => setToastMessage(null)}
                        className="ml-2 p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                        <XDuotone className="w-3.5 h-3.5" />
                    </button>
                </div>
            )}

            {/* Navigation Header */}
            <nav className="sticky top-0 z-40 bg-white/95 dark:bg-[#0B1426]/90 backdrop-blur-xl border-b border-slate-200 dark:border-[#1E3158]/70 shadow-[0_1px_4px_rgba(15,23,42,0.05)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between items-center">
                        {/* Left: Brand & Navigation */}
                        <div className="flex items-center gap-8">
                            <Link href={route('dashboard')} prefetch className="focus:outline-none transition-transform hover:scale-[1.02] active:scale-[0.98]">
                                <ApplicationLogo className="h-10 sm:h-11 w-auto" />
                            </Link>

                            <div className="hidden sm:flex items-center gap-1.5 p-1 rounded-2xl bg-slate-200/60 dark:bg-[#0E1A33] border border-slate-300/60 dark:border-[#1E3158]">
                                <Link
                                    href={route('dashboard')}
                                    prefetch
                                    className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition duration-150 ${
                                        route().current('dashboard')
                                            ? 'bg-white dark:bg-[#112143] text-emerald-600 dark:text-emerald-400 shadow-sm border border-slate-300/80 dark:border-emerald-500/40'
                                            : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/5'
                                    }`}
                                >
                                    <SquaresFourDuotone className="w-4 h-4" />
                                    Dashboard
                                </Link>

                                <Link
                                    href={route('transactions.index')}
                                    prefetch
                                    className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition duration-150 ${
                                        route().current('transactions.*')
                                            ? 'bg-white dark:bg-[#112143] text-emerald-600 dark:text-emerald-400 shadow-sm border border-slate-300/80 dark:border-emerald-500/40'
                                            : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/5'
                                    }`}
                                >
                                    <ReceiptDuotone className="w-4 h-4" />
                                    Riwayat Transaksi
                                </Link>

                                <Link
                                    href={route('wallets.index')}
                                    prefetch
                                    className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition duration-150 ${
                                        route().current('wallets.*')
                                            ? 'bg-white dark:bg-[#112143] text-emerald-600 dark:text-emerald-400 shadow-sm border border-slate-300/80 dark:border-emerald-500/40'
                                            : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/5'
                                    }`}
                                >
                                    <WalletDuotone className="w-4 h-4" />
                                    Dompet &amp; Rekening
                                </Link>

                                <Link
                                    href={route('reports.index')}
                                    prefetch
                                    className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition duration-150 ${
                                        route().current('reports.index')
                                            ? 'bg-white dark:bg-[#112143] text-emerald-600 dark:text-emerald-400 shadow-sm border border-slate-300/80 dark:border-emerald-500/40'
                                            : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/5'
                                    }`}
                                >
                                    <ChartBarDuotone className="w-4 h-4" />
                                    Laporan &amp; Grafik
                                </Link>
                            </div>
                        </div>

                        {/* Right: Actions, Theme Toggle, User Profile */}
                        <div className="hidden sm:flex sm:items-center sm:gap-3">
                            <button
                                type="button"
                                onClick={launchTupiTour}
                                title="Panduan Interaktif Bersama Tupi"
                                className="inline-flex items-center gap-1.5 pl-1.5 pr-2.5 py-1 rounded-xl border border-amber-300/80 dark:border-amber-500/30 bg-amber-50/80 dark:bg-amber-500/10 hover:bg-amber-100 dark:hover:bg-amber-500/20 text-amber-800 dark:text-amber-300 text-xs font-bold transition shadow-2xs active:scale-95"
                            >
                                <img src="/assets/mascot-avatar.png" alt="Tupi" className="w-5 h-5 rounded-md object-cover" />
                                <span>Tur Tupi</span>
                            </button>

                            {/* Theme switcher */}
                            <ThemeToggle />

                            {/* User Profile dropdown */}
                            <div className="relative">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <button
                                            type="button"
                                            className="inline-flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl border border-slate-300 dark:border-[#1E3158] bg-white dark:bg-[#0E1A33] hover:bg-slate-50 dark:hover:bg-[#112143] text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 focus:outline-none transition duration-150 shadow-xs"
                                        >
                                            <div className="relative">
                                                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500 via-emerald-600 to-teal-700 text-white font-bold flex items-center justify-center text-xs shadow-sm">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-[#0E1A33] rounded-full" />
                                            </div>
                                            <span className="max-w-[130px] truncate text-left">{user.name}</span>
                                            <svg
                                                className="w-3.5 h-3.5 text-slate-400"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content contentClasses="py-1 bg-white/95 dark:bg-[#0E1A33]/95 backdrop-blur-md border border-slate-200 dark:border-[#1E3158] rounded-2xl shadow-xl">
                                        <div className="px-4 py-2 border-b border-slate-100 dark:border-white/5">
                                            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Masuk sebagai</p>
                                            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">{user.email}</p>
                                        </div>
                                        <Dropdown.Link
                                            href={route('profile.edit')}
                                            className="flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70"
                                        >
                                            <UserDuotone className="w-4 h-4 text-slate-400" />
                                            Pengaturan Akun
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                            className="flex items-center gap-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                                        >
                                            <SignOutDuotone className="w-4 h-4" />
                                            Keluar
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        {/* Mobile Right Controls: Tupi Guide, Theme Toggle & User Profile Avatar Button */}
                        <div className="flex items-center gap-2 sm:hidden">
                            <button
                                type="button"
                                onClick={launchTupiTour}
                                title="Panduan Bersama Tupi"
                                className="p-1 rounded-xl border border-amber-300/80 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/15 hover:bg-amber-100 transition active:scale-95"
                            >
                                <img src="/assets/mascot-avatar.png" alt="Tupi" className="w-6 h-6 rounded-lg object-cover" />
                            </button>
                            <ThemeToggle />
                            <button
                                type="button"
                                onClick={() => setShowingProfileDrawer(true)}
                                aria-label="Buka profil pengguna"
                                className="relative p-0.5 rounded-xl border border-slate-300 dark:border-[#1E3158] hover:border-emerald-500 focus:outline-none transition active:scale-95"
                            >
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 via-emerald-600 to-teal-700 text-white font-extrabold flex items-center justify-center text-xs shadow-sm">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-[#0E1A33] rounded-full" />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Optional Header Banner */}
            {header && (
                <header className="relative z-10 border-b border-slate-200/50 dark:border-white/5 bg-white/40 dark:bg-slate-900/30 backdrop-blur-sm">
                    <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            {/* Main Content */}
            <main className="relative z-10 mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 pb-12 sm:pb-8">
                {children}
            </main>

            {/* App Footer */}
            <footer className="relative z-10 mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 pb-24 sm:pb-6 border-t border-slate-200/80 dark:border-[#1E3158]/50 text-xs text-slate-500 dark:text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
                <p>&copy; {new Date().getFullYear()} Uangku &bull; Seluruh hak cipta dilindungi.</p>
                <p className="flex items-center gap-1.5">
                    <span>Dikembangkan oleh</span>
                    <a
                        href="https://my-portfolio-alpha-roan-39.vercel.app"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 hover:underline transition inline-flex items-center gap-1"
                    >
                        <span>Nur Muhammad Haidar</span>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                    </a>
                </p>
            </footer>

            {/* Modern Mobile Bottom Navigation Dock (Thumb-friendly for smartphone users) */}
            <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#0B1426]/95 backdrop-blur-md border-t border-slate-200/90 dark:border-[#1E3158] px-3 py-1.5 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] dark:shadow-[0_-4px_30px_rgba(0,0,0,0.5)]">
                <div className="grid grid-cols-4 gap-1 items-center max-w-md mx-auto">
                    <Link
                        href={route('dashboard')}
                        prefetch
                        className={`flex flex-col items-center justify-center py-1 px-1 rounded-2xl transition duration-150 ${
                            route().current('dashboard')
                                ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                                : 'text-slate-500 dark:text-slate-400 font-medium hover:text-slate-900 dark:hover:text-white'
                        }`}
                    >
                        <div className={`p-1 rounded-xl transition ${route().current('dashboard') ? 'bg-emerald-50 dark:bg-emerald-500/15' : ''}`}>
                            <SquaresFourDuotone className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] tracking-tight mt-0.5">Dashboard</span>
                    </Link>

                    <Link
                        href={route('transactions.index')}
                        prefetch
                        className={`flex flex-col items-center justify-center py-1 px-1 rounded-2xl transition duration-150 ${
                            route().current('transactions.*')
                                ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                                : 'text-slate-500 dark:text-slate-400 font-medium hover:text-slate-900 dark:hover:text-white'
                        }`}
                    >
                        <div className={`p-1 rounded-xl transition ${route().current('transactions.*') ? 'bg-emerald-50 dark:bg-emerald-500/15' : ''}`}>
                            <ReceiptDuotone className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] tracking-tight mt-0.5">Riwayat</span>
                    </Link>

                    <Link
                        href={route('wallets.index')}
                        prefetch
                        className={`flex flex-col items-center justify-center py-1 px-1 rounded-2xl transition duration-150 ${
                            route().current('wallets.*')
                                ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                                : 'text-slate-500 dark:text-slate-400 font-medium hover:text-slate-900 dark:hover:text-white'
                        }`}
                    >
                        <div className={`p-1 rounded-xl transition ${route().current('wallets.*') ? 'bg-emerald-50 dark:bg-emerald-500/15' : ''}`}>
                            <WalletDuotone className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] tracking-tight mt-0.5">Dompet</span>
                    </Link>

                    <Link
                        href={route('reports.index')}
                        prefetch
                        className={`flex flex-col items-center justify-center py-1 px-1 rounded-2xl transition duration-150 ${
                            route().current('reports.index')
                                ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                                : 'text-slate-500 dark:text-slate-400 font-medium hover:text-slate-900 dark:hover:text-white'
                        }`}
                    >
                        <div className={`p-1 rounded-xl transition ${route().current('reports.index') ? 'bg-emerald-50 dark:bg-emerald-500/15' : ''}`}>
                            <ChartBarDuotone className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] tracking-tight mt-0.5">Laporan</span>
                    </Link>
                </div>
            </nav>

            {/* Mobile Profile Slide-over Drawer (Root level for proper viewport attachment) */}
            {/* 1. Backdrop Overlay */}
            <div
                onClick={() => setShowingProfileDrawer(false)}
                className={`fixed inset-0 z-50 bg-black/70 backdrop-blur-sm sm:hidden transition-opacity duration-300 ease-in-out ${
                    showingProfileDrawer ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}
                aria-hidden="true"
            />

            {/* 2. Drawer Sheet */}
            <aside
                className={`fixed top-0 right-0 bottom-0 z-50 w-[85%] max-w-[320px] h-full sm:hidden bg-white dark:bg-[#0E1A33] border-l border-slate-200 dark:border-[#1E3158] shadow-2xl flex flex-col justify-between overflow-y-auto transition-transform duration-300 ease-in-out transform ${
                    showingProfileDrawer ? 'translate-x-0 pointer-events-auto' : 'translate-x-full pointer-events-none'
                }`}
                aria-label="Menu Profil Pengguna"
            >
                {/* Top Section */}
                <div>
                    {/* Drawer Header */}
                    <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200/80 dark:border-[#1E3158] bg-slate-50 dark:bg-[#0A1224]">
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            <UserDuotone className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                            <span>Profil Pengguna</span>
                        </div>
                        <button
                            type="button"
                            onClick={() => setShowingProfileDrawer(false)}
                            aria-label="Tutup menu profil"
                            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/70 dark:hover:bg-[#1E3158] transition active:scale-95"
                        >
                            <XDuotone className="w-5 h-5" />
                        </button>
                    </div>

                    {/* User Profile Card */}
                    <div className="p-5 border-b border-slate-200/80 dark:border-[#1E3158] bg-white dark:bg-[#0E1A33]">
                        <div className="flex items-center gap-3.5">
                            <div className="relative shrink-0">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 via-emerald-600 to-teal-700 text-white font-extrabold flex items-center justify-center text-lg shadow-md ring-2 ring-emerald-500/20">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                                <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-[#0E1A33] rounded-full" />
                            </div>

                            <div className="min-w-0 flex-1">
                                <h4 className="text-base font-extrabold text-slate-900 dark:text-white truncate">
                                    {user.name}
                                </h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono truncate">
                                    {user.email}
                                </p>
                                <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30">
                                    <ShieldCheckDuotone className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                                    <span>Akun Terverifikasi</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Menu Actions */}
                    <div className="p-4 space-y-2">
                        <p className="px-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                            Menu Akun
                        </p>
                        <Link
                            href={route('profile.edit')}
                            prefetch
                            onClick={() => setShowingProfileDrawer(false)}
                            className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 dark:bg-[#122143]/60 dark:hover:bg-[#122143] border border-slate-200/80 dark:border-[#1E3158] transition group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20 group-hover:scale-105 transition">
                                    <UserDuotone className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-800 dark:text-slate-100">Pengaturan Akun</p>
                                    <p className="text-[11px] text-slate-400 font-normal">Profil, sandi &amp; info akun</p>
                                </div>
                            </div>
                            <span className="text-slate-400 group-hover:text-emerald-500 group-hover:translate-x-0.5 transition">&rarr;</span>
                        </Link>

                        <button
                            type="button"
                            onClick={() => {
                                setShowingProfileDrawer(false);
                                launchTupiTour();
                            }}
                            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-amber-50/70 hover:bg-amber-100/80 dark:bg-amber-500/10 dark:hover:bg-amber-500/20 border border-amber-200/80 dark:border-amber-500/25 transition group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center border border-amber-300/60 dark:border-amber-500/30 overflow-hidden group-hover:scale-105 transition">
                                    <img src="/assets/mascot-avatar.png" alt="Tupi" className="w-8 h-8 object-contain" />
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-bold text-slate-800 dark:text-slate-100">Tur Panduan Tupi</p>
                                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-normal">Pelajari semua fitur bersama Tupi</p>
                                </div>
                            </div>
                            <span className="text-amber-600 dark:text-amber-400 group-hover:translate-x-0.5 transition">&rarr;</span>
                        </button>
                    </div>
                </div>

                {/* Bottom Section: App Info, Developer Credit & Logout */}
                <div className="p-4 border-t border-slate-200/80 dark:border-[#1E3158] space-y-3 bg-slate-50 dark:bg-[#0A1224]">
                    <div className="space-y-1.5 px-1 text-[11px] text-slate-400">
                        <div className="flex items-center justify-between">
                            <span>Versi Aplikasi</span>
                            <span className="font-mono font-bold text-slate-600 dark:text-slate-300">v1.0 &bull; Uangku</span>
                        </div>
                        <div className="flex items-center justify-between pt-1.5 border-t border-slate-200/60 dark:border-white/5">
                            <span>Pengembang</span>
                            <a
                                href="https://my-portfolio-alpha-roan-39.vercel.app"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-1"
                            >
                                <span>Nur Muhammad Haidar</span>
                                <span className="text-[10px]">&nearr;</span>
                            </a>
                        </div>
                    </div>

                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-950/60 text-rose-600 dark:text-rose-400 text-sm font-bold border border-rose-200 dark:border-rose-900/40 transition active:scale-95 shadow-sm"
                    >
                        <SignOutDuotone className="w-4 h-4" />
                        <span>Keluar dari Akun</span>
                    </Link>
                </div>
            </aside>

            {/* Full-Body Tupi Interactive Cross-Page Tutorial */}
            <TupiOnboardingTour />
        </div>
    );
}

import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import ThemeToggle from '@/Components/ThemeToggle';
import UserAvatar from '@/Components/UserAvatar';
import TupiOnboardingTour, { launchTupiTour } from '@/Components/Tutorial/TupiOnboardingTour';
import TupiChatModal from '@/Components/Chat/TupiChatModal';
import SaranModal from '@/Components/Feedback/SaranModal';
import { Info, MessageSquarePlus } from 'lucide-react';
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
    const [showingTupiChat, setShowingTupiChat] = useState(false);
    const [showingFeedbackModal, setShowingFeedbackModal] = useState(false);
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
        <div className="min-h-screen bg-[#F1F5F9] dark:bg-[#121214] transition-colors duration-200 relative selection:bg-[#00105B]/20 selection:text-[#00105B] dark:selection:bg-zinc-600/40 dark:selection:text-zinc-100">
            {/* Zero-lag hardware-accelerated ambient background */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 ambient-bg-glow" />

            {/* Toast Notification */}
            {toastMessage && (
                <div className="fixed top-[calc(1.25rem+env(safe-area-inset-top,0px))] right-[calc(1rem+env(safe-area-inset-right,0px))] z-50 flex items-center gap-3 px-4 py-3 rounded-2xl glass-card border border-slate-300 dark:border-[#2C2C32] shadow-2xl text-sm font-medium animate-in fade-in slide-in-from-top-4 duration-200">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${toastType === 'success' ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/15 text-rose-500 dark:text-rose-400 border border-rose-500/20'}`}>
                        {toastType === 'success' ? (
                            <CheckCircleDuotone className="w-4 h-4" />
                        ) : (
                            <WarningCircleDuotone className="w-4 h-4" />
                        )}
                    </div>
                    <span className="text-slate-800 dark:text-zinc-100">{toastMessage}</span>
                    <button
                        onClick={() => setToastMessage(null)}
                        className="ml-2 p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-[#2A2A30]"
                    >
                        <XDuotone className="w-3.5 h-3.5" />
                    </button>
                </div>
            )}

            {/* Navigation Header (Safe-Area aware for Notch / Dynamic Island / Punch-Hole) */}
            <nav className="sticky top-0 z-40 pt-safe px-safe bg-white/95 dark:bg-[#161619]/95 backdrop-blur-xl border-b border-slate-200 dark:border-[#2C2C32] shadow-[0_1px_4px_rgba(15,23,42,0.05)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.45)]">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between items-center">
                        {/* Left: Brand & Navigation */}
                        <div className="flex items-center gap-8">
                            <Link href={route('dashboard')} prefetch className="focus:outline-none transition-transform hover:scale-[1.02] active:scale-[0.98]">
                                <ApplicationLogo className="h-10 sm:h-11 w-auto" />
                            </Link>

                            <div className="hidden sm:flex items-center gap-1.5 p-1 rounded-2xl bg-slate-200/60 dark:bg-[#1E1E23] border border-slate-300/60 dark:border-[#2C2C32]">
                                <Link
                                    href={route('dashboard')}
                                    prefetch
                                    className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition duration-150 ${
                                        route().current('dashboard')
                                            ? 'bg-white dark:bg-[#2A2A32] text-[#00105B] dark:text-white shadow-sm border border-slate-300/80 dark:border-[#3E3E46]'
                                            : 'text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/5'
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
                                            ? 'bg-white dark:bg-[#2A2A32] text-[#00105B] dark:text-white shadow-sm border border-slate-300/80 dark:border-[#3E3E46]'
                                            : 'text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/5'
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
                                            ? 'bg-white dark:bg-[#2A2A32] text-[#00105B] dark:text-white shadow-sm border border-slate-300/80 dark:border-[#3E3E46]'
                                            : 'text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/5'
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
                                            ? 'bg-white dark:bg-[#2A2A32] text-[#00105B] dark:text-white shadow-sm border border-slate-300/80 dark:border-[#3E3E46]'
                                            : 'text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/5'
                                    }`}
                                >
                                    <ChartBarDuotone className="w-4 h-4" />
                                    Laporan &amp; Grafik
                                </Link>
                            </div>
                        </div>

                        {/* Right: Actions, Theme Toggle, User Profile */}
                        <div className="hidden sm:flex sm:items-center sm:gap-3">
                            {/* Theme switcher */}
                            <ThemeToggle />

                            {/* User Profile dropdown */}
                            <div className="relative">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <button
                                            type="button"
                                            className="inline-flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl border border-slate-300 dark:border-[#2C2C32] bg-white dark:bg-[#1C1C20] hover:bg-slate-50 dark:hover:bg-[#242429] text-xs sm:text-sm font-semibold text-slate-700 dark:text-zinc-200 focus:outline-none transition duration-150 shadow-xs"
                                        >
                                            <div className="relative">
                                                <UserAvatar
                                                    user={user}
                                                    sizeClass="w-7 h-7"
                                                    textClass="text-xs font-bold"
                                                />
                                                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-[#1C1C20] rounded-full" />
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

                                    <Dropdown.Content contentClasses="py-1 bg-white/95 dark:bg-[#1C1C20]/95 backdrop-blur-md border border-slate-200 dark:border-[#2C2C32] rounded-2xl shadow-xl">
                                        <div className="px-4 py-2 border-b border-slate-100 dark:border-white/5">
                                            <p className="text-xs text-slate-400 dark:text-zinc-500 font-medium">Masuk sebagai</p>
                                            <p className="text-xs font-semibold text-slate-800 dark:text-zinc-200 truncate">{user.email}</p>
                                        </div>
                                        <Dropdown.Link
                                            href={route('profile.edit')}
                                            className="flex items-center gap-2 text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-[#242429]"
                                        >
                                            <UserDuotone className="w-4 h-4 text-slate-400" />
                                            Pengaturan Akun
                                        </Dropdown.Link>
                                        <button
                                            type="button"
                                            onClick={launchTupiTour}
                                            className="w-full text-left px-4 py-2 text-sm leading-5 flex items-center gap-2 text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-[#242429] transition"
                                        >
                                            <img src="/assets/mascot-avatar.png" alt="Tupi" className="w-4 h-4 rounded-sm object-cover" />
                                            <span>Tur Panduan Tupi</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setShowingTupiChat(true)}
                                            className="w-full text-left px-4 py-2 text-sm leading-5 flex items-center gap-2 text-[#00105B] dark:text-zinc-100 font-semibold hover:bg-[#00105B]/10 dark:hover:bg-[#242429] transition"
                                        >
                                            <img src="/assets/tupi/tupi-wave.png" alt="Tanya Tupi" className="w-4 h-4 object-contain" />
                                            <span>Tanya Tupi</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setShowingFeedbackModal(true)}
                                            className="w-full text-left px-4 py-2 text-sm leading-5 flex items-center gap-2 text-slate-700 dark:text-zinc-300 font-medium hover:bg-slate-100 dark:hover:bg-[#242429] transition"
                                        >
                                            <MessageSquarePlus className="w-4 h-4 text-[#00105B] dark:text-zinc-200" />
                                            <span>Saran &amp; Masukan</span>
                                        </button>
                                        <Dropdown.Link
                                            href={route('about')}
                                            className={`flex items-center gap-2 transition ${
                                                route().current('about')
                                                    ? 'bg-[#00105B]/10 dark:bg-[#242429] text-[#00105B] dark:text-white font-semibold'
                                                    : 'text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-[#242429]'
                                            }`}
                                        >
                                            <Info className="w-4 h-4 text-[#00105B] dark:text-zinc-200" />
                                            <span>Tentang Uangku</span>
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                            className="flex items-center gap-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 border-t border-slate-100 dark:border-white/5"
                                        >
                                            <SignOutDuotone className="w-4 h-4" />
                                            Keluar
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        {/* Mobile Right Controls: Theme Toggle & User Profile Avatar Button */}
                        <div className="flex items-center gap-2 sm:hidden relative z-10">
                            <ThemeToggle className="touch-manipulation" />
                            <button
                                type="button"
                                onClick={() => setShowingProfileDrawer(true)}
                                aria-label="Buka profil pengguna"
                                className="relative p-0.5 rounded-full border border-slate-300 dark:border-[#2C2C32] hover:border-[#00105B] dark:hover:border-zinc-400 focus:outline-none transition active:scale-95 touch-manipulation cursor-pointer"
                            >
                                <UserAvatar
                                    user={user}
                                    sizeClass="w-8 h-8"
                                    textClass="text-xs font-extrabold"
                                />
                                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-[#161619] rounded-full" />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Optional Header Banner */}
            {header && (
                <header className="relative z-10 border-b border-slate-200/50 dark:border-[#2C2C32] bg-white/40 dark:bg-[#161619]/60 backdrop-blur-sm">
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
            <footer className="relative z-10 mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))] sm:pb-6 border-t border-slate-200/80 dark:border-[#2C2C32] text-xs text-slate-500 dark:text-zinc-400 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
                <p>&copy; {new Date().getFullYear()} Uangku &bull; Seluruh hak cipta dilindungi.</p>
                <p
                    data-tour="app-footer-dev"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl"
                >
                    <span>Dikembangkan oleh</span>
                    <a
                        href="https://my-portfolio-alpha-roan-39.vercel.app"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-[#00105B] dark:text-zinc-200 hover:opacity-80 dark:hover:text-white hover:underline transition inline-flex items-center gap-1"
                    >
                        <span>Nur Muhammad Haidar</span>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                    </a>
                </p>
            </footer>

            {/* Modern Mobile Bottom Navigation Dock (Thumb-friendly + Home Indicator safe area) */}
            <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 pb-safe px-safe bg-white dark:bg-[#161619] border-t border-slate-200/90 dark:border-[#2C2C32] shadow-[0_-4px_20px_rgba(0,0,0,0.06)] dark:shadow-[0_-4px_30px_rgba(0,0,0,0.55)]">
                <div className="px-3 py-1.5 grid grid-cols-4 gap-1 items-center max-w-md mx-auto">
                    <Link
                        href={route('dashboard')}
                        prefetch
                        className={`flex flex-col items-center justify-center py-1 px-1 rounded-2xl transition duration-150 ${
                            route().current('dashboard')
                                ? 'text-[#00105B] dark:text-white font-bold'
                                : 'text-slate-500 dark:text-zinc-400 font-medium hover:text-slate-900 dark:hover:text-white'
                        }`}
                    >
                        <div className={`p-1 rounded-xl transition ${route().current('dashboard') ? 'bg-[#00105B]/10 dark:bg-[#2A2A32]' : ''}`}>
                            <SquaresFourDuotone className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] tracking-tight mt-0.5">Dashboard</span>
                    </Link>

                    <Link
                        href={route('transactions.index')}
                        prefetch
                        className={`flex flex-col items-center justify-center py-1 px-1 rounded-2xl transition duration-150 ${
                            route().current('transactions.*')
                                ? 'text-[#00105B] dark:text-white font-bold'
                                : 'text-slate-500 dark:text-zinc-400 font-medium hover:text-slate-900 dark:hover:text-white'
                        }`}
                    >
                        <div className={`p-1 rounded-xl transition ${route().current('transactions.*') ? 'bg-[#00105B]/10 dark:bg-[#2A2A32]' : ''}`}>
                            <ReceiptDuotone className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] tracking-tight mt-0.5">Riwayat</span>
                    </Link>

                    <Link
                        href={route('wallets.index')}
                        prefetch
                        className={`flex flex-col items-center justify-center py-1 px-1 rounded-2xl transition duration-150 ${
                            route().current('wallets.*')
                                ? 'text-[#00105B] dark:text-white font-bold'
                                : 'text-slate-500 dark:text-zinc-400 font-medium hover:text-slate-900 dark:hover:text-white'
                        }`}
                    >
                        <div className={`p-1 rounded-xl transition ${route().current('wallets.*') ? 'bg-[#00105B]/10 dark:bg-[#2A2A32]' : ''}`}>
                            <WalletDuotone className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] tracking-tight mt-0.5">Dompet</span>
                    </Link>

                    <Link
                        href={route('reports.index')}
                        prefetch
                        className={`flex flex-col items-center justify-center py-1 px-1 rounded-2xl transition duration-150 ${
                            route().current('reports.index')
                                ? 'text-[#00105B] dark:text-white font-bold'
                                : 'text-slate-500 dark:text-zinc-400 font-medium hover:text-slate-900 dark:hover:text-white'
                        }`}
                    >
                        <div className={`p-1 rounded-xl transition ${route().current('reports.index') ? 'bg-[#00105B]/10 dark:bg-[#2A2A32]' : ''}`}>
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
                className={`fixed inset-0 z-50 bg-black/75 backdrop-blur-sm sm:hidden transition-opacity duration-300 ease-in-out ${
                    showingProfileDrawer ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}
                aria-hidden="true"
            />

            {/* 2. Drawer Sheet */}
            <aside
                className={`fixed top-0 right-0 bottom-0 z-50 w-[85%] max-w-[320px] h-full sm:hidden pt-safe pb-safe bg-white dark:bg-[#1C1C20] border-l border-slate-200 dark:border-[#2C2C32] shadow-2xl flex flex-col justify-between overflow-y-auto transition-transform duration-300 ease-in-out transform ${
                    showingProfileDrawer ? 'translate-x-0 pointer-events-auto' : 'translate-x-full pointer-events-none'
                }`}
                aria-label="Menu Profil Pengguna"
            >
                {/* Top Section */}
                <div>
                    {/* Drawer Header */}
                    <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200/80 dark:border-[#2C2C32] bg-slate-50 dark:bg-[#161619]">
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                            <UserDuotone className="w-4 h-4 text-[#00105B] dark:text-zinc-200" />
                            <span>Profil Pengguna</span>
                        </div>
                        <button
                            type="button"
                            onClick={() => setShowingProfileDrawer(false)}
                            aria-label="Tutup menu profil"
                            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 hover:bg-slate-200/70 dark:hover:bg-[#2A2A30] transition active:scale-95"
                        >
                            <XDuotone className="w-5 h-5" />
                        </button>
                    </div>

                    {/* User Profile Card */}
                    <div className="p-5 border-b border-slate-200/80 dark:border-[#2C2C32] bg-white dark:bg-[#1C1C20]">
                        <div className="flex items-center gap-3.5">
                            <div className="relative shrink-0">
                                <UserAvatar
                                    user={user}
                                    sizeClass="w-12 h-12"
                                    textClass="text-lg font-extrabold"
                                    className="shadow-md ring-2 ring-[#00105B]/20 dark:ring-white/10"
                                />
                                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-[#1C1C20] rounded-full" />
                            </div>

                            <div className="min-w-0 flex-1">
                                <h4 className="text-base font-extrabold text-slate-900 dark:text-white truncate">
                                    {user.name}
                                </h4>
                                <p className="text-xs text-slate-500 dark:text-zinc-400 font-mono truncate">
                                    {user.email}
                                </p>
                                <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#00105B]/10 text-[#00105B] dark:bg-[#242429] dark:text-zinc-200 border border-[#00105B]/20 dark:border-[#3E3E46]">
                                    <ShieldCheckDuotone className="w-3 h-3 text-[#00105B] dark:text-zinc-200" />
                                    <span>Akun Terverifikasi</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Menu Actions */}
                    <div className="p-4 space-y-2">
                        <p className="px-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                            Menu Akun
                        </p>
                        <Link
                            href={route('profile.edit')}
                            prefetch
                            onClick={() => setShowingProfileDrawer(false)}
                            className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 dark:bg-[#222227] dark:hover:bg-[#2A2A30] border border-slate-200/80 dark:border-[#2C2C32] transition group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-[#00105B]/10 dark:bg-[#2A2A30] text-[#00105B] dark:text-zinc-200 flex items-center justify-center border border-[#00105B]/20 dark:border-[#3E3E46] group-hover:scale-105 transition">
                                    <UserDuotone className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-800 dark:text-zinc-100">Pengaturan Akun</p>
                                    <p className="text-[11px] text-slate-400 font-normal">Profil, sandi &amp; info akun</p>
                                </div>
                            </div>
                            <span className="text-slate-400 group-hover:text-[#00105B] dark:group-hover:text-white group-hover:translate-x-0.5 transition">&rarr;</span>
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
                                    <p className="text-sm font-bold text-slate-800 dark:text-zinc-100">Tur Panduan Tupi</p>
                                    <p className="text-[11px] text-slate-500 dark:text-zinc-400 font-normal">Pelajari semua fitur bersama Tupi</p>
                                </div>
                            </div>
                            <span className="text-amber-600 dark:text-amber-400 group-hover:translate-x-0.5 transition">&rarr;</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                setShowingProfileDrawer(false);
                                setShowingTupiChat(true);
                            }}
                            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-[#00105B]/5 hover:bg-[#00105B]/10 dark:bg-[#222227] dark:hover:bg-[#2A2A30] border border-[#00105B]/20 dark:border-[#2C2C32] transition group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-[#00105B]/10 dark:bg-[#2A2A30] flex items-center justify-center border border-[#00105B]/20 dark:border-[#3E3E46] overflow-hidden group-hover:scale-105 transition">
                                    <img src="/assets/tupi/tupi-wave.png" alt="Tanya Tupi" className="w-8 h-8 object-contain" />
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-bold text-slate-800 dark:text-zinc-100">Tanya Tupi</p>
                                    <p className="text-[11px] text-slate-500 dark:text-zinc-400 font-normal">Layanan tanya jawab seputar Uangku</p>
                                </div>
                            </div>
                            <span className="text-[#00105B] dark:text-zinc-300 dark:group-hover:text-white group-hover:translate-x-0.5 transition">&rarr;</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                setShowingProfileDrawer(false);
                                setShowingFeedbackModal(true);
                            }}
                            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 dark:bg-[#222227] dark:hover:bg-[#2A2A30] border border-slate-200/80 dark:border-[#2C2C32] transition group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-[#00105B]/10 dark:bg-[#2A2A30] text-[#00105B] dark:text-zinc-200 flex items-center justify-center border border-[#00105B]/20 dark:border-[#3E3E46] group-hover:scale-105 transition">
                                    <MessageSquarePlus className="w-5 h-5" />
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-bold text-slate-800 dark:text-zinc-100">Saran &amp; Masukan</p>
                                    <p className="text-[11px] text-slate-500 dark:text-zinc-400 font-normal">Kirim masukan &amp; hubungi pengembang</p>
                                </div>
                            </div>
                            <span className="text-slate-400 group-hover:text-[#00105B] dark:group-hover:text-white group-hover:translate-x-0.5 transition">&rarr;</span>
                        </button>

                        <Link
                            href={route('about')}
                            prefetch
                            onClick={() => setShowingProfileDrawer(false)}
                            className={`flex items-center justify-between p-3.5 rounded-2xl border transition group ${
                                route().current('about')
                                    ? 'bg-[#00105B]/10 dark:bg-[#2A2A32] border-[#00105B]/25 dark:border-[#3E3E46]'
                                    : 'bg-slate-50 hover:bg-slate-100 dark:bg-[#222227] dark:hover:bg-[#2A2A30] border-slate-200/80 dark:border-[#2C2C32]'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-[#00105B]/10 dark:bg-[#2A2A30] text-[#00105B] dark:text-zinc-200 flex items-center justify-center border border-[#00105B]/20 dark:border-[#3E3E46] group-hover:scale-105 transition">
                                    <Info className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-800 dark:text-zinc-100">Tentang Uangku</p>
                                    <p className="text-[11px] text-slate-500 dark:text-zinc-400 font-normal">Visi, misi &amp; cerita aplikasi</p>
                                </div>
                            </div>
                            <span className="text-slate-400 group-hover:text-[#00105B] dark:group-hover:text-white group-hover:translate-x-0.5 transition">&rarr;</span>
                        </Link>
                    </div>
                </div>

                {/* Bottom Section: App Info, Developer Credit & Logout */}
                <div className="p-4 border-t border-slate-200/80 dark:border-[#2C2C32] space-y-3 bg-slate-50 dark:bg-[#161619]">
                    <div className="space-y-1.5 px-1 text-[11px] text-slate-400">
                        <div className="flex items-center justify-between">
                            <span>Versi Aplikasi</span>
                            <span className="font-mono font-bold text-slate-600 dark:text-zinc-300">v1.0 &bull; Uangku</span>
                        </div>
                        <div className="flex items-center justify-between pt-1.5 border-t border-slate-200/60 dark:border-white/5">
                            <span>Pengembang</span>
                            <a
                                href="https://my-portfolio-alpha-roan-39.vercel.app"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-bold text-[#00105B] dark:text-zinc-200 dark:hover:text-white hover:underline inline-flex items-center gap-1"
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

            {/* Tanya Tupi Customer Service Chatbot Modal */}
            <TupiChatModal
                isOpen={showingTupiChat}
                onClose={() => setShowingTupiChat(false)}
            />

            {/* Saran & Masukan Developer Feedback Modal */}
            <SaranModal
                isOpen={showingFeedbackModal}
                onClose={() => setShowingFeedbackModal(false)}
            />
        </div>
    );
}

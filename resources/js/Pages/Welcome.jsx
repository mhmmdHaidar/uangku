import ApplicationLogo from '@/Components/ApplicationLogo';
import ThemeToggle from '@/Components/ThemeToggle';
import { formatRupiah } from '@/Utils/format';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import {
    ArrowRight,
    ArrowDownLeft,
    ArrowUpRight,
    Wallet,
    CheckCircle2,
    Coins,
    Sparkles,
    TrendingUp,
    BarChart3,
    CreditCard,
    Smartphone,
    ShieldCheck,
    Zap,
    Menu,
    X,
    Check,
    Lock,
    PieChart,
    Layers,
    ChevronDown,
} from '@/Components/Icons/PhosphorDuotone';
import {
    PocketBadge,
    MoneyBadge,
    ExpenseBadge,
    CoinsBadge,
    TargetBadge,
} from '@/Components/Icons/ColorBadges';

export default function Welcome({ auth }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[#000B42] dark:bg-[#121214] text-slate-800 dark:text-zinc-100 transition-colors duration-200 selection:bg-[#00105B]/20 dark:selection:bg-zinc-600/40 selection:text-[#00105B] dark:selection:text-zinc-100 relative font-sans overflow-x-hidden">
            <Head title="Uangku — Kelola Keuanganmu Lebih Mudah" />

            {/* ======================================================== */}
            {/* 1. TOP WHITE CURVED ISLAND (HERO & NAVIGATION)           */}
            {/* ======================================================== */}
            <div className="bg-white dark:bg-[#161619] rounded-b-[40px] sm:rounded-b-[56px] lg:rounded-b-[64px] shadow-[0_12px_40px_rgba(0,0,0,0.06)] dark:shadow-[0_16px_50px_rgba(0,0,0,0.5)] border-b border-slate-200/90 dark:border-[#2C2C32] relative z-20 pb-16 sm:pb-24 lg:pb-32">

                {/* Ambient glow inside white island */}
                <div className="absolute top-0 right-1/4 w-[450px] h-[450px] bg-gradient-to-br from-amber-500/8 via-[#00105B]/6 dark:from-amber-500/5 dark:via-white/[0.03] to-transparent rounded-full blur-3xl pointer-events-none" />
                <div className="absolute top-1/3 left-10 w-[350px] h-[350px] bg-gradient-to-tr from-[#00105B]/8 dark:from-white/[0.03] to-transparent rounded-full blur-3xl pointer-events-none" />

                {/* --- NAVIGATION BAR (Safe-Area aware for Notch / Dynamic Island / Punch-Hole) --- */}
                <div className="pt-safe px-safe relative z-30">
                <header className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
                    <div className="flex items-center justify-between">
                        {/* Left: Brand Logo */}
                        <Link href="/" className="focus:outline-none transition-transform hover:scale-[1.02] shrink-0">
                            <ApplicationLogo className="h-10 sm:h-11 w-auto" />
                        </Link>

                        {/* Center: Navigation Links (Desktop) */}
                        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600 dark:text-slate-300">
                            <a href="#fitur" className="hover:text-[#00105B] dark:hover:text-white transition-colors">
                                Fitur
                            </a>
                            <a href="#cara-kerja" className="hover:text-[#00105B] dark:hover:text-white transition-colors">
                                Cara Kerja
                            </a>

                        </nav>

                        {/* Right: Theme Toggle & CTA Buttons */}
                        <div className="hidden md:flex items-center gap-3">
                            <ThemeToggle />

                            {auth?.user ? (
                                <Link
                                    href={route('dashboard')}
                                    prefetch
                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#00105B] hover:bg-[#000B42] dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-950 text-xs sm:text-sm font-bold shadow-sm transition active:scale-95"
                                >
                                    <span>Buka Dashboard</span>
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <Link
                                        href={route('login')}
                                        prefetch
                                        className="px-4 py-2 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 hover:text-[#00105B] dark:hover:text-white transition"
                                    >
                                        Masuk
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        prefetch
                                        className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#00105B] hover:bg-[#000B42] dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-950 text-xs sm:text-sm font-bold shadow-sm transition active:scale-95"
                                    >
                                        <span>Mulai Sekarang</span>
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Mobile Menu Trigger & Theme Toggle */}
                        <div className="flex md:hidden items-center gap-2 relative z-40">
                            <ThemeToggle className="touch-manipulation" />
                            <button
                                type="button"
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                aria-label="Toggle Navigation Menu"
                                className="p-2.5 min-w-[42px] min-h-[42px] inline-flex items-center justify-center rounded-xl text-slate-600 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#242429] transition touch-manipulation cursor-pointer"
                            >
                                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Dropdown Menu */}
                    {mobileMenuOpen && (
                        <div className="md:hidden mt-4 p-5 rounded-3xl glass-card border border-slate-200 dark:border-[#2C2C32] shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
                            <nav className="flex flex-col gap-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
                                <a
                                    href="#fitur"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-[#242429] transition"
                                >
                                    Fitur
                                </a>
                                <a
                                    href="#cara-kerja"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-[#242429] transition"
                                >
                                    Cara Kerja
                                </a>

                            </nav>
                            <div className="pt-3 border-t border-slate-200/80 dark:border-white/10 flex flex-col gap-2">
                                {auth?.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        prefetch
                                        className="w-full text-center py-2.5 rounded-full bg-[#00105B] dark:bg-zinc-100 text-white dark:text-zinc-950 text-sm font-bold shadow-sm"
                                    >
                                        Buka Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route('register')}
                                            prefetch
                                            className="w-full text-center py-2.5 rounded-full bg-[#00105B] hover:bg-[#000B42] dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-950 text-sm font-bold shadow-sm"
                                        >
                                            Coba Gratis Sekarang
                                        </Link>
                                        <Link
                                            href={route('login')}
                                            prefetch
                                            className="w-full text-center py-2 text-sm font-semibold text-slate-600 dark:text-slate-300"
                                        >
                                            Masuk ke Akun
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </header>
                </div>

                {/* --- HERO CONTENT: 2-COLUMN LAYOUT --- */}
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-12 lg:pt-16">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

                        {/* LEFT COLUMN: Headings & CTA (7 cols on desktop) */}
                        <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                            {/* Brand Pill with Mascot Pip */}
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#00105B]/10 text-[#00105B] dark:bg-[#222227] dark:text-zinc-200 border border-[#00105B]/20 dark:border-[#32323A] text-xs font-semibold shadow-2xs">
                                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                                <span>Aplikasi Manajemen Keuangan Pribadi Modern</span>
                            </div>

                            {/* Main Reference Headline */}
                            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.12]">
                                Kelola Keuanganmu Lebih Mudah Bersama{' '}
                                <span className="text-[#00105B] dark:bg-gradient-to-r dark:from-white dark:via-zinc-200 dark:to-zinc-400 dark:bg-clip-text dark:text-transparent">
                                    Uangku
                                </span>
                            </h1>

                            {/* Reference Subtitle */}
                            <p className="text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl mx-auto lg:mx-0">
                                Catat pengeluaran, buat anggaran, dan capai impian finansialmu secara otomatis, aman, dan menyenangkan tanpa distraksi iklan.
                            </p>

                            {/* CTA Buttons in Reference Style */}
                            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
                                <Link
                                    href={auth?.user ? route('dashboard') : route('register')}
                                    prefetch
                                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#00105B] hover:bg-[#000B42] dark:bg-zinc-100 dark:hover:bg-white active:scale-95 text-white dark:text-zinc-950 font-bold text-sm sm:text-base shadow-lg shadow-[#00105B]/25 dark:shadow-none transition-all duration-200"
                                >
                                    <span>Coba Gratis Sekarang</span>
                                    <ArrowRight className="w-4 h-4" />
                                </Link>

                                <a
                                    href="#cara-kerja"
                                    className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-[#242429] dark:hover:bg-[#2E2E35] active:scale-95 text-[#00105B] dark:text-zinc-100 border border-slate-300 dark:border-[#32323A] font-bold text-sm sm:text-base shadow-xs transition-all duration-200"
                                >
                                    <span>Lihat Cara Kerja</span>
                                </a>
                            </div>

                            {/* Trust Signals */}
                            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-5 text-xs text-slate-500 dark:text-slate-400 font-medium">
                                <div className="flex items-center gap-1.5">
                                    <Check className="w-4 h-4 text-[#00105B] dark:text-emerald-400 stroke-[3]" />
                                    <span>100% Gratis &amp; Mandiri</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Check className="w-4 h-4 text-[#00105B] dark:text-emerald-400 stroke-[3]" />
                                    <span>Privasi Multi-Tenant Terisolasi</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Check className="w-4 h-4 text-[#00105B] dark:text-emerald-400 stroke-[3]" />
                                    <span>Tanpa Iklan atau Tracking</span>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Mascot Hero Visual with Interactive Floating Cards (5 cols) */}
                        <div className="lg:col-span-5 relative flex items-center justify-center pt-4 lg:pt-0">
                            {/* Radial Ambient Glow Behind Mascot */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-amber-400/20 via-[#00105B]/10 to-slate-400/10 dark:from-amber-400/12 dark:via-white/[0.04] dark:to-transparent rounded-full blur-3xl pointer-events-none transform scale-90" />

                            <div className="relative z-10 w-full max-w-sm sm:max-w-md mx-auto flex items-center justify-center">
                                {/* Mascot Illustration (Tupai Si Uangku dengan Koin Rp & Grafik) */}
                                <div className="relative group select-none">
                                    <img
                                        src="/assets/mascot.png"
                                        alt="Maskot Si Uangku"
                                        className="w-56 sm:w-72 lg:w-80 h-auto object-contain drop-shadow-[0_20px_35px_rgba(245,158,11,0.25)] transition-transform duration-500 group-hover:scale-105"
                                    />

                                    {/* Floating Pill 1: Tabungan Terjaga (Top Left) */}
                                    <div className="absolute -top-3 -left-4 sm:-top-4 sm:-left-8 bg-white/95 dark:bg-[#1C1C20]/95 backdrop-blur-md rounded-2xl p-2.5 sm:p-3 border border-slate-200/90 dark:border-[#2C2C32] shadow-xl flex items-center gap-2.5 animate-bounce [animation-duration:5s]">
                                        <CoinsBadge className="w-8 h-8 rounded-xl" />
                                        <div>
                                            <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Kas &amp; Tabungan</p>
                                            <p className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white tabular-nums">Rp 194.884.883</p>
                                        </div>
                                    </div>

                                    {/* Floating Pill 2: Arus Kas Positif (Bottom Right) */}
                                    <div className="absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-8 bg-white/95 dark:bg-[#1C1C20]/95 backdrop-blur-md rounded-2xl p-2.5 sm:p-3 border border-slate-200/90 dark:border-[#2C2C32] shadow-xl flex items-center gap-2.5 animate-bounce [animation-duration:6s]">
                                        <MoneyBadge className="w-8 h-8 rounded-xl" />
                                        <div>
                                            <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Surplus Kas</p>
                                            <p className="text-xs sm:text-sm font-extrabold text-emerald-600 dark:text-emerald-400 tabular-nums">+Rp 16.631.299</p>
                                        </div>
                                    </div>

                                    {/* Floating Pill 3: Budget Healthy (Top Right) */}
                                    <div className="hidden sm:flex absolute top-6 -right-6 bg-white/95 dark:bg-[#1C1C20]/95 backdrop-blur-md rounded-xl px-3 py-1.5 border border-slate-200/90 dark:border-[#2C2C32] shadow-md items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 animate-pulse [animation-duration:3s]">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                        <span>Target Sehat 86%</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </main>
            </div>

            {/* ======================================================== */}
            {/* 2. OVERLAPPING DASHBOARD PREVIEW ON DEEP CANVAS          */}
            {/* ======================================================== */}
            <div id="preview" className="relative z-30 -mt-12 sm:-mt-20 lg:-mt-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Mockup Window Container */}
                <div className="rounded-3xl sm:rounded-[36px] bg-slate-900/90 dark:bg-[#161619]/95 p-2 sm:p-3 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)] border border-slate-700/60 dark:border-[#2C2C32] backdrop-blur-xl">
                    <div className="rounded-2xl sm:rounded-[28px] bg-[#F1F5F9] dark:bg-[#121214] border border-slate-200 dark:border-[#2C2C32] overflow-hidden">

                        {/* Mockup Window Toolbar */}
                        <div className="bg-white dark:bg-[#161619] px-4 py-3 border-b border-slate-200 dark:border-[#2C2C32] flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                                <span className="text-[11px] text-slate-400 font-mono ml-2 hidden sm:inline">
                                    https://uangku.id/dashboard
                                </span>
                            </div>

                            <div className="flex items-center gap-2 text-xs font-semibold">
                                <span className="px-2.5 py-0.5 rounded-full bg-[#00105B]/10 dark:bg-[#242429] text-[#00105B] dark:text-zinc-200 border border-[#00105B]/20 dark:border-[#32323A]">
                                    Live App Preview
                                </span>
                            </div>
                        </div>

                        {/* Mockup Internal Screen */}
                        <div className="p-4 sm:p-6 lg:p-7 space-y-5 select-none">
                            {/* Mockup Header */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-[10px] font-bold uppercase tracking-wider text-[#00105B] dark:text-zinc-300">
                                        • Senin, 9 November 2026
                                    </div>
                                    <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                                        Selamat Datang, Haidar!
                                    </h3>
                                </div>
                                <div className="px-3 py-1.5 rounded-xl bg-[#00105B] dark:bg-zinc-100 text-white dark:text-zinc-950 font-bold text-xs shadow-sm flex items-center gap-1.5">
                                    <span>+ Catat Transaksi</span>
                                </div>
                            </div>

                            {/* Mockup 3 Metrics */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                                <div className="glass-card rounded-2xl p-4 border border-slate-200 dark:border-[#2C2C32] flex items-center justify-between">
                                    <div>
                                        <span className="font-bold text-[10px] uppercase tracking-wider text-slate-500 mb-1 block">Total Seluruh Uang</span>
                                        <p className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums">
                                            Rp 206.806.403
                                        </p>
                                        <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#00105B]/10 text-[#00105B] dark:bg-emerald-500/15 dark:text-emerald-300">
                                            Kas Sehat • 5 Dompet
                                        </div>
                                    </div>
                                    <PocketBadge className="w-10 h-10" />
                                </div>

                                <div className="glass-card rounded-2xl p-4 border border-slate-200 dark:border-[#2C2C32] flex items-center justify-between">
                                    <div>
                                        <span className="font-bold text-[10px] uppercase tracking-wider text-slate-500 mb-1 block">Total Pemasukan</span>
                                        <p className="text-xl sm:text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 tabular-nums">
                                            Rp 207.549.194
                                        </p>
                                        <p className="text-[10px] text-slate-400 mt-2">Bulan Ini: +Rp 20.021.279</p>
                                    </div>
                                    <MoneyBadge className="w-10 h-10" />
                                </div>

                                <div className="glass-card rounded-2xl p-4 border border-slate-200 dark:border-[#2C2C32] flex items-center justify-between">
                                    <div>
                                        <span className="font-bold text-[10px] uppercase tracking-wider text-slate-500 mb-1 block">Total Pengeluaran</span>
                                        <p className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums">
                                            Rp 29.842.791
                                        </p>
                                        <p className="text-[10px] text-slate-400 mt-2">Bulan Ini: -Rp 3.389.980</p>
                                    </div>
                                    <ExpenseBadge className="w-10 h-10" />
                                </div>
                            </div>

                            {/* Mockup Progress Bar */}
                            <div className="glass-card rounded-xl p-3 border border-slate-200 dark:border-[#2C2C32]">
                                <div className="flex items-center justify-between text-xs mb-1.5 font-semibold">
                                    <span className="text-slate-600 dark:text-slate-300 text-[11px]">Proporsi Arus Kas Keseluruhan</span>
                                    <div className="flex items-center gap-3 text-[11px]">
                                        <span className="text-emerald-600 dark:text-emerald-400">Tersimpan: 86%</span>
                                        <span className="text-rose-600 dark:text-rose-400">Terpakai: 14%</span>
                                    </div>
                                </div>
                                <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-[#1C1C20] overflow-hidden flex gap-0.5">
                                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '86%' }} />
                                    <div className="h-full bg-rose-500 rounded-full" style={{ width: '14%' }} />
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* ======================================================== */}
            {/* 3. FITUR UTAMA SECTION (DEEP ROYAL NAVY #00105B / CHARCOAL) */}
            {/* ======================================================== */}
            <section id="fitur" className="relative z-20 py-24 sm:py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00105B] dark:bg-[#1C1C20] border border-[#1E338D] dark:border-[#2C2C32] text-slate-100 dark:text-zinc-200 text-xs font-semibold mb-3">
                        <Zap className="w-3.5 h-3.5 text-amber-400" />
                        <span>Dirancang untuk Kebutuhan Riil</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                        Fitur Inti yang Benar-Benar Kamu Butuhkan
                    </h2>
                    <p className="mt-3 text-slate-300 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
                        Tidak ada diagram rumit atau fitur berlebihan. Hanya kendali arus kas yang intuitif, cepat, dan presisi.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Feature 1: Multi-Dompet */}
                    <div className="p-6 rounded-3xl bg-[#00105B] dark:bg-[#1C1C20] border border-[#1E338D]/70 dark:border-[#2C2C32] hover:border-amber-500/40 dark:hover:border-amber-500/40 shadow-xl transition-all duration-300 hover:-translate-y-1 group">
                        <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                            <Wallet className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">
                            Multi-Dompet &amp; Rekening
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-300 dark:text-slate-400 leading-relaxed">
                            Hubungkan rekening BCA, Mandiri, kas fisik dompet tunai, hingga e-wallet GoPay &amp; OVO secara terpisah dengan kartu digital visual modern.
                        </p>
                    </div>

                    {/* Feature 2: Grafik & Analisis */}
                    <div className="p-6 rounded-3xl bg-[#00105B] dark:bg-[#1C1C20] border border-[#1E338D]/70 dark:border-[#2C2C32] hover:border-white/40 dark:hover:border-zinc-500/50 shadow-xl transition-all duration-300 hover:-translate-y-1 group">
                        <div className="w-12 h-12 rounded-2xl bg-white/10 dark:bg-white/[0.06] border border-white/20 dark:border-[#3E3E46] text-slate-100 dark:text-zinc-200 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                            <BarChart3 className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">
                            Laporan &amp; Grafik Tren
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-300 dark:text-slate-400 leading-relaxed">
                            Evaluasi pergerakan kas masuk dan keluar dalam rentang 1 minggu, 1 bulan, 6 bulan, hingga 1 tahun dengan diagram batang dan kurva area interaktif.
                        </p>
                    </div>

                    {/* Feature 3: Pencatatan Cepat */}
                    <div className="p-6 rounded-3xl bg-[#00105B] dark:bg-[#1C1C20] border border-[#1E338D]/70 dark:border-[#2C2C32] hover:border-white/40 dark:hover:border-zinc-500/50 shadow-xl transition-all duration-300 hover:-translate-y-1 group">
                        <div className="w-12 h-12 rounded-2xl bg-white/10 dark:bg-white/[0.06] border border-white/20 dark:border-[#3E3E46] text-slate-100 dark:text-zinc-200 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                            <Zap className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">
                            Pencatatan Kilat
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-300 dark:text-slate-400 leading-relaxed">
                            Aplikasi SPA bertenaga Inertia React tanpa jeda reload halaman. Catat pengeluaran kopi atau belanja harian dalam hitungan 5 detik.
                        </p>
                    </div>

                    {/* Feature 4: Keamanan Mandiri */}
                    <div className="p-6 rounded-3xl bg-[#00105B] dark:bg-[#1C1C20] border border-[#1E338D]/70 dark:border-[#2C2C32] hover:border-emerald-400/50 dark:hover:border-emerald-500/40 shadow-xl transition-all duration-300 hover:-translate-y-1 group">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">
                            Privasi &amp; Isolasi Data
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-300 dark:text-slate-400 leading-relaxed">
                            Data transaksimu terisolasi secara multi-tenant. Tanpa monetisasi data pengguna, tanpa pelacak pihak ketiga, dan sepenuhnya aman.
                        </p>
                    </div>
                </div>
            </section>

            {/* ======================================================== */}
            {/* 4. CARA KERJA 3 LANGKAH SECTION                         */}
            {/* ======================================================== */}
            <section id="cara-kerja" className="relative z-20 py-20 bg-[#000833] dark:bg-[#161619] border-y border-[#1E338D]/60 dark:border-[#2C2C32]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                            Cara Mudah Mengatur Keuanganmu
                        </h2>
                        <p className="mt-3 text-slate-300 dark:text-slate-400 text-sm sm:text-base">
                            Tiga langkah praktis menuju pengelolaan arus kas yang rapi dan terukur.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                        {/* Step 1 */}
                        <div className="relative p-7 rounded-3xl bg-[#00105B] dark:bg-[#1C1C20] border border-[#1E338D]/70 dark:border-[#2C2C32] text-center space-y-4">
                            <div className="w-12 h-12 mx-auto rounded-2xl bg-white dark:bg-zinc-100 text-[#00105B] dark:text-zinc-950 font-extrabold text-lg flex items-center justify-center shadow-lg dark:shadow-none">
                                1
                            </div>
                            <h3 className="text-lg font-bold text-white">
                                Tambahkan Dompet
                            </h3>
                            <p className="text-xs sm:text-sm text-slate-300 dark:text-slate-400 leading-relaxed">
                                Daftarkan pos saldo Anda: rekening perbankan, dompet fisik tunai, e-wallet, atau portofolio investasi.
                            </p>
                        </div>

                        {/* Step 2 */}
                        <div className="relative p-7 rounded-3xl bg-[#00105B] dark:bg-[#1C1C20] border border-[#1E338D]/70 dark:border-[#2C2C32] text-center space-y-4">
                            <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-500 text-white font-extrabold text-lg flex items-center justify-center shadow-lg shadow-amber-500/30">
                                2
                            </div>
                            <h3 className="text-lg font-bold text-white">
                                Catat Setiap Arus Kas
                            </h3>
                            <p className="text-xs sm:text-sm text-slate-300 dark:text-slate-400 leading-relaxed">
                                Setiap ada pemasukan gaji atau pengeluaran belanja, catat secara teratur dengan kategori yang relevan.
                            </p>
                        </div>

                        {/* Step 3 */}
                        <div className="relative p-7 rounded-3xl bg-[#00105B] dark:bg-[#1C1C20] border border-[#1E338D]/70 dark:border-[#2C2C32] text-center space-y-4">
                            <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-600 text-white font-extrabold text-lg flex items-center justify-center shadow-lg shadow-emerald-600/30">
                                3
                            </div>
                            <h3 className="text-lg font-bold text-white">
                                Pantau &amp; Capai Target
                            </h3>
                            <p className="text-xs sm:text-sm text-slate-300 dark:text-slate-400 leading-relaxed">
                                Buka grafik laporan untuk melihat proporsi tabungan yang tersimpan dan nikmati ketenangan finansial.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ======================================================== */}
            {/* 5. BOTTOM CALL TO ACTION BANNER                          */}
            {/* ======================================================== */}
            <section className="relative z-20 py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="rounded-3xl sm:rounded-[36px] bg-gradient-to-br from-[#001875] via-[#00105B] to-[#000833] dark:bg-none dark:bg-[#1C1C20] p-8 sm:p-14 border border-[#1E338D] dark:border-[#2C2C32] shadow-2xl relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-8">
                    {/* Ambient glow */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 dark:bg-white/[0.04] rounded-full blur-3xl pointer-events-none" />

                    <div className="relative z-10 max-w-xl text-center sm:text-left space-y-3">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 dark:bg-[#242429] text-slate-100 dark:text-zinc-200 border border-white/20 dark:border-[#32323A] text-xs font-semibold">
                            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                            <span>Mulai Gratis Hari Ini</span>
                        </div>
                        <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                            Siap Mengatur Keuanganmu Lebih Baik?
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-200 dark:text-slate-300 leading-relaxed">
                            Bergabunglah sekarang dan rasakan kemudahan mencatat arus kas pribadi tanpa ribet.
                        </p>
                    </div>

                    <div className="relative z-10 shrink-0">
                        <Link
                            href={auth?.user ? route('dashboard') : route('register')}
                            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-white hover:bg-slate-100 dark:bg-zinc-100 dark:hover:bg-white active:scale-95 text-[#00105B] dark:text-zinc-950 font-bold text-sm sm:text-base shadow-xl transition-all duration-200"
                        >
                            <span>{auth?.user ? 'Buka Dashboard' : 'Daftar Akun Gratis'}</span>
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* ======================================================== */}
            {/* 6. FOOTER                                                */}
            {/* ======================================================== */}
            <footer className="relative z-20 border-t border-[#1E338D]/60 dark:border-[#2C2C32] py-10 text-xs text-slate-400 dark:text-slate-500">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Link href="/" className="focus:outline-none">
                            <ApplicationLogo className="h-8 w-auto" />
                        </Link>
                        <span className="text-slate-500 dark:text-slate-600">&bull;</span>
                        <span>Kelola Keuangan Pribadi Lebih Mudah</span>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-right">
                        <p>&copy; {new Date().getFullYear()} Uangku. Seluruh hak cipta dilindungi.</p>
                        <span className="hidden sm:inline text-slate-500 dark:text-slate-600">&bull;</span>
                        <p className="flex items-center gap-1.5">
                            <span>Dibuat oleh</span>
                            <a
                                href="https://my-portfolio-alpha-roan-39.vercel.app"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-bold text-slate-100 hover:text-white dark:text-zinc-200 dark:hover:text-white hover:underline transition inline-flex items-center gap-1"
                            >
                                <span>Nur Muhammad Haidar</span>
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                            </a>
                        </p>
                    </div>
                </div>
            </footer>

        </div>
    );
}

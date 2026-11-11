import ApplicationLogo from '@/Components/ApplicationLogo';
import ThemeToggle from '@/Components/ThemeToggle';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
    ArrowLeft,
    ArrowRight,
    BarChart3,
    Check,
    Menu,
    ShieldCheck,
    Sparkles,
    Wallet,
    X,
    Zap,
} from '@/Components/Icons/PhosphorDuotone';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    Compass,
    HeartHandshake,
    Info,
    MessageSquarePlus,
} from 'lucide-react';
import { useState } from 'react';

const MISSIONS = [
    {
        number: '01',
        title: 'Catat Kilat Tanpa Rumit',
        description:
            'Membantu pengguna mencatat setiap transaksi harian hanya dalam hitungan detik tanpa langkah yang rumit.',
        iconType: 'lucide-zap',
        accent: 'bg-amber-500/12 text-amber-600 dark:text-amber-400 border-amber-500/25',
    },
    {
        number: '02',
        title: 'Pendampingan Bersama Tupi',
        description:
            'Menghadirkan pendampingan cerdas bersama Tupi agar pengguna lebih mudah memahami kondisi keuangannya.',
        iconType: 'tupi',
        accent: 'bg-[#00105B]/10 dark:bg-[#242429] text-[#00105B] dark:text-zinc-200 border-[#00105B]/20 dark:border-[#3E3E46]',
    },
    {
        number: '03',
        title: 'Kesadaran Finansial yang Jelas',
        description:
            'Mendorong kesadaran finansial lewat ringkasan saldo, kategori, dan rasio tabungan yang jelas.',
        iconType: 'chart',
        accent: 'bg-emerald-500/12 text-emerald-600 dark:text-emerald-400 border-emerald-500/25',
    },
    {
        number: '04',
        title: 'Bertumbuh dari Kebutuhan Nyata',
        description:
            'Terus bertumbuh bersama pengguna melalui pengembangan fitur yang mendengarkan saran dan kebutuhan nyata.',
        iconType: 'feedback',
        accent: 'bg-[#00105B]/10 dark:bg-[#242429] text-[#00105B] dark:text-zinc-200 border-[#00105B]/20 dark:border-[#3E3E46]',
    },
];

const CORE_VALUES = [
    {
        title: '100% Gratis & Tanpa Iklan',
        description:
            'Fokus mencatat dan memantau arus kas tanpa pop-up, banner promosi, maupun gangguan berbayar.',
        icon: Sparkles,
    },
    {
        title: 'Privasi Multi-Tenant Terisolasi',
        description:
            'Setiap data transaksi, dompet, dan laporan terisolasi aman per akun tanpa pelacak pihak ketiga.',
        icon: ShieldCheck,
    },
    {
        title: 'Multi-Dompet & Ekspor Laporan',
        description:
            'Satukan kas tunai, rekening bank, hingga e-wallet dalam satu pantauan dengan ekspor CSV kapan saja.',
        icon: Wallet,
    },
];

function MissionIcon({ type }) {
    if (type === 'tupi') {
        return (
            <img
                src="/assets/tupi/tupi-wave.png"
                alt="Tupi"
                className="w-8 h-8 object-contain"
            />
        );
    }
    if (type === 'chart') {
        return <BarChart3 className="w-6 h-6" />;
    }
    if (type === 'feedback') {
        return <MessageSquarePlus className="w-6 h-6" />;
    }
    return <Zap className="w-6 h-6" />;
}

function AboutContent({ isAuthenticated }) {
    return (
        <div className="space-y-6 sm:space-y-8">
            {/* Hero / Cerita Singkat Uangku */}
            <section className="glass-card rounded-3xl p-6 sm:p-10 relative overflow-hidden">
                <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-gradient-to-br from-amber-500/10 via-[#00105B]/10 to-transparent dark:from-amber-500/8 dark:via-white/[0.03] blur-3xl pointer-events-none" />

                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                    <div className="lg:col-span-8 space-y-4 text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#00105B]/10 text-[#00105B] dark:bg-[#242429] dark:text-zinc-200 border border-[#00105B]/20 dark:border-[#32323A] text-xs font-semibold">
                            <HeartHandshake className="w-3.5 h-3.5 text-amber-500" />
                            <span>Mengenal Lebih Dekat Uangku</span>
                        </div>

                        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
                            Kelola Keuanganmu Lebih{' '}
                            <span className="text-[#00105B] dark:text-zinc-200">
                                Sehat, Rapi, &amp; Menyenangkan
                            </span>
                        </h1>

                        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                            <strong>Uangku</strong> adalah aplikasi manajemen keuangan pribadi modern yang lahir untuk membuat pencatatan arus kas sehari-hari terasa ringan, jujur, dan bersahabat—ditemani maskot{' '}
                            <strong>Si Uangku (Tupi)</strong> agar membangun kebiasaan finansial positif bukan lagi beban.
                        </p>

                        <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3">
                            <Link
                                href={isAuthenticated ? route('dashboard') : route('register')}
                                prefetch
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00105B] hover:bg-[#000B42] dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-950 text-xs sm:text-sm font-bold shadow-sm transition active:scale-95"
                            >
                                <span>{isAuthenticated ? 'Kembali ke Dashboard' : 'Mulai Gratis Sekarang'}</span>
                                <ArrowRight className="w-4 h-4" />
                            </Link>

                            {!isAuthenticated && (
                                <Link
                                    href={route('home')}
                                    prefetch
                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#242429] dark:hover:bg-[#2E2E35] text-slate-700 dark:text-zinc-200 border border-slate-200 dark:border-[#32323A] text-xs sm:text-sm font-bold transition active:scale-95"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    <span>Kembali ke Beranda</span>
                                </Link>
                            )}
                        </div>
                    </div>

                    <div className="lg:col-span-4 flex justify-center">
                        <div className="relative p-4 rounded-3xl bg-slate-50/80 dark:bg-[#161619] border border-slate-200/80 dark:border-[#2C2C32] shadow-sm">
                            <img
                                src="/assets/mascot.png"
                                alt="Maskot Si Uangku"
                                className="w-44 sm:w-52 h-auto object-contain mx-auto drop-shadow-[0_14px_24px_rgba(245,158,11,0.2)]"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Visi Kami (Opsi 2) */}
            <section className="rounded-3xl bg-gradient-to-br from-[#001875] via-[#00105B] to-[#000833] dark:bg-none dark:bg-[#1C1C20] border border-[#1E338D] dark:border-[#2C2C32] p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
                <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full bg-white/10 dark:bg-white/[0.03] blur-3xl pointer-events-none" />

                <div className="relative z-10 max-w-3xl space-y-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 dark:bg-[#242429] border border-white/20 dark:border-[#3E3E46] text-xs font-bold uppercase tracking-wider text-amber-300">
                        <Compass className="w-3.5 h-3.5" />
                        <span>Visi Kami</span>
                    </div>

                    <blockquote className="text-xl sm:text-2xl lg:text-3xl font-extrabold leading-snug tracking-tight text-white">
                        &ldquo;Menjadi teman setia dalam membangun kebiasaan finansial yang sehat, rapi, dan menyenangkan untuk semua kalangan.&rdquo;
                    </blockquote>

                    <p className="text-xs sm:text-sm text-slate-200 dark:text-zinc-400 leading-relaxed pt-1">
                        Kami percaya literasi dan ketenangan finansial berawal dari langkah kecil yang konsisten setiap hari.
                    </p>
                </div>
            </section>

            {/* Misi Uangku (4 Pilar - Opsi 2) */}
            <section className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 px-1">
                    <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#00105B] dark:text-zinc-400">
                            Arah &amp; Komitmen
                        </span>
                        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                            Misi Uangku
                        </h2>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400">
                        Empat komitmen utama kami menemani perjalanan finansialmu sehari-hari.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                    {MISSIONS.map((mission) => (
                        <div
                            key={mission.number}
                            className="glass-card rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-[#2C2C32] hover:border-[#00105B]/30 dark:hover:border-[#3E3E46] transition duration-200 flex gap-4 items-start group"
                        >
                            <div
                                className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 group-hover:scale-105 transition ${mission.accent}`}
                            >
                                <MissionIcon type={mission.iconType} />
                            </div>

                            <div className="space-y-1.5 min-w-0">
                                <div className="flex items-center gap-2">
                                    <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-[#242429] text-slate-500 dark:text-zinc-400 border border-slate-200/80 dark:border-[#32323A]">
                                        Misi {mission.number}
                                    </span>
                                </div>
                                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                    {mission.title}
                                </h3>
                                <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
                                    {mission.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Prinsip Produk & Informasi Pengembang */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
                <div className="lg:col-span-8 glass-card rounded-2xl p-6 space-y-4">
                    <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                        Nilai yang Kami Pegang
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                        {CORE_VALUES.map((item) => {
                            const Icon = item.icon;
                            return (
                                <div
                                    key={item.title}
                                    className="p-4 rounded-2xl bg-slate-50 dark:bg-[#161619] border border-slate-200/80 dark:border-[#2C2C32] space-y-2"
                                >
                                    <div className="w-9 h-9 rounded-xl bg-[#00105B]/10 dark:bg-[#242429] text-[#00105B] dark:text-zinc-200 flex items-center justify-center border border-[#00105B]/15 dark:border-[#32323A]">
                                        <Icon className="w-4 h-4" />
                                    </div>
                                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                        {item.title}
                                    </h3>
                                    <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
                                        {item.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="lg:col-span-4 glass-card rounded-2xl p-6 flex flex-col justify-between gap-4">
                    <div className="space-y-2.5">
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#00105B] dark:text-zinc-400">
                            <Check className="w-3.5 h-3.5 text-emerald-500 stroke-[3]" />
                            Dikembangkan Mandiri
                        </span>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">
                            Dibangun untuk Kebutuhan Pengguna Indonesia
                        </h3>
                        <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                            Uangku dirancang dan terus dikembangkan oleh{' '}
                            <strong className="text-slate-800 dark:text-zinc-200">
                                Nur Muhammad Haidar
                            </strong>{' '}
                            sebagai aplikasi kas pribadi yang ringan, transparan, dan adaptif terhadap masukan pengguna.
                        </p>
                    </div>

                    <div className="pt-3 border-t border-slate-200/80 dark:border-[#2C2C32] flex items-center justify-between text-xs">
                        <span className="text-slate-400 dark:text-zinc-500 font-mono">
                            Uangku v1.0
                        </span>
                        <a
                            href="https://my-portfolio-alpha-roan-39.vercel.app"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-bold text-[#00105B] dark:text-zinc-200 hover:underline inline-flex items-center gap-1"
                        >
                            <span>Portofolio Pengembang</span>
                            <span>&nearr;</span>
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}

function PublicAboutShell({ children }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[#F1F5F9] dark:bg-[#121214] text-slate-800 dark:text-zinc-100 transition-colors duration-200 relative flex flex-col">
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 ambient-bg-glow" />

            {/* Sticky Public Navbar with Notch/Dynamic Island safe-area support */}
            <header className="sticky top-0 z-40 pt-safe px-safe bg-white/95 dark:bg-[#161619]/95 backdrop-blur-xl border-b border-slate-200 dark:border-[#2C2C32] shadow-xs">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
                    <div className="flex items-center justify-between">
                        <Link href={route('home')} prefetch className="focus:outline-none transition-transform hover:scale-[1.02]">
                            <ApplicationLogo className="h-10 sm:h-11 w-auto" />
                        </Link>

                        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600 dark:text-slate-300">
                            <Link href={route('home')} prefetch className="hover:text-[#00105B] dark:hover:text-white transition-colors">
                                Beranda
                            </Link>
                            <span className="text-[#00105B] dark:text-white font-bold">
                                Tentang
                            </span>
                        </nav>

                        <div className="hidden md:flex items-center gap-3">
                            <ThemeToggle />
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

                        <div className="flex md:hidden items-center gap-2">
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

                    {mobileMenuOpen && (
                        <div className="md:hidden mt-3 p-4 rounded-2xl glass-card border border-slate-200 dark:border-[#2C2C32] shadow-xl space-y-3">
                            <nav className="flex flex-col gap-1.5 text-sm font-semibold text-slate-700 dark:text-slate-200">
                                <Link
                                    href={route('home')}
                                    prefetch
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-[#242429] transition"
                                >
                                    Beranda
                                </Link>
                                <span className="p-2.5 rounded-xl bg-[#00105B]/10 dark:bg-[#242429] text-[#00105B] dark:text-white font-bold">
                                    Tentang Uangku
                                </span>
                            </nav>
                            <div className="pt-2 border-t border-slate-200/80 dark:border-[#2C2C32] flex flex-col gap-2">
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
                            </div>
                        </div>
                    )}
                </div>
            </header>

            <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 py-6 sm:px-6 lg:px-8 sm:py-10">
                {children}
            </main>

            <footer className="relative z-10 border-t border-slate-200/80 dark:border-[#2C2C32] bg-white/60 dark:bg-[#161619]/80 py-6 text-xs text-slate-500 dark:text-zinc-400">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
                    <p>&copy; {new Date().getFullYear()} Uangku &bull; Kelola Keuanganmu Lebih Mudah</p>
                    <div className="flex items-center gap-3">
                        <Link href={route('home')} prefetch className="hover:text-[#00105B] dark:hover:text-white font-semibold transition">
                            Beranda
                        </Link>
                        <span>&bull;</span>
                        <a
                            href="https://my-portfolio-alpha-roan-39.vercel.app"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-bold text-[#00105B] dark:text-zinc-200 hover:underline inline-flex items-center gap-1"
                        >
                            <span>Nur Muhammad Haidar</span>
                            <span>&nearr;</span>
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default function About() {
    const { auth } = usePage().props;
    const isAuthenticated = Boolean(auth?.user);

    if (isAuthenticated) {
        return (
            <AuthenticatedLayout
                header={
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-[#00105B]/10 dark:bg-[#242429] border border-[#00105B]/20 dark:border-[#32323A] flex items-center justify-center text-[#00105B] dark:text-zinc-200">
                            <Info className="w-4 h-4" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                                Tentang Uangku
                            </h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Visi, misi, dan cerita di balik pengembangan Uangku.
                            </p>
                        </div>
                    </div>
                }
            >
                <Head title="Tentang Uangku" />
                <AboutContent isAuthenticated />
            </AuthenticatedLayout>
        );
    }

    return (
        <PublicAboutShell>
            <Head title="Tentang Uangku — Visi & Misi" />
            <AboutContent isAuthenticated={false} />
        </PublicAboutShell>
    );
}

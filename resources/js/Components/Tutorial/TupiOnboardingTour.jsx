import { router, usePage } from '@inertiajs/react';
import { useEffect, useState, useCallback } from 'react';
import { X, Sparkles, ArrowLeft, ArrowRight, Check } from '@/Components/Icons/PhosphorDuotone';

const STORAGE_KEY = 'uangku_tupi_tour_v1';

const TUPI_IMAGES = [
    '/assets/tupi/tupi-wave.png',
    '/assets/tupi/tupi-point.png',
    '/assets/tupi/tupi-magnify.png',
    '/assets/tupi/tupi-wallet.png',
    '/assets/tupi/tupi-chart.png',
    '/assets/tupi/tupi-celebrate.png',
    '/assets/mascot.png',
];

const TOUR_STEPS = [
    {
        id: 'welcome',
        routeName: 'dashboard',
        targetSelector: null,
        pose: '/assets/tupi/tupi-wave.png',
        animClass: 'animate-tupi-float',
        badge: 'Kenalan dengan Tupi',
        title: (firstName) => `Hai ${firstName}! Aku Tupi 🐿️`,
        description:
            'Selamat datang di Uangku! Aku asisten keuangan pribadimu. Yuk ikut Tupi berkeliling ke seluruh halaman aplikasi agar kamu langsung paham semua fiturnya!',
    },
    {
        id: 'dashboard-summary',
        routeName: 'dashboard',
        targetSelector: '[data-tour="dashboard-summary"]',
        pose: '/assets/tupi/tupi-point.png',
        animClass: 'animate-tupi-float',
        badge: '1 dari 6 • Dashboard',
        title: () => 'Pantau Saldo Real-Time',
        description:
            'Di bagian Ringkasan ini kamu bisa melihat Total Seluruh Uang dari semua dompetmu, plus total Pemasukan dan Pengeluaran bulan ini secara langsung.',
    },
    {
        id: 'dashboard-add-tx',
        routeName: 'dashboard',
        targetSelector: '[data-tour="dashboard-add-tx"]',
        pose: '/assets/mascot.png',
        animClass: 'animate-tupi-float',
        badge: '2 dari 6 • Catat Transaksi',
        title: () => 'Catat Transaksi & Kategori Sendiri',
        description:
            'Setiap habis jajan, bayar tagihan, atau terima gaji, klik tombol ini ya! Di dalamnya kamu juga bebas menambah atau menghapus kategori sesuai kebutuhanmu.',
    },
    {
        id: 'transactions-filter',
        routeName: 'transactions.index',
        targetSelector: '[data-tour="transactions-filter"]',
        pose: '/assets/tupi/tupi-magnify.png',
        animClass: 'animate-tupi-float',
        badge: '3 dari 6 • Riwayat Transaksi',
        title: () => 'Cari & Filter Mutasi Secepat Kilat',
        description:
            'Sekarang kita di halaman Riwayat! Gunakan pencarian & filter periode, dompet, atau kategori di sini untuk melacak mutasi lama secara instan (0ms) atau ekspor ke CSV.',
    },
    {
        id: 'wallets-grid',
        routeName: 'wallets.index',
        targetSelector: '[data-tour="wallets-grid"]',
        pose: '/assets/tupi/tupi-wallet.png',
        animClass: 'animate-tupi-float',
        badge: '4 dari 6 • Dompet & Rekening',
        title: () => 'Pisahkan Cash, Bank & E-Wallet',
        description:
            'Di halaman Dompet & Rekening, uang tunai, rekening bank, hingga E-Wallet (GoPay/OVO) terpisah rapi. Klik kartu mana saja untuk cek mutasi spesifiknya!',
    },
    {
        id: 'wallets-add',
        routeName: 'wallets.index',
        targetSelector: '[data-tour="wallets-add"]',
        pose: '/assets/tupi/tupi-point.png',
        animClass: 'animate-tupi-float',
        badge: '5 dari 6 • Tambah Dompet',
        title: () => 'Kelola Banyak Sumber Dana',
        description:
            'Punya rekening tabungan atau akun investasi baru? Klik tombol Tambah Dompet Baru di sini kapan saja untuk menambahkannya ke portofoliomu.',
    },
    {
        id: 'reports-chart',
        routeName: 'reports.index',
        targetSelector: '[data-tour="reports-chart"]',
        pose: '/assets/tupi/tupi-chart.png',
        animClass: 'animate-tupi-float',
        badge: '6 dari 6 • Laporan & Grafik',
        title: () => 'Analisis Tren & Rasio Tabungan',
        description:
            'Terakhir, di halaman Laporan & Grafik ini Tupi merangkum perbandingan pemasukan vs pengeluaranmu serta kategori paling boros dalam grafik visual yang jelas!',
    },
    {
        id: 'finale',
        routeName: 'reports.index',
        targetSelector: null,
        pose: '/assets/tupi/tupi-celebrate.png',
        animClass: 'animate-tupi-hop',
        badge: 'Tur Selesai! 🎉',
        title: (firstName) => `Yeay, ${firstName}! Kamu Sudah Siap!`,
        description:
            'Seluruh halaman — mulai dari Dashboard, Riwayat, Dompet, hingga Laporan — sudah kamu kenali. Yuk mulai langkah pertamamu dengan mencatat transaksi pertama!',
    },
];

function readTourState() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

function saveTourState(state) {
    try {
        if (!state) {
            localStorage.removeItem(STORAGE_KEY);
        } else {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        }
    } catch {
        // Ignore storage errors
    }
}

export function launchTupiTour() {
    saveTourState({ active: true, stepIndex: 0 });
    if (typeof route === 'function' && !route().current('dashboard')) {
        router.visit(route('dashboard'));
    } else {
        window.dispatchEvent(new CustomEvent('uangku:start-tupi-tour'));
    }
}

export default function TupiOnboardingTour() {
    const page = usePage();
    const { auth } = page.props;
    const currentUrl = page.url;
    const user = auth?.user;
    const firstName = user?.name ? user.name.split(' ')[0] : 'Teman';

    const [isActive, setIsActive] = useState(false);
    const [stepIndex, setStepIndex] = useState(0);
    const [targetRect, setTargetRect] = useState(null);
    const [viewport, setViewport] = useState({
        w: typeof window !== 'undefined' ? window.innerWidth : 1024,
        h: typeof window !== 'undefined' ? window.innerHeight : 768,
    });

    const currentStep = TOUR_STEPS[stepIndex] || TOUR_STEPS[0];

    // Preload all Tupi pose PNGs on mount so pose changes are instant
    useEffect(() => {
        TUPI_IMAGES.forEach((src) => {
            const img = new Image();
            img.src = src;
        });
    }, []);

    // Listen to manual tour launch event
    useEffect(() => {
        const handleManualStart = () => {
            saveTourState({ active: true, stepIndex: 0 });
            setStepIndex(0);
            setIsActive(true);
        };
        window.addEventListener('uangku:start-tupi-tour', handleManualStart);
        return () => window.removeEventListener('uangku:start-tupi-tour', handleManualStart);
    }, []);

    // Initialize tour on page mount or Inertia navigation
    useEffect(() => {
        if (!user) return;

        const saved = readTourState();
        if (saved && saved.active) {
            const safeIdx = Math.max(0, Math.min(saved.stepIndex || 0, TOUR_STEPS.length - 1));
            const targetRoute = TOUR_STEPS[safeIdx].routeName;

            if (typeof route === 'function' && !route().current(targetRoute)) {
                // Continue tour when the page finishes visiting targetRoute
                return;
            }

            setStepIndex(safeIdx);
            setIsActive(true);
            return;
        }

        // Auto-launch once if user hasn't completed tutorial yet
        if (user.has_completed_tutorial === false && typeof route === 'function' && route().current('dashboard')) {
            const timer = setTimeout(() => {
                saveTourState({ active: true, stepIndex: 0 });
                setStepIndex(0);
                setIsActive(true);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [user, currentUrl]);

    // Measure & track target element position
    const measureTarget = useCallback(() => {
        if (!isActive) return;

        const vw = window.innerWidth;
        const vh = window.innerHeight;
        setViewport({ w: vw, h: vh });

        const selector = currentStep?.targetSelector;
        if (!selector) {
            setTargetRect(null);
            return;
        }

        const el = document.querySelector(selector);
        if (!el) {
            setTargetRect(null);
            return;
        }

        const rect = el.getBoundingClientRect();
        setTargetRect({
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
            bottom: rect.bottom,
            right: rect.right,
        });
    }, [isActive, currentStep]);

    // Scroll target into view and re-measure when step changes
    useEffect(() => {
        if (!isActive) return;

        const selector = currentStep?.targetSelector;
        if (selector) {
            const el = document.querySelector(selector);
            if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }

        // Measure quickly and again after smooth scroll finishes
        measureTarget();
        const t1 = setTimeout(measureTarget, 150);
        const t2 = setTimeout(measureTarget, 420);

        window.addEventListener('resize', measureTarget);
        window.addEventListener('scroll', measureTarget, true);

        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
            window.removeEventListener('resize', measureTarget);
            window.removeEventListener('scroll', measureTarget, true);
        };
    }, [isActive, stepIndex, currentStep, measureTarget]);

    const markTutorialCompleted = useCallback((redirectPath = null) => {
        saveTourState(null);
        setIsActive(false);
        setTargetRect(null);

        router.post(
            route('tutorial.complete'),
            redirectPath ? { redirect_to: redirectPath } : {},
            {
                preserveScroll: true,
                preserveState: !redirectPath,
            }
        );
    }, []);

    const goToStep = useCallback(
        (nextIndex) => {
            if (nextIndex < 0) return;
            if (nextIndex >= TOUR_STEPS.length) {
                markTutorialCompleted('/dashboard');
                return;
            }

            const targetStep = TOUR_STEPS[nextIndex];
            saveTourState({ active: true, stepIndex: nextIndex });

            if (typeof route === 'function' && !route().current(targetStep.routeName)) {
                setTargetRect(null);
                router.visit(route(targetStep.routeName));
            } else {
                setStepIndex(nextIndex);
            }
        },
        [markTutorialCompleted]
    );

    // Keyboard navigation (Escape / Right Arrow / Left Arrow)
    useEffect(() => {
        if (!isActive) return;
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                markTutorialCompleted();
            } else if (e.key === 'ArrowRight') {
                if (stepIndex < TOUR_STEPS.length - 1) {
                    goToStep(stepIndex + 1);
                }
            } else if (e.key === 'ArrowLeft') {
                if (stepIndex > 0) {
                    goToStep(stepIndex - 1);
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isActive, stepIndex, goToStep, markTutorialCompleted]);

    if (!isActive || !user) return null;

    const isCenterModal = !currentStep.targetSelector || !targetRect;
    const isFirstStep = stepIndex === 0;
    const isLastStep = stepIndex === TOUR_STEPS.length - 1;

    // Smart placement for Floating Card when highlighting an element
    const getFloatingPositionStyle = () => {
        if (!targetRect) return {};

        const isMobile = viewport.w < 640;
        const targetCenterY = targetRect.top + targetRect.height / 2;

        if (isMobile) {
            // Place card cleanly at bottom unless target is in bottom 45% of screen
            // Keep 48px top margin so Tupi's ears overlapping top edge stay visible
            const placeTop = targetCenterY > viewport.h * 0.55;
            return placeTop
                ? { top: '48px', left: '12px', right: '12px' }
                : { bottom: '16px', left: '12px', right: '12px' };
        }

        // Desktop: place below target if enough space, else above target
        const cardEstimatedHeight = 240;
        const cardWidth = Math.min(540, viewport.w - 32);
        const spaceBelow = viewport.h - targetRect.bottom;
        const placeBelow = spaceBelow >= cardEstimatedHeight + 36 || targetRect.top < cardEstimatedHeight + 48;

        let top = placeBelow
            ? Math.min(Math.max(48, targetRect.bottom + 22), viewport.h - cardEstimatedHeight - 16)
            : Math.max(48, targetRect.top - cardEstimatedHeight - 22);

        let left = targetRect.left + targetRect.width / 2 - cardWidth / 2;
        left = Math.max(16, Math.min(left, viewport.w - cardWidth - 16));

        return {
            top: `${Math.round(top)}px`,
            left: `${Math.round(left)}px`,
            width: `${Math.round(cardWidth)}px`,
        };
    };

    return (
        <div className="fixed inset-0 z-[75]" aria-modal="true" role="dialog">
            {/* Click-blocker overlay (backdrop when centered modal) */}
            {isCenterModal ? (
                <div
                    className="fixed inset-0 bg-[#070D19]/75 backdrop-blur-sm transition-opacity duration-300"
                    onClick={() => {}}
                />
            ) : (
                <>
                    {/* Transparent interaction shield */}
                    <div className="fixed inset-0 z-[75]" />
                    {/* Spotlight Cutout Frame with 9999px shadow dim */}
                    <div
                        className="fixed z-[76] pointer-events-none rounded-2xl transition-all duration-500 ease-out animate-tupi-ring border-2 border-emerald-400"
                        style={{
                            top: `${Math.max(4, targetRect.top - 8)}px`,
                            left: `${Math.max(4, targetRect.left - 8)}px`,
                            width: `${targetRect.width + 16}px`,
                            height: `${targetRect.height + 16}px`,
                            boxShadow: '0 0 0 9999px rgba(7, 13, 25, 0.76)',
                        }}
                    />
                </>
            )}

            {/* ============================================================== */}
            {/* MODE 1: GRAND OPENING / FINALE CENTER MODAL                    */}
            {/* ============================================================== */}
            {isCenterModal && (
                <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 overflow-y-auto">
                    <div
                        key={currentStep.id}
                        className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-[#0E1A33] border border-slate-200 dark:border-[#1E3158] shadow-2xl p-6 sm:p-8 text-center animate-tupi-spring overflow-visible mt-12 sm:mt-8"
                    >
                        {/* Ambient Emerald Glow Behind Tupi */}
                        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-56 h-56 bg-emerald-500/20 dark:bg-emerald-500/25 rounded-full blur-3xl pointer-events-none" />

                        {/* Close / Skip button */}
                        <button
                            type="button"
                            onClick={() => markTutorialCompleted()}
                            title="Tutup Tutorial"
                            className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        {/* Full-Body Tupi Mascot Character */}
                        <div className="relative -mt-20 sm:-mt-24 mb-3 flex justify-center pointer-events-none select-none">
                            <img
                                src={currentStep.pose}
                                alt="Tupi Maskot Uangku"
                                className={`h-40 sm:h-48 w-auto object-contain drop-shadow-[0_14px_24px_rgba(15,23,42,0.35)] ${currentStep.animClass}`}
                            />
                        </div>

                        {/* Badge */}
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/15 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold mb-3">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>{currentStep.badge}</span>
                        </div>

                        {/* Title & Description */}
                        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                            {currentStep.title(firstName)}
                        </h2>
                        <p className="mt-2.5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-md mx-auto">
                            {currentStep.description}
                        </p>

                        {/* Progress Dots */}
                        <div className="mt-5 flex items-center justify-center gap-1.5">
                            {TOUR_STEPS.map((st, idx) => (
                                <span
                                    key={st.id}
                                    className={`h-1.5 rounded-full transition-all duration-300 ${
                                        idx === stepIndex
                                            ? 'w-6 bg-emerald-500'
                                            : idx < stepIndex
                                                ? 'w-2 bg-emerald-400/60'
                                                : 'w-1.5 bg-slate-300 dark:bg-slate-700'
                                    }`}
                                />
                            ))}
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-2.5">
                            {isFirstStep ? (
                                <>
                                    <button
                                        type="button"
                                        onClick={() => goToStep(1)}
                                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 active:scale-[0.98] text-white text-sm font-bold shadow-lg shadow-emerald-600/25 transition"
                                    >
                                        <span>Mulai Tur Bersama Tupi</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => markTutorialCompleted()}
                                        className="w-full sm:w-auto px-5 py-3 rounded-2xl text-xs sm:text-sm font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/70 transition"
                                    >
                                        Lewati dulu
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        type="button"
                                        onClick={() => markTutorialCompleted('/dashboard?open_tx=1')}
                                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 active:scale-[0.98] text-white text-sm font-bold shadow-lg shadow-emerald-600/25 transition"
                                    >
                                        <Sparkles className="w-4 h-4" />
                                        <span>Catat Transaksi Pertama</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => markTutorialCompleted('/dashboard')}
                                        className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-3 rounded-2xl border border-slate-300 dark:border-white/10 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/70 transition"
                                    >
                                        <Check className="w-4 h-4 text-emerald-500" />
                                        <span>Selesai &amp; ke Dashboard</span>
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* ============================================================== */}
            {/* MODE 2: FLOATING FULL-BODY TUPI SPOTLIGHT COACH CARD           */}
            {/* ============================================================== */}
            {!isCenterModal && (
                <div
                    key={currentStep.id}
                    style={getFloatingPositionStyle()}
                    className="fixed z-[80] transition-all duration-500 ease-out"
                >
                    <div className="relative flex flex-row items-end sm:items-center gap-3 sm:gap-4 rounded-3xl bg-white dark:bg-[#0E1A33] border border-emerald-500/40 dark:border-emerald-500/40 shadow-[0_20px_50px_rgba(0,0,0,0.45)] p-4 sm:p-5 animate-tupi-spring">
                        {/* Left: Full-Body Tupi Character standing outside/beside card */}
                        <div className="shrink-0 -ml-2 -mt-8 sm:-mt-10 -mb-2 pointer-events-none select-none flex items-end justify-center">
                            <img
                                src={currentStep.pose}
                                alt="Tupi Guide"
                                className={`h-28 sm:h-36 w-auto object-contain drop-shadow-[0_10px_18px_rgba(15,23,42,0.4)] ${currentStep.animClass}`}
                            />
                        </div>

                        {/* Right: Speech Content & Controls */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2 mb-1.5">
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/15 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-[10px] sm:text-[11px] font-bold">
                                    {currentStep.badge}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => markTutorialCompleted()}
                                    className="text-[11px] font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition px-1.5 py-0.5 rounded-lg"
                                >
                                    Lewati
                                </button>
                            </div>

                            <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white leading-snug">
                                {currentStep.title(firstName)}
                            </h3>
                            <p className="mt-1 text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed">
                                {currentStep.description}
                            </p>

                            {/* Step Bar + Navigation */}
                            <div className="mt-3.5 pt-2.5 border-t border-slate-100 dark:border-white/10 flex items-center justify-between gap-2">
                                <div className="flex items-center gap-1">
                                    {TOUR_STEPS.map((st, idx) => (
                                        <span
                                            key={st.id}
                                            className={`h-1.5 rounded-full transition-all duration-300 ${
                                                idx === stepIndex
                                                    ? 'w-4 bg-emerald-500'
                                                    : idx < stepIndex
                                                        ? 'w-1.5 bg-emerald-400/70'
                                                        : 'w-1.5 bg-slate-200 dark:bg-slate-700'
                                            }`}
                                        />
                                    ))}
                                </div>

                                <div className="flex items-center gap-1.5">
                                    <button
                                        type="button"
                                        onClick={() => goToStep(stepIndex - 1)}
                                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                                    >
                                        <ArrowLeft className="w-3.5 h-3.5" />
                                        <span className="hidden sm:inline">Kembali</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => goToStep(stepIndex + 1)}
                                        className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold shadow-sm shadow-emerald-600/25 transition"
                                    >
                                        <span>{isLastStep ? 'Selesai' : 'Lanjut'}</span>
                                        <ArrowRight className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

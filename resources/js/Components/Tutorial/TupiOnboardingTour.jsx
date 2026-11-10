import { router, usePage } from '@inertiajs/react';
import { useEffect, useLayoutEffect, useState, useCallback } from 'react';

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
        mode: 'modal',
        routeName: 'dashboard',
        path: '/dashboard',
        targetSelector: null,
        pose: '/assets/tupi/tupi-wave.png',
        animClass: 'animate-tupi-float',
        badge: 'Panduan Uangku',
        title: (firstName) => `Halo ${firstName}, aku Tupi`,
        description:
            'Aku asisten keuangan pribadimu di Uangku. Yuk keliling sebentar ke seluruh halaman aplikasi agar kamu langsung paham cara mencatat dan memantau keuanganmu.',
    },
    {
        id: 'dashboard-summary',
        mode: 'spotlight',
        routeName: 'dashboard',
        path: '/dashboard',
        targetSelector: '[data-tour="dashboard-summary"]',
        pose: '/assets/tupi/tupi-point.png',
        animClass: 'animate-tupi-float',
        badge: '1 dari 6 — Dashboard',
        title: () => 'Pantau Saldo Real-Time',
        description:
            'Di bagian Ringkasan ini kamu dapat melihat Total Seluruh Uang dari semua dompetmu, beserta total Pemasukan dan Pengeluaran bulan ini secara langsung.',
    },
    {
        id: 'dashboard-add-tx',
        mode: 'spotlight',
        routeName: 'dashboard',
        path: '/dashboard',
        targetSelector: '[data-tour="dashboard-add-tx"]',
        pose: '/assets/mascot.png',
        animClass: 'animate-tupi-float',
        badge: '2 dari 6 — Catat Transaksi',
        title: () => 'Catat Transaksi & Kategori Sendiri',
        description:
            'Setiap habis belanja, bayar tagihan, atau terima gaji, tekan tombol ini. Kamu juga bebas menambah atau menghapus kategori sesuai kebutuhanmu.',
    },
    {
        id: 'transactions-filter',
        mode: 'spotlight',
        routeName: 'transactions.index',
        path: '/transactions',
        targetSelector: '[data-tour="transactions-filter"]',
        pose: '/assets/tupi/tupi-magnify.png',
        animClass: 'animate-tupi-float',
        badge: '3 dari 6 — Riwayat Transaksi',
        title: () => 'Cari & Filter Mutasi Secara Instan',
        description:
            'Sekarang kita berada di halaman Riwayat. Gunakan kolom pencarian serta filter periode, dompet, atau kategori untuk melacak transaksi lama atau mengekspor CSV.',
    },
    {
        id: 'wallets-grid',
        mode: 'spotlight',
        routeName: 'wallets.index',
        path: '/wallets',
        targetSelector: '[data-tour="wallets-grid"]',
        pose: '/assets/tupi/tupi-wallet.png',
        animClass: 'animate-tupi-float',
        badge: '4 dari 6 — Dompet & Rekening',
        title: () => 'Pisahkan Cash, Bank & E-Wallet',
        description:
            'Di halaman Dompet & Rekening, uang tunai, rekening bank, hingga E-Wallet tersimpan terpisah agar rapi. Pilih kartu mana saja untuk melihat mutasi spesifiknya.',
    },
    {
        id: 'wallets-add',
        mode: 'spotlight',
        routeName: 'wallets.index',
        path: '/wallets',
        targetSelector: '[data-tour="wallets-add"]',
        pose: '/assets/tupi/tupi-point.png',
        animClass: 'animate-tupi-float',
        badge: '5 dari 6 — Tambah Dompet',
        title: () => 'Kelola Banyak Sumber Dana',
        description:
            'Punya rekening tabungan atau akun investasi baru? Tekan tombol Tambah Dompet Baru ini kapan saja untuk menambahkannya ke portofoliomu.',
    },
    {
        id: 'reports-chart',
        mode: 'spotlight',
        routeName: 'reports.index',
        path: '/reports',
        targetSelector: '[data-tour="reports-chart"]',
        pose: '/assets/tupi/tupi-chart.png',
        animClass: 'animate-tupi-float',
        badge: '6 dari 6 — Laporan & Grafik',
        title: () => 'Analisis Tren & Rasio Tabungan',
        description:
            'Terakhir, di halaman Laporan & Grafik ini kamu bisa melihat perbandingan pemasukan vs pengeluaran serta kategori paling besar dalam grafik visual.',
    },
    {
        id: 'finale',
        mode: 'modal',
        routeName: 'reports.index',
        path: '/reports',
        targetSelector: null,
        pose: '/assets/tupi/tupi-celebrate.png',
        animClass: 'animate-tupi-hop',
        badge: 'Tur Selesai',
        title: (firstName) => `Semua Halaman Siap Digunakan, ${firstName}`,
        description:
            'Kamu sudah mengenal Dashboard, Riwayat, Dompet, hingga Laporan. Sekarang saatnya mulai mencatat transaksi pertamamu.',
    },
];

function getCurrentPath() {
    if (typeof window === 'undefined') return '';
    return window.location.pathname.replace(/\/+$/, '') || '/';
}

function readTourState() {
    if (typeof window === 'undefined') return null;
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

function saveTourState(state) {
    if (typeof window === 'undefined') return;
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

function getInitialTourSync(user) {
    if (!user) return { isActive: false, stepIndex: 0 };
    const saved = readTourState();
    if (saved && saved.active) {
        const safeIdx = Math.max(0, Math.min(saved.stepIndex || 0, TOUR_STEPS.length - 1));
        const targetPath = TOUR_STEPS[safeIdx].path;
        if (getCurrentPath() === targetPath) {
            return { isActive: true, stepIndex: safeIdx };
        }
    }
    return { isActive: false, stepIndex: 0 };
}

export function launchTupiTour() {
    saveTourState({ active: true, stepIndex: 0 });
    if (getCurrentPath() !== '/dashboard') {
        router.visit('/dashboard');
    } else {
        window.dispatchEvent(new CustomEvent('uangku:start-tupi-tour'));
    }
}

export default function TupiOnboardingTour() {
    const page = usePage();
    const { auth } = page.props;
    const user = auth?.user;
    const firstName = user?.name ? user.name.split(' ')[0] : 'Teman';

    const initialTour = getInitialTourSync(user);
    const [isActive, setIsActive] = useState(initialTour.isActive);
    const [isNavigating, setIsNavigating] = useState(false);
    const [stepIndex, setStepIndex] = useState(initialTour.stepIndex);
    const [targetRect, setTargetRect] = useState(null);
    const [viewport, setViewport] = useState({
        w: typeof window !== 'undefined' ? window.innerWidth : 1024,
        h: typeof window !== 'undefined' ? window.innerHeight : 768,
    });

    const currentStep = TOUR_STEPS[stepIndex] || TOUR_STEPS[0];

    // Preload all Tupi pose PNGs on mount so pose switches are instant
    useEffect(() => {
        TUPI_IMAGES.forEach((src) => {
            const img = new Image();
            img.src = src;
        });
    }, []);

    // Listen to manual "Tur Tupi" launch when already on dashboard
    useEffect(() => {
        const handleManualStart = () => {
            saveTourState({ active: true, stepIndex: 0 });
            setIsNavigating(false);
            setTargetRect(null);
            setStepIndex(0);
            setIsActive(true);
        };
        window.addEventListener('uangku:start-tupi-tour', handleManualStart);
        return () => window.removeEventListener('uangku:start-tupi-tour', handleManualStart);
    }, []);

    // Auto-start tutorial once for newly registered users
    useEffect(() => {
        if (!user) return;

        const saved = readTourState();
        if (saved && saved.active) {
            const safeIdx = Math.max(0, Math.min(saved.stepIndex || 0, TOUR_STEPS.length - 1));
            const targetPath = TOUR_STEPS[safeIdx].path;

            if (getCurrentPath() === targetPath) {
                setStepIndex(safeIdx);
                setIsActive(true);
                setIsNavigating(false);
            }
            return;
        }

        if (user.has_completed_tutorial === false && getCurrentPath() === '/dashboard') {
            const timer = setTimeout(() => {
                saveTourState({ active: true, stepIndex: 0 });
                setStepIndex(0);
                setIsActive(true);
                setIsNavigating(false);
            }, 450);
            return () => clearTimeout(timer);
        }
    }, [user, page.url]);

    // Measure target element rect synchronously
    const measureTarget = useCallback(() => {
        if (!isActive || isNavigating) return;

        const vw = window.innerWidth;
        const vh = window.innerHeight;
        setViewport({ w: vw, h: vh });

        if (currentStep.mode !== 'spotlight' || !currentStep.targetSelector) {
            setTargetRect(null);
            return;
        }

        const el = document.querySelector(currentStep.targetSelector);
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
    }, [isActive, isNavigating, currentStep]);

    // Position spotlight before paint and keep tracking on scroll/resize
    useLayoutEffect(() => {
        if (!isActive || isNavigating) return;

        if (currentStep.mode === 'spotlight' && currentStep.targetSelector) {
            const el = document.querySelector(currentStep.targetSelector);
            if (el) {
                // Scroll target element into view immediately if outside comfortable viewport
                const rect = el.getBoundingClientRect();
                const inComfortZone = rect.top >= 70 && rect.bottom <= window.innerHeight - 160;
                if (!inComfortZone) {
                    el.scrollIntoView({ behavior: 'auto', block: 'center' });
                }
            }
        }

        measureTarget();
        const raf = requestAnimationFrame(measureTarget);
        const t1 = setTimeout(measureTarget, 120);

        window.addEventListener('resize', measureTarget);
        window.addEventListener('scroll', measureTarget, true);

        return () => {
            cancelAnimationFrame(raf);
            clearTimeout(t1);
            window.removeEventListener('resize', measureTarget);
            window.removeEventListener('scroll', measureTarget, true);
        };
    }, [isActive, isNavigating, stepIndex, currentStep, measureTarget]);

    const markTutorialCompleted = useCallback((redirectPath = null) => {
        saveTourState(null);
        setIsActive(false);
        setIsNavigating(false);
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

            if (getCurrentPath() !== targetStep.path) {
                // Hide card smoothly during Inertia page swap to prevent wrong-step/center flash
                setIsNavigating(true);
                setTargetRect(null);
                router.visit(targetStep.path);
            } else {
                setStepIndex(nextIndex);
            }
        },
        [markTutorialCompleted]
    );

    // Keyboard navigation (Escape / ArrowRight / ArrowLeft)
    useEffect(() => {
        if (!isActive || isNavigating) return;
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
    }, [isActive, isNavigating, stepIndex, goToStep, markTutorialCompleted]);

    if (!isActive || !user) return null;

    // While switching Inertia pages, keep a quiet subtle dim overlay without flashing wrong cards
    if (isNavigating) {
        return <div className="fixed inset-0 z-[75] bg-[#070D19]/60 backdrop-blur-[2px] transition-opacity duration-200" />;
    }

    const isCenterModal = currentStep.mode === 'modal';
    const isSpotlightReady = currentStep.mode === 'spotlight' && targetRect !== null;

    // Wait silently until DOM target has been measured synchronously
    if (currentStep.mode === 'spotlight' && !isSpotlightReady) {
        return <div className="fixed inset-0 z-[75] bg-[#070D19]/70 transition-opacity duration-150" />;
    }

    const isFirstStep = stepIndex === 0;
    const isLastStep = stepIndex === TOUR_STEPS.length - 1;

    const getFloatingPositionStyle = () => {
        if (!targetRect) return {};

        const isMobile = viewport.w < 640;
        const targetCenterY = targetRect.top + targetRect.height / 2;

        if (isMobile) {
            const placeTop = targetCenterY > viewport.h * 0.55;
            return placeTop
                ? { top: '48px', left: '12px', right: '12px' }
                : { bottom: '16px', left: '12px', right: '12px' };
        }

        const cardEstimatedHeight = 235;
        const cardWidth = Math.min(540, viewport.w - 32);
        const spaceBelow = viewport.h - targetRect.bottom;
        const placeBelow = spaceBelow >= cardEstimatedHeight + 36 || targetRect.top < cardEstimatedHeight + 48;

        const top = placeBelow
            ? Math.min(Math.max(48, targetRect.bottom + 20), viewport.h - cardEstimatedHeight - 16)
            : Math.max(48, targetRect.top - cardEstimatedHeight - 20);

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
            {/* Backdrop / Spotlight Cutout */}
            {isCenterModal ? (
                <div className="fixed inset-0 bg-[#070D19]/75 backdrop-blur-sm transition-opacity duration-300" />
            ) : (
                <>
                    <div className="fixed inset-0 z-[75]" />
                    <div
                        className="fixed z-[76] pointer-events-none rounded-2xl transition-all duration-300 ease-out animate-tupi-ring border-2 border-emerald-400"
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

            {/* MODE 1: WELCOME OR FINALE MODAL (ONLY Step 0 and Step 7) */}
            {isCenterModal && (
                <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 overflow-y-auto">
                    <div
                        key={currentStep.id}
                        className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-[#0E1A33] border border-slate-200 dark:border-[#1E3158] shadow-2xl p-6 sm:p-8 text-center animate-tupi-spring overflow-visible mt-12 sm:mt-8"
                    >
                        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-56 h-56 bg-emerald-500/20 dark:bg-emerald-500/25 rounded-full blur-3xl pointer-events-none" />

                        <button
                            type="button"
                            onClick={() => markTutorialCompleted()}
                            aria-label="Tutup tutorial"
                            className="absolute top-4 right-4 w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 text-lg font-medium leading-none transition"
                        >
                            &times;
                        </button>

                        {/* Full-Body Tupi Mascot */}
                        <div className="relative -mt-20 sm:-mt-24 mb-3 flex justify-center pointer-events-none select-none">
                            <img
                                src={currentStep.pose}
                                alt="Tupi Maskot Uangku"
                                className={`h-40 sm:h-48 w-auto object-contain drop-shadow-[0_14px_24px_rgba(15,23,42,0.35)] ${currentStep.animClass}`}
                            />
                        </div>

                        <div className="inline-block px-3.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/15 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold mb-3">
                            {currentStep.badge}
                        </div>

                        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                            {currentStep.title(firstName)}
                        </h2>
                        <p className="mt-2.5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-md mx-auto">
                            {currentStep.description}
                        </p>

                        {/* Step Indicator */}
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

                        {/* Modal Actions */}
                        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-2.5">
                            {isFirstStep ? (
                                <>
                                    <button
                                        type="button"
                                        onClick={() => goToStep(1)}
                                        className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 active:scale-[0.98] text-white text-sm font-bold shadow-lg shadow-emerald-600/25 transition"
                                    >
                                        Mulai Tur Bersama Tupi
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
                                        className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 active:scale-[0.98] text-white text-sm font-bold shadow-lg shadow-emerald-600/25 transition"
                                    >
                                        Catat Transaksi Pertama
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => markTutorialCompleted('/dashboard')}
                                        className="w-full sm:w-auto px-5 py-3 rounded-2xl border border-slate-300 dark:border-white/10 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/70 transition"
                                    >
                                        Selesai &amp; ke Dashboard
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* MODE 2: FLOATING FULL-BODY TUPI SPOTLIGHT COACH CARD */}
            {isSpotlightReady && (
                <div
                    key={currentStep.id}
                    style={getFloatingPositionStyle()}
                    className="fixed z-[80] transition-all duration-300 ease-out"
                >
                    <div className="relative flex flex-row items-end sm:items-center gap-3 sm:gap-4 rounded-3xl bg-white dark:bg-[#0E1A33] border border-emerald-500/40 dark:border-emerald-500/40 shadow-[0_20px_50px_rgba(0,0,0,0.45)] p-4 sm:p-5 animate-tupi-spring">
                        {/* Left: Full-Body Tupi Character */}
                        <div className="shrink-0 -ml-2 -mt-8 sm:-mt-10 -mb-2 pointer-events-none select-none flex items-end justify-center">
                            <img
                                src={currentStep.pose}
                                alt="Tupi Panduan Uangku"
                                className={`h-28 sm:h-36 w-auto object-contain drop-shadow-[0_10px_18px_rgba(15,23,42,0.4)] ${currentStep.animClass}`}
                            />
                        </div>

                        {/* Right: Clean Speech Content & Navigation */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2 mb-1.5">
                                <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/15 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-[10px] sm:text-[11px] font-bold">
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
                                        className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                                    >
                                        Kembali
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => goToStep(stepIndex + 1)}
                                        className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold shadow-sm shadow-emerald-600/25 transition"
                                    >
                                        {isLastStep ? 'Selesai' : 'Lanjut'}
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

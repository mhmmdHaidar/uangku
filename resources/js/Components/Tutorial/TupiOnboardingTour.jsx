import { router, usePage } from '@inertiajs/react';
import { CheckCircle2, Lock, PlusCircle } from 'lucide-react';
import { useEffect, useLayoutEffect, useState, useCallback, useRef } from 'react';

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
        badge: 'Panduan Lengkap Uangku',
        title: (firstName) => `Halo ${firstName}, aku Tupi`,
        description:
            'Aku asisten keuanganmu di Uangku. Yuk ikut Tupi menyusuri 9 langkah singkat agar kamu langsung siap mengelola seluruh arus kasmu dengan mudah.',
    },

    // =========================================================================
    // HALAMAN 1: DASHBOARD (TRANSAKSI + RINGKASAN + SPESIAL PENGEMBANG)
    // =========================================================================
    {
        id: 'dashboard-add-tx',
        mode: 'spotlight',
        routeName: 'dashboard',
        path: '/dashboard',
        targetSelector: '[data-tour="dashboard-add-tx"]',
        pose: '/assets/tupi/tupi-point.png',
        animClass: 'animate-tupi-float',
        badge: 'Dashboard — Transaksi',
        title: () => 'Catat Pemasukan & Pengeluaran',
        description:
            'Gunakan tombol Tambah Transaksi Baru untuk mencatat pemasukan atau pengeluaran dalam hitungan detik, memilih dompet, serta mengatur kategori.',
    },
    {
        id: 'dashboard-summary',
        mode: 'spotlight',
        routeName: 'dashboard',
        path: '/dashboard',
        targetSelector: '[data-tour="dashboard-summary"]',
        pose: '/assets/mascot.png',
        animClass: 'animate-tupi-float',
        badge: 'Dashboard — Ringkasan',
        title: () => 'Pantau Total Saldo & Kondisi Kas',
        description:
            'Kartu Ringkasan menampilkan Total Seluruh Uang dari semua dompet, indikator kondisi kas, serta pemasukan dan pengeluaran bulan berjalan secara real-time.',
    },

    // =========================================================================
    // SPESIAL INTERLUDE: FOOTER PENGEMBANG (NUR MUHAMMAD HAIDAR)
    // =========================================================================
    {
        id: 'developer-footer',
        mode: 'spotlight',
        isSpecial: true,
        scrollToBottom: true,
        routeName: 'dashboard',
        path: '/dashboard',
        targetSelector: '[data-tour="app-footer-dev"]',
        pose: '/assets/tupi/tupi-wave.png',
        animClass: 'animate-tupi-hop',
        badge: 'Kenalan Dulu',
        title: () => 'Ini Yang Ciptain Tupi',
        description:
            'Eits, berhenti sebentar. Lihat nama yang disorot di bawah? Itu Haidar, orang yang ngerancang Uangku dari nol sekaligus yang ngasih tempat tinggal buat Tupi. Katanya sih dibikin biar dompet kamu nggak ikut menangis di akhir bulan. Kalau kamu kepo sama si bro, boleh banget klik namanya.',
    },

    // =========================================================================
    // HALAMAN 2: RIWAYAT TRANSAKSI (FILTER + DAFTAR MUTASI)
    // =========================================================================
    {
        id: 'transactions-filter',
        mode: 'spotlight',
        routeName: 'transactions.index',
        path: '/transactions',
        targetSelector: '[data-tour="transactions-filter"]',
        pose: '/assets/tupi/tupi-magnify.png',
        animClass: 'animate-tupi-float',
        badge: 'Riwayat — Filter & Ekspor',
        title: () => 'Cari, Filter & Unduh Laporan',
        description:
            'Di halaman Riwayat Transaksi, saring catatan berdasarkan hari, minggu, bulan, jenis, maupun dompet, atau ubah tampilan Kartu / Tabel dan ekspor CSV dari atas halaman.',
    },
    {
        id: 'transactions-list',
        mode: 'spotlight',
        routeName: 'transactions.index',
        path: '/transactions',
        targetSelector: '[data-tour="transactions-list"]',
        pose: '/assets/mascot.png',
        animClass: 'animate-tupi-float',
        badge: 'Riwayat — Daftar Mutasi',
        title: () => 'Detail Struk & Kelola Mutasi',
        description:
            'Seluruh catatan mutasi tersaji di sini. Klik transaksi untuk melihat detail struk lengkap, mengedit nominal/dompet, atau menghapus catatan yang keliru.',
    },

    // =========================================================================
    // HALAMAN 3: DOMPET & REKENING (WAJIB BUAT DOMPET BARU + KARTU DOMPET)
    // =========================================================================
    {
        id: 'wallets-add',
        mode: 'spotlight',
        requiresWalletSetup: true,
        routeName: 'wallets.index',
        path: '/wallets',
        targetSelector: '[data-tour="wallets-add"]',
        pose: '/assets/tupi/tupi-point.png',
        animClass: 'animate-tupi-float',
        badge: 'Dompet — Sumber Dana',
        title: () => 'Tambah Sumber Dana Baru',
        description:
            'Di halaman Dompet & Rekening kamu bisa menambahkan akun Rekening Bank, E-Wallet, Cash tambahan, atau Investasi lewat tombol Tambah Dompet Baru kapan saja.',
    },
    {
        id: 'wallets-grid',
        mode: 'spotlight',
        routeName: 'wallets.index',
        path: '/wallets',
        targetSelector: '[data-tour="wallets-grid"]',
        pose: '/assets/tupi/tupi-wallet.png',
        animClass: 'animate-tupi-float',
        badge: 'Dompet — Kartu Digital',
        title: () => 'Kartu Dompet Digital Interaktif',
        description:
            'Semua dompetmu tampil sebagai kartu visual lengkap dengan saldo terkini. Klik kartu mana saja untuk melihat grafik dan rincian mutasi khusus dompet tersebut.',
    },

    // =========================================================================
    // HALAMAN 4: LAPORAN & GRAFIK (GRAFIK TREN + EVALUASI KATEGORI)
    // =========================================================================
    {
        id: 'reports-chart',
        mode: 'spotlight',
        routeName: 'reports.index',
        path: '/reports',
        targetSelector: '[data-tour="reports-chart"]',
        pose: '/assets/tupi/tupi-chart.png',
        animClass: 'animate-tupi-float',
        badge: 'Laporan — Grafik Tren',
        title: () => 'Grafik Pemasukan vs Pengeluaran',
        description:
            'Pantau pergerakan arus kasmu dari waktu ke waktu lewat grafik interaktif dan indikator Rasio Tabungan dalam rentang Mingguan, Bulanan, hingga Tahunan.',
    },
    {
        id: 'reports-breakdown',
        mode: 'spotlight',
        routeName: 'reports.index',
        path: '/reports',
        targetSelector: '[data-tour="reports-breakdown"]',
        pose: '/assets/tupi/tupi-magnify.png',
        animClass: 'animate-tupi-float',
        badge: 'Laporan — Evaluasi',
        title: () => 'Rincian Kategori & Catatan Evaluasi',
        description:
            'Lihat persentase pengeluaran tiap kategori, transaksi terbesar pada periode terpilih, dan Catatan Evaluasi Finansial otomatis untuk menjaga kas tetap sehat.',
    },

    // =========================================================================
    // PENUTUP: GRAND FINALE
    // =========================================================================
    {
        id: 'finale',
        mode: 'modal',
        routeName: 'reports.index',
        path: '/reports',
        targetSelector: null,
        pose: '/assets/tupi/tupi-celebrate.png',
        animClass: 'animate-tupi-hop',
        badge: 'Tur Panduan Selesai',
        title: (firstName) => `Semua Halaman Siap Digunakan, ${firstName}`,
        description:
            'Dari Dashboard, kenalan dengan pengembang, Riwayat, mendaftarkan Dompet, hingga Laporan Grafik sudah Tupi jelaskan. Sekarang saatnya mencatat transaksi pertamamu!',
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

function getHeaderClearance() {
    if (typeof document === 'undefined') return 76;
    const nav = document.querySelector('nav');
    if (nav) {
        const rect = nav.getBoundingClientRect();
        if (rect.height > 0 && rect.top <= 40) {
            return Math.ceil(rect.bottom);
        }
    }
    return 76;
}

export default function TupiOnboardingTour() {
    const page = usePage();
    const { auth } = page.props;
    const user = auth?.user;
    const firstName = user?.name ? user.name.split(' ')[0] : 'Teman';

    const initialTour = getInitialTourSync(user);
    const [isActive, setIsActive] = useState(initialTour.isActive);
    const [isNavigating, setIsNavigating] = useState(false);
    const [isSettling, setIsSettling] = useState(false);
    const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
    const [walletCreatedInTour, setWalletCreatedInTour] = useState(false);
    const [stepIndex, setStepIndex] = useState(initialTour.stepIndex);
    const [targetRect, setTargetRect] = useState(null);
    const [viewport, setViewport] = useState({
        w: typeof window !== 'undefined' ? window.innerWidth : 1024,
        h: typeof window !== 'undefined' ? window.innerHeight : 768,
        headerBottom: 76,
    });
    const cardRef = useRef(null);

    const currentStep = TOUR_STEPS[stepIndex] || TOUR_STEPS[0];
    const isWalletStep = Boolean(currentStep.requiresWalletSetup);
    const isWalletGateActive = isWalletStep && user?.has_created_wallet === false;

    const openWalletCreateModal = useCallback(() => {
        if (typeof window === 'undefined') return;
        window.dispatchEvent(new CustomEvent('uangku:tour-open-wallet-modal'));
    }, []);

    // Preload all Tupi pose PNGs on mount
    useEffect(() => {
        TUPI_IMAGES.forEach((src) => {
            const img = new Image();
            img.src = src;
        });
    }, []);

    // Listen to manual "Tur Tupi" launch & wallet modal lifecycle events
    useEffect(() => {
        const handleManualStart = () => {
            saveTourState({ active: true, stepIndex: 0 });
            setIsNavigating(false);
            setIsSettling(false);
            setIsWalletModalOpen(false);
            setWalletCreatedInTour(false);
            setTargetRect(null);
            setStepIndex(0);
            setIsActive(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        };
        const handleWalletModalState = (e) => {
            setIsWalletModalOpen(Boolean(e.detail?.isOpen));
        };
        const handleWalletCreated = () => {
            setWalletCreatedInTour(true);
        };

        window.addEventListener('uangku:start-tupi-tour', handleManualStart);
        window.addEventListener('uangku:wallet-modal-state', handleWalletModalState);
        window.addEventListener('uangku:wallet-created-in-tour', handleWalletCreated);
        return () => {
            window.removeEventListener('uangku:start-tupi-tour', handleManualStart);
            window.removeEventListener('uangku:wallet-modal-state', handleWalletModalState);
            window.removeEventListener('uangku:wallet-created-in-tour', handleWalletCreated);
        };
    }, []);

    // Auto-launch once for newly registered users
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

    // Measure target element rect & live navbar height
    const measureTarget = useCallback(() => {
        if (!isActive || isNavigating) return;

        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const headerBottom = getHeaderClearance();
        setViewport({ w: vw, h: vh, headerBottom });

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

    // Compute exact scroll destination first and wait for scroll to settle so mobile card never jumps mid-scroll
    useLayoutEffect(() => {
        if (!isActive || isNavigating) return;

        if (currentStep.mode !== 'spotlight' || !currentStep.targetSelector) {
            setIsSettling(false);
            setTargetRect(null);
            return;
        }

        const el = document.querySelector(currentStep.targetSelector);
        if (!el) {
            setIsSettling(false);
            setTargetRect(null);
            return;
        }

        const vh = window.innerHeight;
        const isMobile = window.innerWidth < 640;
        const headerBottom = getHeaderClearance();
        const topSafeEdge = headerBottom + 12;
        const rect = el.getBoundingClientRect();

        let desiredScrollY = null;

        if (currentStep.scrollToBottom) {
            desiredScrollY = Math.max(0, document.documentElement.scrollHeight - vh);
        } else if (isMobile) {
            // Reserve ~200px at bottom for the compact mobile card so spotlighted content sits cleanly above it
            const bottomSafeEdge = vh - 204;
            const fitsInSafeZone = rect.top >= topSafeEdge && rect.bottom <= bottomSafeEdge;
            const tallAlignedAtTop =
                rect.height > bottomSafeEdge - topSafeEdge &&
                rect.top >= topSafeEdge - 4 &&
                rect.top <= topSafeEdge + 24;

            if (!fitsInSafeZone && !tallAlignedAtTop) {
                if (rect.height <= bottomSafeEdge - topSafeEdge) {
                    const extraSpace = bottomSafeEdge - topSafeEdge - rect.height;
                    const idealTop = topSafeEdge + Math.min(24, Math.max(0, extraSpace * 0.25));
                    desiredScrollY = Math.max(0, window.scrollY + rect.top - idealTop);
                } else {
                    desiredScrollY = Math.max(0, window.scrollY + rect.top - topSafeEdge);
                }
            }
        } else {
            if (rect.height > vh * 0.55) {
                desiredScrollY = Math.max(0, window.scrollY + rect.top - topSafeEdge);
            } else {
                const inComfortZone = rect.top >= topSafeEdge && rect.bottom <= vh - 235;
                if (!inComfortZone) {
                    const idealTop = Math.max(topSafeEdge, (vh - rect.height) / 2 - 36);
                    desiredScrollY = Math.max(0, window.scrollY + rect.top - idealTop);
                }
            }
        }

        const maxScroll = Math.max(0, document.documentElement.scrollHeight - vh);
        if (desiredScrollY !== null) {
            desiredScrollY = Math.min(maxScroll, Math.max(0, Math.round(desiredScrollY)));
        }

        const needsScroll = desiredScrollY !== null && Math.abs(desiredScrollY - window.scrollY) > 10;

        if (!needsScroll) {
            setIsSettling(false);
            measureTarget();
            return;
        }

        setIsSettling(true);
        let settled = false;

        const finishSettle = () => {
            if (settled) return;
            settled = true;
            measureTarget();
            setIsSettling(false);
        };

        let debounceTimer = null;
        const onScrollTick = () => {
            if (debounceTimer) clearTimeout(debounceTimer);
            debounceTimer = setTimeout(finishSettle, 110);
        };

        window.addEventListener('scrollend', finishSettle, { once: true });
        window.addEventListener('scroll', onScrollTick, { passive: true });
        const maxWaitTimer = setTimeout(finishSettle, 460);

        window.scrollTo({
            top: desiredScrollY,
            behavior: 'smooth',
        });

        return () => {
            settled = true;
            window.removeEventListener('scrollend', finishSettle);
            window.removeEventListener('scroll', onScrollTick);
            if (debounceTimer) clearTimeout(debounceTimer);
            clearTimeout(maxWaitTimer);
        };
    }, [isActive, isNavigating, stepIndex, currentStep, measureTarget]);

    // Keep target measurement synced on resize, user scroll & modal close
    useEffect(() => {
        if (!isActive || isNavigating || isSettling || isWalletModalOpen) return;

        measureTarget();
        const raf = requestAnimationFrame(measureTarget);
        const t1 = setTimeout(measureTarget, 160);

        window.addEventListener('resize', measureTarget);
        window.addEventListener('scroll', measureTarget, { capture: true, passive: true });

        return () => {
            cancelAnimationFrame(raf);
            clearTimeout(t1);
            window.removeEventListener('resize', measureTarget);
            window.removeEventListener('scroll', measureTarget, { capture: true });
        };
    }, [isActive, isNavigating, isSettling, isWalletModalOpen, stepIndex, measureTarget]);

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
            if (nextIndex > stepIndex && isWalletGateActive) return;

            if (nextIndex >= TOUR_STEPS.length) {
                markTutorialCompleted('/dashboard');
                return;
            }

            const targetStep = TOUR_STEPS[nextIndex];
            saveTourState({ active: true, stepIndex: nextIndex });

            if (getCurrentPath() !== targetStep.path) {
                setIsNavigating(true);
                setTargetRect(null);
                router.visit(targetStep.path);
            } else {
                setStepIndex(nextIndex);
            }
        },
        [stepIndex, isWalletGateActive, markTutorialCompleted]
    );

    // Keyboard shortcuts
    useEffect(() => {
        if (!isActive || isNavigating || isWalletModalOpen) return;
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                if (!isWalletGateActive) markTutorialCompleted();
            } else if (e.key === 'ArrowRight') {
                if (stepIndex < TOUR_STEPS.length - 1 && !isWalletGateActive) goToStep(stepIndex + 1);
            } else if (e.key === 'ArrowLeft') {
                if (stepIndex > 0) goToStep(stepIndex - 1);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isActive, isNavigating, isWalletModalOpen, isWalletGateActive, stepIndex, goToStep, markTutorialCompleted]);

    if (!isActive || !user || isWalletModalOpen) return null;

    if (isNavigating) {
        return <div className="fixed inset-0 z-[75] bg-[#070D19]/60 dark:bg-black/75 backdrop-blur-[2px] transition-opacity duration-200" />;
    }

    const isCenterModal = currentStep.mode === 'modal';
    const isSpotlightReady = currentStep.mode === 'spotlight' && targetRect !== null && !isSettling;

    if (currentStep.mode === 'spotlight' && !isSpotlightReady) {
        return <div className="fixed inset-0 z-[75] bg-[#070D19]/70 dark:bg-black/75 transition-opacity duration-150" />;
    }

    const isFirstStep = stepIndex === 0;
    const isSpecial = !!currentStep.isSpecial;
    const totalGuidedSteps = TOUR_STEPS.length - 2; // Exclude Welcome and Finale
    const isMobile = viewport.w < 640;
    const headerBottom = viewport.headerBottom || 76;
    const mobilePlaceTop = isMobile && (targetRect ? (targetRect.top > viewport.h * 0.48 || Boolean(currentStep.scrollToBottom)) : false);

    const stepPose = isWalletStep && walletCreatedInTour
        ? '/assets/tupi/tupi-celebrate.png'
        : currentStep.pose;

    const stepBadge = isWalletGateActive
        ? 'Dompet — Langkah Wajib'
        : isWalletStep && walletCreatedInTour
            ? 'Dompet Berhasil Ditambahkan'
            : currentStep.badge;

    const stepTitle = isWalletGateActive
        ? 'Daftarkan Dompet Pertamamu'
        : isWalletStep && walletCreatedInTour
            ? 'Mantap! Dompetmu Sudah Siap'
            : currentStep.title(firstName);

    const stepDescription = isWalletGateActive
        ? 'Saat ini akun barumu baru memiliki dompet Uang Tunai (Cash). Daftarkan minimal 1 dompet lagi—bebas pilih Rekening Bank, E-Wallet, atau Investasi—sebelum melanjutkan tur.'
        : isWalletStep && walletCreatedInTour
            ? 'Dompet barumu sudah berhasil disimpan! Klik Lanjut di bawah untuk melihat daftar kartu dompet digitalmu.'
            : currentStep.description;

    // Clamp spotlight frame on mobile so borders never slip behind sticky navbar or guide card
    const getSpotlightStyle = () => {
        if (!targetRect) return {};

        const rawTop = Math.max(4, targetRect.top - 8);
        const rawLeft = Math.max(4, targetRect.left - 8);
        const rawWidth = Math.min(viewport.w - rawLeft - 4, targetRect.width + 16);

        if (!isMobile) {
            return {
                top: `${Math.round(rawTop)}px`,
                left: `${Math.round(rawLeft)}px`,
                width: `${Math.round(rawWidth)}px`,
                height: `${Math.round(targetRect.height + 16)}px`,
            };
        }

        const measuredCardHeight = cardRef.current?.offsetHeight || 182;
        const minTop = mobilePlaceTop
            ? headerBottom + measuredCardHeight + 18
            : headerBottom + 4;
        const maxBottom = mobilePlaceTop
            ? viewport.h - 4
            : viewport.h - (measuredCardHeight + 22);

        const clampedTop = Math.max(minTop, rawTop);
        const rawBottom = targetRect.bottom + 8;
        const clampedBottom = Math.max(clampedTop + 44, Math.min(rawBottom, maxBottom));

        return {
            top: `${Math.round(clampedTop)}px`,
            left: `${Math.round(rawLeft)}px`,
            width: `${Math.round(rawWidth)}px`,
            height: `${Math.round(clampedBottom - clampedTop)}px`,
        };
    };

    const spotlightStyle = isSpotlightReady ? getSpotlightStyle() : {};

    // Responsive floating card positioning that keeps both card & target 100% readable
    const getFloatingPositionStyle = () => {
        if (!targetRect) return {};

        if (isMobile) {
            return mobilePlaceTop
                ? { top: `${Math.round(headerBottom + 10)}px`, left: '12px', right: '12px' }
                : { bottom: 'calc(14px + env(safe-area-inset-bottom, 0px))', left: '12px', right: '12px' };
        }

        // Desktop: if target is huge (>55% viewport), dock floating guide cleanly bottom-right
        if (targetRect.height > viewport.h * 0.55) {
            return {
                bottom: '24px',
                right: '24px',
                width: `${Math.min(500, viewport.w - 48)}px`,
            };
        }

        const cardEstimatedHeight = isSpecial ? 275 : 245;
        const cardWidth = Math.min(560, viewport.w - 32);
        const spaceBelow = viewport.h - targetRect.bottom;
        const placeBelow = !currentStep.scrollToBottom && (spaceBelow >= cardEstimatedHeight + 36 || targetRect.top < cardEstimatedHeight + 52);

        const top = placeBelow
            ? Math.min(Math.max(headerBottom + 12, targetRect.bottom + 20), viewport.h - cardEstimatedHeight - 16)
            : Math.max(headerBottom + 12, targetRect.top - cardEstimatedHeight - 24);

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
                <div className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity duration-300" />
            ) : (
                <>
                    <div className="fixed inset-0 z-[75]" />
                    <div
                        className={`fixed z-[76] pointer-events-none rounded-2xl transition-all duration-300 ease-out border-2 ${
                            isSpecial
                                ? 'border-amber-400 shadow-[0_0_32px_rgba(251,191,36,0.55)]'
                                : 'border-[#00105B] dark:border-zinc-200'
                        }`}
                        style={{
                            ...spotlightStyle,
                            boxShadow: isSpecial
                                ? '0 0 0 9999px rgba(0, 0, 0, 0.78), 0 0 28px rgba(251, 191, 36, 0.45)'
                                : '0 0 0 9999px rgba(0, 0, 0, 0.76)',
                        }}
                    >
                        {!isSpecial && (
                            <div className="absolute inset-0 rounded-2xl animate-tupi-ring pointer-events-none" />
                        )}
                    </div>
                    {isSpecial && (
                        <a
                            href="https://my-portfolio-alpha-roan-39.vercel.app"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Kunjungi portofolio Haidar"
                            className="fixed z-[77] rounded-2xl cursor-pointer"
                            style={spotlightStyle}
                        />
                    )}
                    {isWalletGateActive && (
                        <button
                            type="button"
                            onClick={openWalletCreateModal}
                            aria-label="Tambah Dompet Baru"
                            className="fixed z-[77] rounded-2xl cursor-pointer focus:outline-none"
                            style={spotlightStyle}
                        />
                    )}
                </>
            )}

            {/* MODE 1: WELCOME OR FINALE CENTER MODAL */}
            {isCenterModal && (
                <div className="fixed inset-0 z-[80] flex items-center justify-center pt-[calc(4.75rem+env(safe-area-inset-top,0px))] pb-[calc(1.25rem+env(safe-area-inset-bottom,0px))] px-3 sm:p-4 overflow-y-auto">
                    <div
                        key={currentStep.id}
                        className="relative w-full max-w-[calc(100vw-24px)] sm:max-w-lg rounded-3xl bg-white dark:bg-[#1C1C20] border border-slate-200 dark:border-[#2C2C32] shadow-2xl p-5 sm:p-8 text-center animate-tupi-spring overflow-visible mt-12 sm:mt-8"
                    >
                        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-56 h-56 bg-[#00105B]/15 dark:bg-white/[0.06] rounded-full blur-3xl pointer-events-none" />

                        <button
                            type="button"
                            onClick={() => markTutorialCompleted()}
                            aria-label="Tutup tutorial"
                            className="absolute top-4 right-4 w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-[#2A2A30] text-lg font-medium leading-none transition"
                        >
                            &times;
                        </button>

                        {/* Full-Body Tupi Mascot */}
                        <div className="relative -mt-16 sm:-mt-24 mb-2.5 sm:mb-3 flex justify-center pointer-events-none select-none">
                            <img
                                src={currentStep.pose}
                                alt="Tupi Maskot Uangku"
                                className={`h-32 sm:h-48 w-auto object-contain drop-shadow-[0_14px_24px_rgba(15,23,42,0.35)] ${currentStep.animClass}`}
                            />
                        </div>

                        <div className="inline-block px-3.5 py-1 rounded-full bg-[#00105B]/10 dark:bg-[#242429] border border-[#00105B]/20 dark:border-[#3E3E46] text-[#00105B] dark:text-zinc-200 text-xs font-bold mb-3">
                            {currentStep.badge}
                        </div>

                        <h2 className="text-lg sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                            {currentStep.title(firstName)}
                        </h2>
                        <p className="mt-2.5 text-xs sm:text-sm text-slate-600 dark:text-zinc-300 leading-relaxed max-w-md mx-auto">
                            {currentStep.description}
                        </p>

                        {/* Progress Bar */}
                        <div className="mt-4 sm:mt-5 max-w-xs mx-auto space-y-1.5">
                            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-zinc-400">
                                <span>{isFirstStep ? 'Siap Memulai' : 'Tur Selesai'}</span>
                                <span className="tabular-nums">
                                    {isFirstStep ? `0 / ${totalGuidedSteps} Langkah` : `${totalGuidedSteps} / ${totalGuidedSteps} Langkah`}
                                </span>
                            </div>
                            <div className="h-1 w-full rounded-full bg-slate-200 dark:bg-[#2C2C32] overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-300 ${
                                        isFirstStep ? 'bg-[#00105B] dark:bg-zinc-200' : 'bg-emerald-500 dark:bg-emerald-400'
                                    }`}
                                    style={{ width: isFirstStep ? '8%' : '100%' }}
                                />
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="mt-5 sm:mt-6 flex flex-col sm:flex-row items-center justify-center gap-2.5">
                            {isFirstStep ? (
                                <>
                                    <button
                                        type="button"
                                        onClick={() => goToStep(1)}
                                        className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-[#00105B] hover:bg-[#000B42] dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-950 active:scale-[0.98] text-white text-sm font-bold shadow-lg shadow-[#00105B]/25 dark:shadow-black/40 transition"
                                    >
                                        Mulai Tur Bersama Tupi
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => markTutorialCompleted()}
                                        className="w-full sm:w-auto px-5 py-3 rounded-2xl text-xs sm:text-sm font-semibold text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#2A2A30] transition"
                                    >
                                        Lewati dulu
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        type="button"
                                        onClick={() => markTutorialCompleted('/dashboard?open_tx=1')}
                                        className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-[#00105B] hover:bg-[#000B42] dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-950 active:scale-[0.98] text-white text-sm font-bold shadow-lg shadow-[#00105B]/25 dark:shadow-black/40 transition"
                                    >
                                        Catat Transaksi Pertama
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => markTutorialCompleted('/dashboard')}
                                        className="w-full sm:w-auto px-5 py-3 rounded-2xl border border-slate-300 dark:border-[#32323A] text-xs sm:text-sm font-semibold text-slate-700 dark:text-zinc-200 hover:bg-slate-100 dark:hover:bg-[#2A2A30] transition"
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
                    <div
                        ref={cardRef}
                        className={`relative rounded-2xl sm:rounded-3xl bg-white dark:bg-[#1C1C20] shadow-[0_20px_50px_rgba(0,0,0,0.45)] p-3.5 sm:p-5 animate-tupi-spring border ${
                            isSpecial
                                ? 'border-amber-400/80 dark:border-amber-400/60 ring-1 ring-amber-400/30'
                                : isWalletGateActive
                                    ? 'border-amber-500/70 dark:border-amber-400/50 ring-1 ring-amber-400/20'
                                    : 'border-[#00105B]/35 dark:border-[#3E3E46]'
                        }`}
                    >
                        {/* Compact Grid: inline header avatar + full-width copy on mobile, pop-out full-body Tupi on desktop */}
                        <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 sm:gap-x-4 sm:gap-y-1 items-center sm:items-start">
                            <div className="sm:row-span-2 shrink-0 sm:-mt-12 sm:-ml-2 pointer-events-none select-none flex items-center justify-center">
                                <img
                                    src={stepPose}
                                    alt="Tupi Panduan Uangku"
                                    className={`h-12 w-12 sm:h-36 sm:w-auto object-contain drop-shadow-[0_6px_12px_rgba(15,23,42,0.28)] sm:drop-shadow-[0_10px_18px_rgba(15,23,42,0.4)] ${currentStep.animClass}`}
                                />
                            </div>

                            <div className="min-w-0">
                                <div className="flex items-center justify-between gap-2 mb-0.5 sm:mb-1">
                                    <span
                                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold truncate ${
                                            isSpecial || isWalletGateActive
                                                ? 'bg-amber-50 dark:bg-amber-500/15 border border-amber-300 dark:border-amber-500/35 text-amber-800 dark:text-amber-300'
                                                : isWalletStep && walletCreatedInTour
                                                    ? 'bg-emerald-50 dark:bg-emerald-500/15 border border-emerald-300 dark:border-emerald-500/35 text-emerald-700 dark:text-emerald-300'
                                                    : 'bg-[#00105B]/10 dark:bg-[#242429] border border-[#00105B]/20 dark:border-[#3E3E46] text-[#00105B] dark:text-zinc-200'
                                        }`}
                                    >
                                        {stepBadge}
                                    </span>
                                    {!isWalletGateActive && (
                                        <button
                                            type="button"
                                            onClick={() => markTutorialCompleted()}
                                            className="shrink-0 text-[11px] font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 transition px-1.5 py-0.5 rounded-lg"
                                        >
                                            Lewati
                                        </button>
                                    )}
                                </div>

                                <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white leading-snug">
                                    {stepTitle}
                                </h3>
                            </div>

                            <div className="col-span-2 sm:col-span-1 space-y-2">
                                <p className="text-xs sm:text-[13px] text-slate-600 dark:text-zinc-300 leading-relaxed">
                                    {stepDescription}
                                </p>

                                {isWalletGateActive && (
                                    <div className="flex flex-wrap items-center gap-2 pt-0.5">
                                        <button
                                            type="button"
                                            onClick={openWalletCreateModal}
                                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#00105B] hover:bg-[#000B42] dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-950 text-xs font-bold shadow-sm transition active:scale-95"
                                        >
                                            <PlusCircle className="w-3.5 h-3.5" />
                                            <span>Daftarkan Dompet Sekarang</span>
                                        </button>
                                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 dark:text-amber-300">
                                            <Lock className="w-3 h-3 shrink-0" />
                                            <span>Wajib diisi untuk lanjut</span>
                                        </span>
                                    </div>
                                )}

                                {isWalletStep && !isWalletGateActive && walletCreatedInTour && (
                                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-500/15 border border-emerald-200 dark:border-emerald-500/30 text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
                                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                                        <span>Dompet berhasil ditambahkan! Tekan Lanjut.</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Full-width Progress & Navigation Footer */}
                        <div className="mt-2.5 sm:mt-3.5 pt-2.5 sm:pt-3 border-t border-slate-100 dark:border-[#2C2C32] flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2.5 min-w-0">
                                <span className="text-[11px] font-bold text-slate-500 dark:text-zinc-400 tabular-nums whitespace-nowrap">
                                    Langkah {stepIndex} / {totalGuidedSteps}
                                </span>
                                <div className="hidden sm:block w-20 h-1.5 rounded-full bg-slate-200 dark:bg-[#2C2C32] overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-300 ${
                                            isSpecial ? 'bg-amber-400' : 'bg-[#00105B] dark:bg-zinc-200'
                                        }`}
                                        style={{ width: `${Math.round((stepIndex / totalGuidedSteps) * 100)}%` }}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                                <button
                                    type="button"
                                    onClick={() => goToStep(stepIndex - 1)}
                                    className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-[#32323A] text-xs font-semibold text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-[#2A2A30] transition whitespace-nowrap"
                                >
                                    Kembali
                                </button>
                                <button
                                    type="button"
                                    disabled={isWalletGateActive}
                                    onClick={() => goToStep(stepIndex + 1)}
                                    className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                                        isWalletGateActive
                                            ? 'bg-slate-200 dark:bg-[#2A2A30] text-slate-400 dark:text-zinc-500 cursor-not-allowed'
                                            : isSpecial
                                                ? 'bg-amber-600 hover:bg-amber-700 active:scale-95 text-white shadow-sm shadow-amber-600/25'
                                                : 'bg-[#00105B] hover:bg-[#000B42] dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-950 active:scale-95 text-white shadow-sm shadow-[#00105B]/25 dark:shadow-black/40'
                                    }`}
                                >
                                    {isWalletGateActive && <Lock className="w-3 h-3 shrink-0" />}
                                    <span>Lanjut</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

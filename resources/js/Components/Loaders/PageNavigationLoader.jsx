import { router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

function getLoadingLabel(url) {
    const pathname = url?.pathname || '';
    if (pathname.startsWith('/dashboard')) return 'Membuka Dashboard...';
    if (pathname.startsWith('/transactions')) return 'Membuka Riwayat Transaksi...';
    if (/^\/wallets\/\d+/.test(pathname)) return 'Membuka Detail Dompet...';
    if (pathname.startsWith('/wallets')) return 'Membuka Dompet & Rekening...';
    if (pathname.startsWith('/reports')) return 'Menyiapkan Laporan & Grafik...';
    if (pathname.startsWith('/profile')) return 'Membuka Pengaturan Akun...';
    if (pathname.startsWith('/login') || pathname.startsWith('/register')) return 'Menyiapkan halaman...';
    return 'Memuat halaman...';
}

export default function PageNavigationLoader() {
    const [visible, setVisible] = useState(false);
    const [label, setLabel] = useState('Memuat halaman...');

    const shownAtRef = useRef(0);
    const hideTimerRef = useRef(null);
    const safetyTimerRef = useRef(null);

    // Preload Tupi pose so it renders instantaneously on navigation
    useEffect(() => {
        const img = new Image();
        img.src = '/assets/tupi/tupi-wave.png';
    }, []);

    useEffect(() => {
        const clearTimers = () => {
            if (hideTimerRef.current) {
                clearTimeout(hideTimerRef.current);
                hideTimerRef.current = null;
            }
            if (safetyTimerRef.current) {
                clearTimeout(safetyTimerRef.current);
                safetyTimerRef.current = null;
            }
        };

        const unlistenStart = router.on('start', (event) => {
            const visit = event?.detail?.visit;
            if (!visit) return;

            // Skip background link prefetches
            if (visit.prefetch) return;

            // Only show Page Navigation Loader for GET route switches
            // (POST/PUT/DELETE transaction & wallet saves use GoldCoinLoader)
            if (visit.method !== 'get') return;

            // Skip same-page filter updates (e.g., timeframe switching inside Report)
            if (
                typeof window !== 'undefined' &&
                visit.preserveState &&
                visit.url?.pathname === window.location.pathname
            ) {
                return;
            }

            clearTimers();
            shownAtRef.current = Date.now();
            setLabel(getLoadingLabel(visit.url));
            setVisible(true);

            // Safety auto-dismiss in case navigation is cancelled externally
            safetyTimerRef.current = setTimeout(() => {
                setVisible(false);
            }, 15000);
        });

        const handleDone = () => {
            if (!shownAtRef.current) return;

            const elapsed = Date.now() - shownAtRef.current;
            const minVisibleMs = 280;
            const remaining = Math.max(0, minVisibleMs - elapsed);

            clearTimers();
            hideTimerRef.current = setTimeout(() => {
                shownAtRef.current = 0;
                setVisible(false);
            }, remaining);
        };

        const unlistenFinish = router.on('finish', handleDone);
        const unlistenInvalid = router.on('invalid', handleDone);
        const unlistenError = router.on('error', handleDone);

        return () => {
            clearTimers();
            unlistenStart();
            unlistenFinish();
            unlistenInvalid();
            unlistenError();
        };
    }, []);

    if (!visible || typeof document === 'undefined') return null;

    return createPortal(
        <div
            className="fixed inset-0 z-[95] flex items-center justify-center p-4 bg-slate-900/25 dark:bg-[#070D19]/60 backdrop-blur-[2px] transition-opacity duration-150"
            role="status"
            aria-live="polite"
            aria-label={label}
        >
            <div className="relative flex flex-col items-center rounded-3xl bg-white/95 dark:bg-[#0E1A33]/95 border border-slate-200 dark:border-[#1E3158] shadow-2xl px-8 py-6 min-w-[240px] max-w-[90vw] text-center">
                {/* Ambient subtle emerald glow */}
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-32 h-32 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none" />

                {/* Tupi Bouncing Mascot + Shadow Ellipse */}
                <div className="relative flex flex-col items-center pt-3 pb-1 pointer-events-none select-none">
                    <img
                        src="/assets/tupi/tupi-wave.png"
                        alt="Tupi Memuat"
                        className="h-24 sm:h-28 w-auto object-contain animate-tupi-bounce drop-shadow-[0_10px_14px_rgba(15,23,42,0.22)]"
                    />
                    <div className="mt-1 w-16 h-2.5 rounded-full bg-slate-900/20 dark:bg-black/50 blur-[2px] animate-tupi-shadow" />
                </div>

                {/* Status Label */}
                <p className="mt-3 text-xs sm:text-sm font-bold text-slate-800 dark:text-white tracking-tight">
                    {label}
                </p>

                {/* Three Animated Progress Dots */}
                <div className="mt-2.5 flex items-center justify-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-tupi-dot-1" />
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-tupi-dot-2" />
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-tupi-dot-3" />
                </div>
            </div>
        </div>,
        document.body
    );
}

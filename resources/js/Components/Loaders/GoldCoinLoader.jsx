import { createPortal } from 'react-dom';

export default function GoldCoinLoader({
    show = false,
    message = 'Menyimpan data...',
    subMessage = 'Mohon tunggu sebentar',
}) {
    if (!show || typeof document === 'undefined') return null;

    return createPortal(
        <div
            className="fixed inset-0 z-[95] flex items-center justify-center p-4 bg-slate-900/35 dark:bg-[#070D19]/70 backdrop-blur-[2px]"
            role="status"
            aria-live="polite"
            aria-label={message}
        >
            <div className="relative flex flex-col items-center rounded-3xl bg-white/95 dark:bg-[#0E1A33]/95 border border-slate-200 dark:border-[#1E3158] shadow-2xl px-8 py-7 min-w-[240px] max-w-[90vw] text-center">
                {/* Pulsing Emerald Halo Ring + 3D Spinning Gold Rp Coin */}
                <div
                    className="relative w-24 h-24 rounded-full border-2 border-emerald-500/40 bg-emerald-500/5 flex items-center justify-center animate-tupi-ring"
                    style={{ perspective: '700px' }}
                >
                    <svg
                        viewBox="0 0 80 80"
                        className="w-16 h-16 animate-coin-spin drop-shadow-[0_6px_12px_rgba(217,119,6,0.4)]"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <defs>
                            <linearGradient id="uangkuCoinOuter" x1="10" y1="8" x2="70" y2="72" gradientUnits="userSpaceOnUse">
                                <stop offset="0%" stopColor="#FEF08A" />
                                <stop offset="45%" stopColor="#F59E0B" />
                                <stop offset="100%" stopColor="#B45309" />
                            </linearGradient>
                            <linearGradient id="uangkuCoinInner" x1="16" y1="16" x2="64" y2="64" gradientUnits="userSpaceOnUse">
                                <stop offset="0%" stopColor="#FDE047" />
                                <stop offset="60%" stopColor="#FBBF24" />
                                <stop offset="100%" stopColor="#D97706" />
                            </linearGradient>
                        </defs>

                        {/* Outer Coin Edge */}
                        <circle cx="40" cy="40" r="36" fill="url(#uangkuCoinOuter)" stroke="#92400E" strokeWidth="2.5" />

                        {/* Inner Coin Face */}
                        <circle cx="40" cy="40" r="29" fill="url(#uangkuCoinInner)" stroke="#FEF9C3" strokeOpacity="0.65" strokeWidth="1.5" />

                        {/* Decorative Dashed Rim */}
                        <circle
                            cx="40"
                            cy="40"
                            r="24.5"
                            stroke="#92400E"
                            strokeOpacity="0.35"
                            strokeWidth="1.2"
                            strokeDasharray="3 3"
                        />

                        {/* Bold Rp Symbol */}
                        <text
                            x="40"
                            y="48"
                            textAnchor="middle"
                            fill="#78350F"
                            fontSize="24"
                            fontWeight="900"
                            fontFamily="Plus Jakarta Sans, system-ui, sans-serif"
                            letterSpacing="-0.5"
                        >
                            Rp
                        </text>
                        <text
                            x="40"
                            y="46.8"
                            textAnchor="middle"
                            fill="#FEF9C3"
                            fillOpacity="0.45"
                            fontSize="24"
                            fontWeight="900"
                            fontFamily="Plus Jakarta Sans, system-ui, sans-serif"
                            letterSpacing="-0.5"
                        >
                            Rp
                        </text>
                    </svg>
                </div>

                {/* Contextual Status Text */}
                <p className="mt-4 text-sm font-extrabold text-slate-900 dark:text-white tracking-tight">
                    {message}
                </p>
                <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                    {subMessage}
                </p>
            </div>
        </div>,
        document.body
    );
}

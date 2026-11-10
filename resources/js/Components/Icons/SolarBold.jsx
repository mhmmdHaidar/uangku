import React from 'react';

/**
 * Solar Bold & Bold Duotone Icon Library
 * Designed to seamlessly match the chubby, rounded, friendly aesthetic of the Uangku Mascot & Favicon.
 * All icons support className (e.g. "w-5 h-5 text-emerald-500") and inherit color via currentColor.
 * Duotone elements use 40% opacity for soft layered depth.
 */

// 1. Dashboard / Widget
export function DashboardBold({ className = 'w-5 h-5', ...props }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg" {...props}>
            <rect x="2" y="2" width="9" height="9" rx="3.5" fill="currentColor" />
            <rect x="13" y="2" width="9" height="5" rx="2.5" fill="currentColor" fillOpacity="0.4" />
            <rect x="2" y="13" width="9" height="9" rx="3.5" fill="currentColor" fillOpacity="0.4" />
            <rect x="13" y="9" width="9" height="13" rx="3.5" fill="currentColor" />
        </svg>
    );
}

// 2. Receipt / Riwayat Transaksi
export function ReceiptTextBold({ className = 'w-5 h-5', ...props }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg" {...props}>
            <path
                d="M3 7.5C3 4.46243 5.46243 2 8.5 2H15.5C18.5376 2 21 4.46243 21 7.5V19.25C21 20.7688 19.2312 21.5833 18.0833 20.5833L16.5 19.2083L14.4167 20.5833L12 19.2083L9.58333 20.5833L7.5 19.2083L5.91667 20.5833C4.76878 21.5833 3 20.7688 3 19.25V7.5Z"
                fill="currentColor"
            />
            <path
                d="M7.5 7H16.5M7.5 11H16.5M7.5 15H12"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                fillOpacity="0.8"
            />
        </svg>
    );
}

// 3. Wallet / Dompet
export function WalletBold({ className = 'w-5 h-5', ...props }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg" {...props}>
            <path
                d="M2 8.5C2 5.46243 4.46243 3 7.5 3H16.5C19.5376 3 22 5.46243 22 8.5V9H17C14.7909 9 13 10.7909 13 13C13 15.2091 14.7909 17 17 17H22V17.5C22 20.5376 19.5376 23 16.5 23H7.5C4.46243 23 2 20.5376 2 17.5V8.5Z"
                fill="currentColor"
            />
            <path
                d="M17 10.5H22V15.5H17C15.6193 15.5 14.5 14.3807 14.5 13C14.5 11.6193 15.6193 10.5 17 10.5Z"
                fill="currentColor"
                fillOpacity="0.4"
            />
            <circle cx="18.5" cy="13" r="1.25" fill="white" />
        </svg>
    );
}

// 4. Chart / Laporan
export function ChartBold({ className = 'w-5 h-5', ...props }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg" {...props}>
            <rect x="2" y="3" width="20" height="18" rx="6" fill="currentColor" fillOpacity="0.3" />
            <path
                d="M6 16.5V14C6 13.4477 6.44772 13 7 13C7.55228 13 8 13.4477 8 14V16.5C8 17.0523 7.55228 17.5 7 17.5C6.44772 17.5 6 17.0523 6 16.5ZM11 16.5V9C11 8.44772 11.4477 8 12 8C12.5523 8 13 8.44772 13 9V16.5C13 17.0523 12.5523 17.5 12 17.5C11.4477 17.5 11 17.0523 11 16.5ZM16 16.5V11.5C16 10.9477 16.4477 10.5 17 10.5C17.5523 10.5 18 10.9477 18 11.5V16.5C18 17.0523 17.5523 17.5 17 17.5C16.4477 17.5 16 17.0523 16 16.5Z"
                fill="currentColor"
            />
        </svg>
    );
}

// 5. Coins / Uang / Saldo
export function CoinsBold({ className = 'w-5 h-5', ...props }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg" {...props}>
            {/* Back coin */}
            <circle cx="15.5" cy="8.5" r="6.5" fill="currentColor" fillOpacity="0.4" />
            {/* Front coin */}
            <circle cx="9" cy="14" r="7" fill="currentColor" />
            <circle cx="9" cy="14" r="4.5" stroke="white" strokeWidth="1.5" strokeOpacity="0.7" fill="none" />
            <path
                d="M9 11.5V16.5M10.25 12.75C10.25 12.75 9.75 12.25 9 12.25C8.25 12.25 7.75 12.75 7.75 13.25C7.75 13.85 8.35 14.15 9 14.35C9.65 14.55 10.25 14.85 10.25 15.45C10.25 16.05 9.65 16.45 9 16.45C8.25 16.45 7.75 15.95 7.75 15.95"
                stroke="white"
                strokeWidth="1.25"
                strokeLinecap="round"
            />
        </svg>
    );
}

// 6. Income / Arrow Down Left
export function IncomeBold({ className = 'w-5 h-5', ...props }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg" {...props}>
            <rect x="2" y="2" width="20" height="20" rx="6.5" fill="currentColor" fillOpacity="0.25" />
            <path
                d="M8 9.5C8 8.67157 8.67157 8 9.5 8L15 8C15.8284 8 16.5 8.67157 16.5 9.5C16.5 10.3284 15.8284 11 15 11L11.6213 11L16.0607 15.4393C16.6464 16.0251 16.6464 16.9749 16.0607 17.5607C15.4749 18.1464 14.5251 18.1464 13.9393 17.5607L9.5 13.1213L9.5 16.5C9.5 17.3284 8.82843 18 8 18C7.17157 18 6.5 17.3284 6.5 16.5L6.5 11C6.5 10.1716 7.17157 9.5 8 9.5Z"
                fill="currentColor"
            />
        </svg>
    );
}

// 7. Expense / Arrow Up Right
export function ExpenseBold({ className = 'w-5 h-5', ...props }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg" {...props}>
            <rect x="2" y="2" width="20" height="20" rx="6.5" fill="currentColor" fillOpacity="0.25" />
            <path
                d="M16 14.5C16 15.3284 15.3284 16 14.5 16C13.6716 16 13 15.3284 13 14.5L13 11.1213L8.56066 15.5607C7.97487 16.1464 7.02513 16.1464 6.43934 15.5607C5.85355 14.9749 5.85355 14.0251 6.43934 13.4393L10.8787 9L7.5 9C6.67157 9 6 8.32843 6 7.5C6 6.67157 6.67157 6 7.5 6L14.5 6C15.3284 6 16 6.67157 16 7.5L16 14.5Z"
                fill="currentColor"
            />
        </svg>
    );
}

// 8. Bank Card / Rekening Bank
export function CardBold({ className = 'w-5 h-5', ...props }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg" {...props}>
            <rect x="2" y="4" width="20" height="16" rx="5" fill="currentColor" />
            <rect x="2" y="8" width="20" height="3.5" fill="black" fillOpacity="0.25" />
            <rect x="5" y="14.5" width="4" height="2.5" rx="1" fill="white" fillOpacity="0.8" />
            <circle cx="17.5" cy="15.75" r="1.5" fill="white" fillOpacity="0.5" />
            <circle cx="15.5" cy="15.75" r="1.5" fill="white" fillOpacity="0.5" />
        </svg>
    );
}

// 9. Cash / Banknote (Uang Tunai)
export function BanknoteBold({ className = 'w-5 h-5', ...props }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg" {...props}>
            <rect x="2" y="5" width="20" height="14" rx="4.5" fill="currentColor" />
            <circle cx="12" cy="12" r="3.25" fill="white" fillOpacity="0.85" />
            <circle cx="5" cy="12" r="1.2" fill="white" fillOpacity="0.4" />
            <circle cx="19" cy="12" r="1.2" fill="white" fillOpacity="0.4" />
        </svg>
    );
}

// 10. Smartphone / E-Wallet
export function SmartphoneBold({ className = 'w-5 h-5', ...props }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg" {...props}>
            <rect x="5" y="2" width="14" height="20" rx="4.5" fill="currentColor" />
            <rect x="7" y="5" width="10" height="12" rx="2" fill="white" fillOpacity="0.85" />
            <circle cx="12" cy="19.25" r="1" fill="white" />
        </svg>
    );
}

// 11. Trending Up / Investasi
export function TrendingUpBold({ className = 'w-5 h-5', ...props }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg" {...props}>
            <path
                d="M2 17.5C2 16.6716 2.67157 16 3.5 16H6.5C7.32843 16 8 16.6716 8 17.5V19.5C8 20.3284 7.32843 21 6.5 21H3.5C2.67157 21 2 20.3284 2 19.5V17.5Z"
                fill="currentColor"
                fillOpacity="0.4"
            />
            <path
                d="M9 13.5C9 12.6716 9.67157 12 10.5 12H13.5C14.3284 12 15 12.6716 15 13.5V19.5C15 20.3284 14.3284 21 13.5 21H10.5C9.67157 21 9 20.3284 9 19.5V13.5Z"
                fill="currentColor"
                fillOpacity="0.6"
            />
            <path
                d="M16 8.5C16 7.67157 16.6716 7 17.5 7H20.5C21.3284 7 22 7.67157 22 8.5V19.5C22 20.3284 21.3284 21 20.5 21H17.5C16.6716 21 16 20.3284 16 19.5V8.5Z"
                fill="currentColor"
            />
            <path
                d="M3 11L9.5 5.5L14 9.5L20 3M20 3H16M20 3V7"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

// 12. Sparkles / Stars (Matching mascot stars)
export function SparklesBold({ className = 'w-5 h-5', ...props }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg" {...props}>
            <path
                d="M12 2C12.4 6.5 15.5 9.6 20 10C15.5 10.4 12.4 13.5 12 18C11.6 13.5 8.5 10.4 4 10C8.5 9.6 11.6 6.5 12 2Z"
                fill="currentColor"
            />
            <path
                d="M19 15C19.2 17.2 20.8 18.8 23 19C20.8 19.2 19.2 20.8 19 23C18.8 20.8 17.2 19.2 15 19C17.2 18.8 18.8 17.2 19 15Z"
                fill="currentColor"
                fillOpacity="0.5"
            />
        </svg>
    );
}

// 13. Search / Magnifier
export function SearchBold({ className = 'w-5 h-5', ...props }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg" {...props}>
            <circle cx="11" cy="11" r="7.5" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="2.5" />
            <path
                d="M16.5 16.5L21 21"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
            />
        </svg>
    );
}

// 14. Filter / Tuning
export function FilterBold({ className = 'w-5 h-5', ...props }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg" {...props}>
            <path
                d="M3 6.5C3 5.67157 3.67157 5 4.5 5H19.5C20.3284 5 21 5.67157 21 6.5C21 7.32843 20.3284 8 19.5 8H4.5C3.67157 8 3 7.32843 3 6.5Z"
                fill="currentColor"
            />
            <path
                d="M6 12C6 11.1716 6.67157 10.5 7.5 10.5H16.5C17.3284 10.5 18 11.1716 18 12C18 12.8284 17.3284 13.5 16.5 13.5H7.5C6.67157 13.5 6 12.8284 6 12Z"
                fill="currentColor"
                fillOpacity="0.6"
            />
            <path
                d="M9 17.5C9 16.6716 9.67157 16 10.5 16H13.5C14.3284 16 15 16.6716 15 17.5C15 18.3284 14.3284 19 13.5 19H10.5C9.67157 19 9 18.3284 9 17.5Z"
                fill="currentColor"
                fillOpacity="0.4"
            />
        </svg>
    );
}

// 15. Calendar
export function CalendarBold({ className = 'w-5 h-5', ...props }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg" {...props}>
            <rect x="2" y="4" width="20" height="18" rx="5" fill="currentColor" />
            <path d="M2 9.5H22" stroke="white" strokeWidth="2" strokeOpacity="0.3" />
            <rect x="6.5" y="2" width="2.5" height="4" rx="1.25" fill="white" />
            <rect x="15" y="2" width="2.5" height="4" rx="1.25" fill="white" />
            <circle cx="7" cy="14" r="1.2" fill="white" fillOpacity="0.8" />
            <circle cx="12" cy="14" r="1.2" fill="white" fillOpacity="0.8" />
            <circle cx="17" cy="14" r="1.2" fill="white" fillOpacity="0.8" />
            <circle cx="7" cy="18" r="1.2" fill="white" fillOpacity="0.8" />
            <circle cx="12" cy="18" r="1.2" fill="white" fillOpacity="0.8" />
            <circle cx="17" cy="18" r="1.2" fill="white" fillOpacity="0.8" />
        </svg>
    );
}

// 16. Tag
export function TagBold({ className = 'w-5 h-5', ...props }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg" {...props}>
            <path
                d="M12.5 2.5H6.5C4.29086 2.5 2.5 4.29086 2.5 6.5V12.5C2.5 13.5609 2.92143 14.5783 3.67157 15.3284L10.6716 22.3284C12.2337 23.8905 14.7663 23.8905 16.3284 22.3284L22.3284 16.3284C23.8905 14.7663 23.8905 12.2337 22.3284 10.6716L15.3284 3.67157C14.5783 2.92143 13.5609 2.5 12.5 2.5Z"
                fill="currentColor"
            />
            <circle cx="7.5" cy="7.5" r="2" fill="white" />
        </svg>
    );
}

// 17. Eye (Lihat Detail)
export function EyeBold({ className = 'w-5 h-5', ...props }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg" {...props}>
            <path
                d="M12 4.5C6.5 4.5 2 12 2 12C2 12 6.5 19.5 12 19.5C17.5 19.5 22 12 22 12C22 12 17.5 4.5 12 4.5Z"
                fill="currentColor"
                fillOpacity="0.3"
            />
            <circle cx="12" cy="12" r="4.5" fill="currentColor" />
            <circle cx="13.5" cy="10.5" r="1.5" fill="white" />
        </svg>
    );
}

// 18. Edit / Pen
export function EditBold({ className = 'w-5 h-5', ...props }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg" {...props}>
            <path
                d="M13.5 4L19.5 10L7.5 22H2V16.5L13.5 4Z"
                fill="currentColor"
            />
            <path
                d="M17 2.5L21.5 7L19.5 9L15 4.5L17 2.5Z"
                fill="currentColor"
                fillOpacity="0.6"
            />
        </svg>
    );
}

// 19. Trash
export function TrashBold({ className = 'w-5 h-5', ...props }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg" {...props}>
            <path
                d="M4 6.5H20M9 3H15C15.5523 3 16 3.44772 16 4V6.5H8V4C8 3.44772 8.44772 3 9 3Z"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
            />
            <path
                d="M5 6.5L6.5 19.5C6.7 21 8 22 9.5 22H14.5C16 22 17.3 21 17.5 19.5L19 6.5"
                fill="currentColor"
                fillOpacity="0.4"
            />
        </svg>
    );
}

// 20. Plus / Add Circle
export function PlusBold({ className = 'w-5 h-5', ...props }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg" {...props}>
            <circle cx="12" cy="12" r="10" fill="currentColor" />
            <path
                d="M12 7V17M7 12H17"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
            />
        </svg>
    );
}

// 21. Check Circle
export function CheckCircleBold({ className = 'w-5 h-5', ...props }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg" {...props}>
            <circle cx="12" cy="12" r="10" fill="currentColor" />
            <path
                d="M7.5 12L10.5 15L16.5 9"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

// 22. Export / Download
export function ExportBold({ className = 'w-5 h-5', ...props }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg" {...props}>
            <path
                d="M4 14V17.5C4 19.433 5.567 21 7.5 21H16.5C18.433 21 20 19.433 20 17.5V14"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
            />
            <path
                d="M12 3V15M12 15L8 11M12 15L16 11"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

// 23. Document / Notes
export function NotesBold({ className = 'w-5 h-5', ...props }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg" {...props}>
            <path
                d="M3 7.5C3 4.46243 5.46243 2 8.5 2H13.5L21 9.5V17.5C21 20.5376 18.5376 23 15.5 23H8.5C5.46243 23 3 20.5376 3 17.5V7.5Z"
                fill="currentColor"
            />
            <path
                d="M13 2V8C13 9.10457 13.8954 10 15 10H21"
                fill="currentColor"
                fillOpacity="0.4"
            />
            <path d="M7 14H17M7 18H13" stroke="white" strokeWidth="2" strokeLinecap="round" />
        </svg>
    );
}

// 24. Food / Kuliner
export function FoodBold({ className = 'w-5 h-5', ...props }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg" {...props}>
            <path
                d="M2 9.5C2 7.5 3.5 5 6 5C8.5 5 9.5 7 12 7C14.5 7 15.5 5 18 5C20.5 5 22 7.5 22 9.5C22 14.5 17.5 19 12 19C6.5 19 2 14.5 2 9.5Z"
                fill="currentColor"
            />
            <path
                d="M5 21H19"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
            />
        </svg>
    );
}

// 25. Transport / Car
export function CarBold({ className = 'w-5 h-5', ...props }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg" {...props}>
            <path
                d="M3 12L4.8 6.5C5.2 5.5 6.2 5 7.3 5H16.7C17.8 5 18.8 5.5 19.2 6.5L21 12H3Z"
                fill="currentColor"
                fillOpacity="0.5"
            />
            <rect x="2" y="11" width="20" height="7" rx="3" fill="currentColor" />
            <circle cx="6.5" cy="18" r="2.5" fill="currentColor" stroke="white" strokeWidth="1.5" />
            <circle cx="17.5" cy="18" r="2.5" fill="currentColor" stroke="white" strokeWidth="1.5" />
            <circle cx="6.5" cy="13.5" r="1.2" fill="white" />
            <circle cx="17.5" cy="13.5" r="1.2" fill="white" />
        </svg>
    );
}

// 26. Shopping Bag
export function ShoppingBagBold({ className = 'w-5 h-5', ...props }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg" {...props}>
            <rect x="3" y="7" width="18" height="14" rx="4.5" fill="currentColor" />
            <path
                d="M8 8V6C8 3.79086 9.79086 2 12 2C14.2091 2 16 3.79086 16 6V8"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
            />
            <circle cx="12" cy="13" r="2" fill="white" fillOpacity="0.8" />
        </svg>
    );
}

// 27. Salary / Gaji (Briefcase)
export function SalaryBold({ className = 'w-5 h-5', ...props }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg" {...props}>
            <rect x="2" y="7" width="20" height="14" rx="4" fill="currentColor" />
            <path
                d="M8 7V5C8 3.89543 8.89543 3 10 3H14C15.1046 3 16 3.89543 16 5V7"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
            />
            <rect x="10" y="11" width="4" height="3" rx="1" fill="white" />
        </svg>
    );
}

// 28. Utility / Listrik (Bolt)
export function BoltBold({ className = 'w-5 h-5', ...props }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg" {...props}>
            <path
                d="M11 2L4 13H11L9.5 22L19 10H12.5L14.5 2H11Z"
                fill="currentColor"
            />
        </svg>
    );
}

// 29. Health (HeartPulse)
export function HealthBold({ className = 'w-5 h-5', ...props }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg" {...props}>
            <path
                d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z"
                fill="currentColor"
            />
            <path
                d="M6.5 10H8.5L10 7L13 13L14.5 10H17.5"
                stroke="white"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

// 30. Education (Graduation Cap)
export function EducationBold({ className = 'w-5 h-5', ...props }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg" {...props}>
            <path
                d="M12 3L2 8.5L12 14L22 8.5L12 3Z"
                fill="currentColor"
            />
            <path
                d="M6 11V16C6 18.5 8.5 20.5 12 20.5C15.5 20.5 18 18.5 18 16V11L12 14.5L6 11Z"
                fill="currentColor"
                fillOpacity="0.5"
            />
        </svg>
    );
}

// 31. Laptop / Tech / Freelance
export function LaptopBold({ className = 'w-5 h-5', ...props }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg" {...props}>
            <rect x="4" y="4" width="16" height="11" rx="2.5" fill="currentColor" />
            <path
                d="M2 18C2 16.8954 2.89543 16 4 16H20C21.1046 16 22 16.8954 22 18V19C22 19.5523 21.5523 20 21 20H3C2.44772 20 2 19.5523 2 19V18Z"
                fill="currentColor"
                fillOpacity="0.5"
            />
            <rect x="6" y="6" width="12" height="7" rx="1" fill="white" fillOpacity="0.8" />
        </svg>
    );
}


import React from 'react';

/**
 * Authentic Phosphor Duotone Icon System
 * Standard 256x256 viewBox with two-tone visual depth:
 * - 20% opacity soft color fill on secondary geometry
 * - Rounded 16px stroke outlines with round caps and joints
 * Color is dynamically inherited from parent via currentColor.
 */

// 1. Dashboard (SquaresFour)
export function SquaresFourDuotone({ className = 'w-5 h-5', ...props }) {
    return (
        <svg viewBox="0 0 256 256" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <rect x="40" y="40" width="72" height="72" rx="16" fill="currentColor" opacity="0.2" />
            <rect x="144" y="40" width="72" height="72" rx="16" fill="currentColor" opacity="0.2" />
            <rect x="40" y="144" width="72" height="72" rx="16" fill="currentColor" opacity="0.2" />
            <rect x="144" y="144" width="72" height="72" rx="16" fill="currentColor" opacity="0.2" />
            <rect x="40" y="40" width="72" height="72" rx="16" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="144" y="40" width="72" height="72" rx="16" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="40" y="144" width="72" height="72" rx="16" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="144" y="144" width="72" height="72" rx="16" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

// 2. Receipt / Riwayat Transaksi
export function ReceiptDuotone({ className = 'w-5 h-5', ...props }) {
    return (
        <svg viewBox="0 0 256 256" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path
                d="M32 208V56a16 16 0 0 1 16-16h160a16 16 0 0 1 16 16v152l-28-16-28 16-28-16-28 16-28-16-28 16-24-16"
                fill="currentColor"
                opacity="0.2"
            />
            <path
                d="M32 208V56a16 16 0 0 1 16-16h160a16 16 0 0 1 16 16v152l-28-16-28 16-28-16-28 16-28-16-28 16-24-16"
                stroke="currentColor"
                strokeWidth="16"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <line x1="80" y1="88" x2="176" y2="88" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="80" y1="128" x2="176" y2="128" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="80" y1="168" x2="136" y2="168" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

// 3. Wallet / Dompet
export function WalletDuotone({ className = 'w-5 h-5', ...props }) {
    return (
        <svg viewBox="0 0 256 256" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path
                d="M40 80V200a16 16 0 0 0 16 16h160a16 16 0 0 0 16-16V80a16 16 0 0 0-16-16H56a16 16 0 0 0-16 16z"
                fill="currentColor"
                opacity="0.2"
            />
            <path
                d="M40 80a16 16 0 0 1 16-16h144V48a16 16 0 0 0-16-16H48a16 16 0 0 0-16 16v136a16 16 0 0 0 8 13.9"
                stroke="currentColor"
                strokeWidth="16"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <rect x="40" y="64" width="192" height="152" rx="16" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M184 140a16 16 0 1 0 16 16 16 16 0 0 0-16-16z" fill="currentColor" />
        </svg>
    );
}

// 4. ChartBar / Laporan & Grafik
export function ChartBarDuotone({ className = 'w-5 h-5', ...props }) {
    return (
        <svg viewBox="0 0 256 256" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <rect x="40" y="128" width="48" height="88" rx="8" fill="currentColor" opacity="0.2" />
            <rect x="104" y="80" width="48" height="136" rx="8" fill="currentColor" opacity="0.2" />
            <rect x="168" y="40" width="48" height="176" rx="8" fill="currentColor" opacity="0.2" />
            <line x1="224" y1="216" x2="32" y2="216" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="40" y="128" width="48" height="88" rx="8" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="104" y="80" width="48" height="136" rx="8" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="168" y="40" width="48" height="176" rx="8" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

// 5. Coins / Total Saldo Emas
export function CoinsDuotone({ className = 'w-5 h-5', ...props }) {
    return (
        <svg viewBox="0 0 256 256" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <circle cx="104" cy="152" r="64" fill="currentColor" opacity="0.2" />
            <path d="M104 88a64 64 0 1 1-64 64 64 64 0 0 1 64-64z" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
            <path
                d="M104 40a64 64 0 0 1 64 64 64 64 0 0 1-16 42.4"
                stroke="currentColor"
                strokeWidth="16"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M152 40a64 64 0 0 1 64 64 64 64 0 0 1-32 55.4"
                stroke="currentColor"
                strokeWidth="16"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <line x1="104" y1="128" x2="104" y2="176" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="80" y1="152" x2="128" y2="152" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

// 6. ArrowDownLeft / Pemasukan
export function ArrowDownLeftDuotone({ className = 'w-5 h-5', ...props }) {
    return (
        <svg viewBox="0 0 256 256" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <circle cx="128" cy="128" r="96" fill="currentColor" opacity="0.15" />
            <circle cx="128" cy="128" r="96" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="168" y1="88" x2="96" y2="160" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
            <polyline points="160 160 96 160 96 96" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

// 7. ArrowUpRight / Pengeluaran
export function ArrowUpRightDuotone({ className = 'w-5 h-5', ...props }) {
    return (
        <svg viewBox="0 0 256 256" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <circle cx="128" cy="128" r="96" fill="currentColor" opacity="0.15" />
            <circle cx="128" cy="128" r="96" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="88" y1="168" x2="160" y2="96" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
            <polyline points="96 96 160 96 160 160" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

// 8. TrendUp / Investasi & Alokasi
export function TrendUpDuotone({ className = 'w-5 h-5', ...props }) {
    return (
        <svg viewBox="0 0 256 256" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <polygon points="232 56 232 120 168 120 232 56" fill="currentColor" opacity="0.2" />
            <polyline points="232 56 136 152 96 112 24 184" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
            <polyline points="168 56 232 56 232 120" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

// 9. CreditCard / Rekening Bank
export function CreditCardDuotone({ className = 'w-5 h-5', ...props }) {
    return (
        <svg viewBox="0 0 256 256" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <rect x="24" y="56" width="208" height="144" rx="16" fill="currentColor" opacity="0.2" />
            <rect x="24" y="56" width="208" height="144" rx="16" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="24" y1="96" x2="232" y2="96" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="60" y="144" width="40" height="24" rx="4" fill="currentColor" />
        </svg>
    );
}

// 10. Money / Uang Tunai (Cash)
export function MoneyDuotone({ className = 'w-5 h-5', ...props }) {
    return (
        <svg viewBox="0 0 256 256" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <rect x="24" y="64" width="208" height="128" rx="16" fill="currentColor" opacity="0.2" />
            <circle cx="128" cy="128" r="32" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="24" y="64" width="208" height="128" rx="16" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="56" cy="128" r="8" fill="currentColor" />
            <circle cx="200" cy="128" r="8" fill="currentColor" />
        </svg>
    );
}

// 11. DeviceMobile / E-Wallet
export function DeviceMobileDuotone({ className = 'w-5 h-5', ...props }) {
    return (
        <svg viewBox="0 0 256 256" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <rect x="64" y="24" width="128" height="208" rx="24" fill="currentColor" opacity="0.2" />
            <rect x="64" y="24" width="128" height="208" rx="24" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="64" y1="64" x2="192" y2="64" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="64" y1="184" x2="192" y2="184" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="128" cy="204" r="6" fill="currentColor" />
        </svg>
    );
}

// 12. Sparkle / Kilau Maskot
export function SparkleDuotone({ className = 'w-5 h-5', ...props }) {
    return (
        <svg viewBox="0 0 256 256" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path
                d="M128 24l22.4 75.2L224 128l-73.6 28.8L128 232l-22.4-75.2L32 128l73.6-28.8L128 24z"
                fill="currentColor"
                opacity="0.2"
            />
            <path
                d="M128 24l22.4 75.2L224 128l-73.6 28.8L128 232l-22.4-75.2L32 128l73.6-28.8L128 24z"
                stroke="currentColor"
                strokeWidth="16"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

// 13. Calendar / Tanggal & Periode
export function CalendarDuotone({ className = 'w-5 h-5', ...props }) {
    return (
        <svg viewBox="0 0 256 256" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <rect x="40" y="48" width="176" height="168" rx="16" fill="currentColor" opacity="0.2" />
            <line x1="40" y1="88" x2="216" y2="88" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="40" y="48" width="176" height="168" rx="16" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="88" y1="24" x2="88" y2="56" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="168" y1="24" x2="168" y2="56" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="88" cy="132" r="10" fill="currentColor" />
            <circle cx="128" cy="132" r="10" fill="currentColor" />
            <circle cx="168" cy="132" r="10" fill="currentColor" />
            <circle cx="88" cy="172" r="10" fill="currentColor" />
            <circle cx="128" cy="172" r="10" fill="currentColor" />
            <circle cx="168" cy="172" r="10" fill="currentColor" />
        </svg>
    );
}

// 14. MagnifyingGlass / Pencarian
export function MagnifyingGlassDuotone({ className = 'w-5 h-5', ...props }) {
    return (
        <svg viewBox="0 0 256 256" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <circle cx="112" cy="112" r="80" fill="currentColor" opacity="0.2" />
            <circle cx="112" cy="112" r="80" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="168.6" y1="168.6" x2="224" y2="224" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

// 15. Funnel / Filter
export function FunnelDuotone({ className = 'w-5 h-5', ...props }) {
    return (
        <svg viewBox="0 0 256 256" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <polygon points="32 48 224 48 144 144 144 216 112 200 112 144 32 48" fill="currentColor" opacity="0.2" />
            <polygon points="32 48 224 48 144 144 144 216 112 200 112 144 32 48" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

// 16. Tag / Kategori
export function TagDuotone({ className = 'w-5 h-5', ...props }) {
    return (
        <svg viewBox="0 0 256 256" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path
                d="M48 48v80l96 96a16 16 0 0 0 22.6 0l57.4-57.4a16 16 0 0 0 0-22.6L128 48H48z"
                fill="currentColor"
                opacity="0.2"
            />
            <path
                d="M48 48v80l96 96a16 16 0 0 0 22.6 0l57.4-57.4a16 16 0 0 0 0-22.6L128 48H48z"
                stroke="currentColor"
                strokeWidth="16"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <circle cx="88" cy="88" r="16" fill="currentColor" />
        </svg>
    );
}

// 17. Eye / Lihat Detail
export function EyeDuotone({ className = 'w-5 h-5', ...props }) {
    return (
        <svg viewBox="0 0 256 256" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path
                d="M128 48C48 48 16 128 16 128s32 80 112 80 112-80 112-80-32-80-112-80z"
                fill="currentColor"
                opacity="0.2"
            />
            <path
                d="M128 48C48 48 16 128 16 128s32 80 112 80 112-80 112-80-32-80-112-80z"
                stroke="currentColor"
                strokeWidth="16"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <circle cx="128" cy="128" r="32" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="136" cy="120" r="10" fill="currentColor" />
        </svg>
    );
}

// 18. PencilSimple / Ubah
export function PencilSimpleDuotone({ className = 'w-5 h-5', ...props }) {
    return (
        <svg viewBox="0 0 256 256" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <polygon points="96 224 40 224 40 168 168 40 224 96 96 224" fill="currentColor" opacity="0.2" />
            <path
                d="M96 224H40v-56L168 40l56 56L96 224z"
                stroke="currentColor"
                strokeWidth="16"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <line x1="136" y1="72" x2="192" y2="128" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

// 19. Trash / Hapus
export function TrashDuotone({ className = 'w-5 h-5', ...props }) {
    return (
        <svg viewBox="0 0 256 256" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path d="M200 56v152a16 16 0 0 1-16 16H72a16 16 0 0 1-16-16V56z" fill="currentColor" opacity="0.2" />
            <path d="M200 56v152a16 16 0 0 1-16 16H72a16 16 0 0 1-16-16V56" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="32" y1="56" x2="224" y2="56" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M88 56V40a16 16 0 0 1 16-16h48a16 16 0 0 1 16 16v16" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="104" y1="104" x2="104" y2="168" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="152" y1="104" x2="152" y2="168" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

// 20. PlusCircle / Tambah Transaksi
export function PlusCircleDuotone({ className = 'w-5 h-5', ...props }) {
    return (
        <svg viewBox="0 0 256 256" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <circle cx="128" cy="128" r="96" fill="currentColor" opacity="0.2" />
            <circle cx="128" cy="128" r="96" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="88" y1="128" x2="168" y2="128" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="128" y1="88" x2="128" y2="168" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

// 21. CheckCircle / Sukses
export function CheckCircleDuotone({ className = 'w-5 h-5', ...props }) {
    return (
        <svg viewBox="0 0 256 256" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <circle cx="128" cy="128" r="96" fill="currentColor" opacity="0.2" />
            <circle cx="128" cy="128" r="96" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
            <polyline points="88 128 116 156 168 96" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

// 22. DownloadSimple / Ekspor CSV
export function DownloadSimpleDuotone({ className = 'w-5 h-5', ...props }) {
    return (
        <svg viewBox="0 0 256 256" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path d="M40 160v48a16 16 0 0 0 16 16h144a16 16 0 0 0 16-16v-48" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
            <polygon points="128 168 72 112 184 112 128 168" fill="currentColor" opacity="0.2" />
            <polyline points="72 112 128 168 184 112" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="128" y1="32" x2="128" y2="168" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

// 23. FileText / Catatan
export function FileTextDuotone({ className = 'w-5 h-5', ...props }) {
    return (
        <svg viewBox="0 0 256 256" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <polygon points="152 32 152 88 208 88 152 32" fill="currentColor" opacity="0.2" />
            <path d="M48 40a8 8 0 0 1 8-8h96l56 56v128a8 8 0 0 1-8 8H56a8 8 0 0 1-8-8z" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
            <polyline points="152 32 152 88 208 88" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="96" y1="136" x2="160" y2="136" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="96" y1="168" x2="160" y2="168" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

// 24. Clock / Waktu
export function ClockDuotone({ className = 'w-5 h-5', ...props }) {
    return (
        <svg viewBox="0 0 256 256" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <circle cx="128" cy="128" r="96" fill="currentColor" opacity="0.2" />
            <circle cx="128" cy="128" r="96" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
            <polyline points="128 72 128 128 176 128" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

// 25. User / Akun
export function UserDuotone({ className = 'w-5 h-5', ...props }) {
    return (
        <svg viewBox="0 0 256 256" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <circle cx="128" cy="96" r="48" fill="currentColor" opacity="0.2" />
            <circle cx="128" cy="96" r="48" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M32 216a96 96 0 0 1 192 0" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

// 26. SignOut / Keluar
export function SignOutDuotone({ className = 'w-5 h-5', ...props }) {
    return (
        <svg viewBox="0 0 256 256" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <polyline points="176 176 224 128 176 80" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="224" y1="128" x2="104" y2="128" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M104 216H48a16 16 0 0 1-16-16V56a16 16 0 0 1 16-16h56" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

// 27. Briefcase / Gaji & Payroll
export function BriefcaseDuotone({ className = 'w-5 h-5', ...props }) {
    return (
        <svg viewBox="0 0 256 256" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <rect x="32" y="72" width="192" height="144" rx="16" fill="currentColor" opacity="0.2" />
            <rect x="32" y="72" width="192" height="144" rx="16" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M88 72V48a16 16 0 0 1 16-16h48a16 16 0 0 1 16 16v24" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="32" y1="120" x2="224" y2="120" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

// 28. ForkKnife / Makanan & Minuman
export function ForkKnifeDuotone({ className = 'w-5 h-5', ...props }) {
    return (
        <svg viewBox="0 0 256 256" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path d="M88 32v64a24 24 0 0 1-24 24H56a24 24 0 0 1-24-24V32" fill="currentColor" opacity="0.2" />
            <line x1="60" y1="32" x2="60" y2="224" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M88 32v64a24 24 0 0 1-24 24H56a24 24 0 0 1-24-24V32" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M200 32v96a24 24 0 0 1-24 24h-8v72" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M168 32c0 40 32 48 32 96" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

// 29. Car / Transportasi
export function CarDuotone({ className = 'w-5 h-5', ...props }) {
    return (
        <svg viewBox="0 0 256 256" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path
                d="M24 168V120a16 16 0 0 1 16-16l24-48a16 16 0 0 1 14.3-8.8h99.4a16 16 0 0 1 14.3 8.8l24 48a16 16 0 0 1 16 16v48"
                fill="currentColor"
                opacity="0.2"
            />
            <path d="M24 120l24-48a16 16 0 0 1 14.3-8.8h111.4a16 16 0 0 1 14.3 8.8l24 48" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="16" y="120" width="224" height="64" rx="16" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="68" cy="184" r="20" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="188" cy="184" r="20" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

// 30. ShoppingBag / Belanja
export function ShoppingBagDuotone({ className = 'w-5 h-5', ...props }) {
    return (
        <svg viewBox="0 0 256 256" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <rect x="32" y="72" width="192" height="152" rx="16" fill="currentColor" opacity="0.2" />
            <rect x="32" y="72" width="192" height="152" rx="16" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M88 104V64a40 40 0 0 1 80 0v40" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

// 31. Lightning / Listrik & Utilitas
export function LightningDuotone({ className = 'w-5 h-5', ...props }) {
    return (
        <svg viewBox="0 0 256 256" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <polygon points="160 16 64 136 128 136 96 240 192 120 128 120 160 16" fill="currentColor" opacity="0.2" />
            <polygon points="160 16 64 136 128 136 96 240 192 120 128 120 160 16" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

// 32. Heartbeat / Kesehatan
export function HeartbeatDuotone({ className = 'w-5 h-5', ...props }) {
    return (
        <svg viewBox="0 0 256 256" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path
                d="M178.6 32a58.4 58.4 0 0 0-50.6 29.5A58.4 58.4 0 0 0 77.4 32C45.7 32 20 57.7 20 89.4c0 68.6 98 128.6 108 134.6 10-6 108-66 108-134.6 0-31.7-25.7-57.4-57.4-57.4z"
                fill="currentColor"
                opacity="0.2"
            />
            <path
                d="M178.6 32a58.4 58.4 0 0 0-50.6 29.5A58.4 58.4 0 0 0 77.4 32C45.7 32 20 57.7 20 89.4c0 68.6 98 128.6 108 134.6 10-6 108-66 108-134.6 0-31.7-25.7-57.4-57.4-57.4z"
                stroke="currentColor"
                strokeWidth="16"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <polyline points="48 128 88 128 104 96 128 160 144 128 208 128" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

// 33. GraduationCap / Pendidikan
export function GraduationCapDuotone({ className = 'w-5 h-5', ...props }) {
    return (
        <svg viewBox="0 0 256 256" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <polygon points="128 32 16 96 128 160 240 96 128 32" fill="currentColor" opacity="0.2" />
            <polygon points="128 32 16 96 128 160 240 96 128 32" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M64 128v56c0 26.5 28.7 48 64 48s64-21.5 64-48v-56" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="240" y1="96" x2="240" y2="176" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

// 34. Laptop / Freelance
export function LaptopDuotone({ className = 'w-5 h-5', ...props }) {
    return (
        <svg viewBox="0 0 256 256" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <rect x="40" y="56" width="176" height="120" rx="8" fill="currentColor" opacity="0.2" />
            <rect x="40" y="56" width="176" height="120" rx="8" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M16 200h224a8 8 0 0 0 8-8v-8a8 8 0 0 0-8-8H16a8 8 0 0 0-8 8v8a8 8 0 0 0 8 8z" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

// 35. ShieldCheck / Keamanan
export function ShieldCheckDuotone({ className = 'w-5 h-5', ...props }) {
    return (
        <svg viewBox="0 0 256 256" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path
                d="M40 56a8 8 0 0 1 8-8h160a8 8 0 0 1 8 8v64c0 72-88 104-88 104s-88-32-88-104z"
                fill="currentColor"
                opacity="0.2"
            />
            <path
                d="M40 56a8 8 0 0 1 8-8h160a8 8 0 0 1 8 8v64c0 72-88 104-88 104s-88-32-88-104z"
                stroke="currentColor"
                strokeWidth="16"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <polyline points="88 128 116 156 168 96" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

// 36. WarningCircle / Peringatan
export function WarningCircleDuotone({ className = 'w-5 h-5', ...props }) {
    return (
        <svg viewBox="0 0 256 256" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <circle cx="128" cy="128" r="96" fill="currentColor" opacity="0.2" />
            <circle cx="128" cy="128" r="96" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="128" y1="80" x2="128" y2="136" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="128" cy="172" r="10" fill="currentColor" />
        </svg>
    );
}

// 37. Copy / Salin
export function CopyDuotone({ className = 'w-5 h-5', ...props }) {
    return (
        <svg viewBox="0 0 256 256" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <rect x="88" y="88" width="128" height="128" rx="8" fill="currentColor" opacity="0.2" />
            <rect x="88" y="88" width="128" height="128" rx="8" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M168 88V48a8 8 0 0 0-8-8H48a8 8 0 0 0-8 8v112a8 8 0 0 0 8 8h40" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

// 38. ChartPieSlice / Proporsi Kas
export function ChartPieSliceDuotone({ className = 'w-5 h-5', ...props }) {
    return (
        <svg viewBox="0 0 256 256" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path d="M128 128V32a96 96 0 1 1-96 96h96z" fill="currentColor" opacity="0.2" />
            <path d="M128 128V32a96 96 0 1 1-96 96h96z" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M128 128H32a96 96 0 0 1 96-96v96z" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

// 39. Sun / Terang
export function SunDuotone({ className = 'w-5 h-5', ...props }) {
    return (
        <svg viewBox="0 0 256 256" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <circle cx="128" cy="128" r="56" fill="currentColor" opacity="0.2" />
            <circle cx="128" cy="128" r="56" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="128" y1="24" x2="128" y2="48" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="128" y1="208" x2="128" y2="232" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="24" y1="128" x2="48" y2="128" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="208" y1="128" x2="232" y2="128" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="54.5" y1="54.5" x2="71.5" y2="71.5" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="184.5" y1="184.5" x2="201.5" y2="201.5" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="54.5" y1="201.5" x2="71.5" y2="184.5" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="184.5" y1="71.5" x2="201.5" y2="54.5" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

// 40. Moon / Gelap
export function MoonDuotone({ className = 'w-5 h-5', ...props }) {
    return (
        <svg viewBox="0 0 256 256" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path
                d="M216.7 152.6A96 96 0 0 1 103.4 39.3a96 96 0 1 0 113.3 113.3z"
                fill="currentColor"
                opacity="0.2"
            />
            <path
                d="M216.7 152.6A96 96 0 0 1 103.4 39.3a96 96 0 1 0 113.3 113.3z"
                stroke="currentColor"
                strokeWidth="16"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

// 41. X / Tutup / Batal
export function XDuotone({ className = 'w-5 h-5', ...props }) {
    return (
        <svg viewBox="0 0 256 256" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <circle cx="128" cy="128" r="96" fill="currentColor" opacity="0.15" />
            <line x1="168" y1="88" x2="88" y2="168" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="168" y1="168" x2="88" y2="88" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

// 42. CaretLeft / Panah Kiri (Pagination)
export function CaretLeftDuotone({ className = 'w-5 h-5', ...props }) {
    return (
        <svg viewBox="0 0 256 256" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <polygon points="160 208 80 128 160 48 160 208" fill="currentColor" opacity="0.2" />
            <polyline points="160 208 80 128 160 48" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

// 43. CaretRight / Panah Kanan (Pagination)
export function CaretRightDuotone({ className = 'w-5 h-5', ...props }) {
    return (
        <svg viewBox="0 0 256 256" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <polygon points="96 48 176 128 96 208 96 48" fill="currentColor" opacity="0.2" />
            <polyline points="96 48 176 128 96 208" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

// 44. CaretDown / Panah Bawah (Dropdown)
export function CaretDownDuotone({ className = 'w-5 h-5', ...props }) {
    return (
        <svg viewBox="0 0 256 256" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <polygon points="208 96 128 176 48 96 208 96" fill="currentColor" opacity="0.2" />
            <polyline points="208 96 128 176 48 96" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

// 45. List / Menu Hamburger
export function ListDuotone({ className = 'w-5 h-5', ...props }) {
    return (
        <svg viewBox="0 0 256 256" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <rect x="32" y="48" width="192" height="160" rx="16" fill="currentColor" opacity="0.1" />
            <line x1="40" y1="64" x2="216" y2="64" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="40" y1="128" x2="216" y2="128" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="40" y1="192" x2="216" y2="192" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

// 46. TrendDown / Tren Turun
export function TrendDownDuotone({ className = 'w-5 h-5', ...props }) {
    return (
        <svg viewBox="0 0 256 256" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <polygon points="232 200 232 136 168 136 232 200" fill="currentColor" opacity="0.2" />
            <polyline points="232 200 136 104 96 144 24 72" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
            <polyline points="168 200 232 200 232 136" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

// 47. ChartLine / Grafik Garis
export function ChartLineDuotone({ className = 'w-5 h-5', ...props }) {
    return (
        <svg viewBox="0 0 256 256" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path d="M32 208V168l56-48 48 32 88-88v144H32z" fill="currentColor" opacity="0.2" />
            <line x1="32" y1="208" x2="224" y2="208" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
            <polyline points="32 168 88 120 136 152 224 64" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

// 48. ArrowRight / Panah Kanan
export function ArrowRightDuotone({ className = 'w-5 h-5', ...props }) {
    return (
        <svg viewBox="0 0 256 256" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <circle cx="128" cy="128" r="96" fill="currentColor" opacity="0.15" />
            <circle cx="128" cy="128" r="96" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="88" y1="128" x2="168" y2="128" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
            <polyline points="128 88 168 128 128 168" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

// 49. ArrowLeft / Panah Kiri (Kembali)
export function ArrowLeftDuotone({ className = 'w-5 h-5', ...props }) {
    return (
        <svg viewBox="0 0 256 256" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <circle cx="128" cy="128" r="96" fill="currentColor" opacity="0.15" />
            <circle cx="128" cy="128" r="96" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="168" y1="128" x2="88" y2="128" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
            <polyline points="128 168 88 128 128 88" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

// 50. Check / Centang
export function CheckDuotone({ className = 'w-5 h-5', ...props }) {
    return (
        <svg viewBox="0 0 256 256" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <circle cx="128" cy="128" r="96" fill="currentColor" opacity="0.15" />
            <polyline points="80 128 112 160 176 96" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

// 51. Plus / Tambah
export function PlusDuotone({ className = 'w-5 h-5', ...props }) {
    return (
        <svg viewBox="0 0 256 256" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <circle cx="128" cy="128" r="96" fill="currentColor" opacity="0.15" />
            <line x1="88" y1="128" x2="168" y2="128" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="128" y1="88" x2="128" y2="168" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

// 52. Lock / Kunci Keamanan
export function LockDuotone({ className = 'w-5 h-5', ...props }) {
    return (
        <svg viewBox="0 0 256 256" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <rect x="40" y="88" width="176" height="128" rx="16" fill="currentColor" opacity="0.2" />
            <rect x="40" y="88" width="176" height="128" rx="16" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M88 88V56a40 40 0 0 1 80 0v32" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="128" cy="152" r="12" fill="currentColor" />
        </svg>
    );
}

// 53. Envelope / Email
export function EnvelopeDuotone({ className = 'w-5 h-5', ...props }) {
    return (
        <svg viewBox="0 0 256 256" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <polygon points="224 56 128 136 32 56 224 56" fill="currentColor" opacity="0.2" />
            <rect x="32" y="56" width="192" height="144" rx="16" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
            <polyline points="224 56 128 136 32 56" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

// 54. SignIn / Masuk
export function SignInDuotone({ className = 'w-5 h-5', ...props }) {
    return (
        <svg viewBox="0 0 256 256" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <rect x="40" y="40" width="104" height="176" rx="16" fill="currentColor" opacity="0.15" />
            <path d="M104 40H56a16 16 0 0 0-16 16v144a16 16 0 0 0 16 16h48" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="104" y1="128" x2="216" y2="128" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
            <polyline points="176 88 216 128 176 168" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

// 55. UserPlus / Daftar Akun
export function UserPlusDuotone({ className = 'w-5 h-5', ...props }) {
    return (
        <svg viewBox="0 0 256 256" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <circle cx="104" cy="96" r="48" fill="currentColor" opacity="0.2" />
            <circle cx="104" cy="96" r="48" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M24 216a80 80 0 0 1 160 0" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="208" y1="88" x2="208" y2="136" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="184" y1="112" x2="232" y2="112" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

// 56. UserCheck / Profil Terverifikasi
export function UserCheckDuotone({ className = 'w-5 h-5', ...props }) {
    return (
        <svg viewBox="0 0 256 256" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <circle cx="104" cy="96" r="48" fill="currentColor" opacity="0.2" />
            <circle cx="104" cy="96" r="48" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M24 216a80 80 0 0 1 160 0" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
            <polyline points="184 112 200 128 232 96" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

// 57. Percent / Persentase
export function PercentDuotone({ className = 'w-5 h-5', ...props }) {
    return (
        <svg viewBox="0 0 256 256" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <circle cx="76" cy="76" r="28" fill="currentColor" opacity="0.2" />
            <circle cx="76" cy="76" r="28" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="180" cy="180" r="28" fill="currentColor" opacity="0.2" />
            <circle cx="180" cy="180" r="28" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="200" y1="56" x2="56" y2="200" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

// 58. Flame / Pengeluaran Terbesar
export function FlameDuotone({ className = 'w-5 h-5', ...props }) {
    return (
        <svg viewBox="0 0 256 256" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path
                d="M136 24C112 72 80 104 80 144a48 48 0 0 0 96 0c0-24-16-48-24-64 24 16 48 48 48 80a80 80 0 0 1-160 0c0-64 56-112 96-136z"
                fill="currentColor"
                opacity="0.2"
            />
            <path
                d="M136 24C112 72 80 104 80 144a48 48 0 0 0 96 0c0-24-16-48-24-64 24 16 48 48 48 80a80 80 0 0 1-160 0c0-64 56-112 96-136z"
                stroke="currentColor"
                strokeWidth="16"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

// 59. Stack / Multi-Rekening (Layers)
export function StackDuotone({ className = 'w-5 h-5', ...props }) {
    return (
        <svg viewBox="0 0 256 256" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <polygon points="128 32 232 80 128 128 24 80 128 32" fill="currentColor" opacity="0.2" />
            <polygon points="128 32 232 80 128 128 24 80 128 32" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
            <polyline points="24 128 128 176 232 128" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
            <polyline points="24 176 128 224 232 176" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

// 60. Hash / ID Transaksi
export function HashDuotone({ className = 'w-5 h-5', ...props }) {
    return (
        <svg viewBox="0 0 256 256" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <rect x="96" y="96" width="64" height="64" fill="currentColor" opacity="0.2" />
            <line x1="40" y1="96" x2="216" y2="96" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="40" y1="160" x2="216" y2="160" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="104" y1="40" x2="88" y2="216" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="168" y1="40" x2="152" y2="216" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

// 61. Table / Tabel Transaksi
export function TableDuotone({ className = 'w-5 h-5', ...props }) {
    return (
        <svg viewBox="0 0 256 256" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <rect x="32" y="48" width="192" height="160" rx="16" fill="currentColor" opacity="0.2" />
            <rect x="32" y="48" width="192" height="160" rx="16" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="32" y1="104" x2="224" y2="104" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="96" y1="48" x2="96" y2="208" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="160" y1="48" x2="160" y2="208" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

// 62. Rows / Tampilan Baris Transaksi
export function RowsDuotone({ className = 'w-5 h-5', ...props }) {
    return (
        <svg viewBox="0 0 256 256" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <rect x="40" y="48" width="176" height="48" rx="8" fill="currentColor" opacity="0.2" />
            <rect x="40" y="48" width="176" height="48" rx="8" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="40" y="112" width="176" height="48" rx="8" fill="currentColor" opacity="0.2" />
            <rect x="40" y="112" width="176" height="48" rx="8" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="40" y="176" width="176" height="48" rx="8" fill="currentColor" opacity="0.2" />
            <rect x="40" y="176" width="176" height="48" rx="8" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

// Convenient drop-in aliases matching standard naming across codebase
export const DashboardBold = SquaresFourDuotone;
export const ReceiptTextBold = ReceiptDuotone;
export const WalletBold = WalletDuotone;
export const ChartBold = ChartBarDuotone;
export const CoinsBold = CoinsDuotone;
export const IncomeBold = ArrowDownLeftDuotone;
export const ExpenseBold = ArrowUpRightDuotone;
export const TrendingUpBold = TrendUpDuotone;
export const SearchBold = MagnifyingGlassDuotone;
export const FilterBold = FunnelDuotone;
export const CalendarBold = CalendarDuotone;
export const TagBold = TagDuotone;
export const EyeBold = EyeDuotone;
export const EditBold = PencilSimpleDuotone;
export const TrashBold = TrashDuotone;
export const PlusBold = PlusCircleDuotone;
export const ExportBold = DownloadSimpleDuotone;
export const NotesBold = FileTextDuotone;
export const SalaryBold = BriefcaseDuotone;
export const FoodBold = ForkKnifeDuotone;
export const CarBold = CarDuotone;
export const ShoppingBagBold = ShoppingBagDuotone;
export const BoltBold = LightningDuotone;
export const HealthBold = HeartbeatDuotone;
export const EducationBold = GraduationCapDuotone;
export const LaptopBold = LaptopDuotone;

// Drop-in aliases for Lucide naming
export const Sun = SunDuotone;
export const Moon = MoonDuotone;
export const X = XDuotone;
export const ChevronLeft = CaretLeftDuotone;
export const ChevronRight = CaretRightDuotone;
export const ChevronDown = CaretDownDuotone;
export const Menu = ListDuotone;
export const BarChart3 = ChartBarDuotone;
export const LineChart = ChartLineDuotone;
export const PieChart = ChartPieSliceDuotone;
export const TrendingUp = TrendUpDuotone;
export const TrendingDown = TrendDownDuotone;
export const AlertTriangle = WarningCircleDuotone;
export const AlertCircle = WarningCircleDuotone;
export const CheckCircle2 = CheckCircleDuotone;
export const Check = CheckDuotone;
export const ArrowDownLeft = ArrowDownLeftDuotone;
export const ArrowUpRight = ArrowUpRightDuotone;
export const ArrowRight = ArrowRightDuotone;
export const ArrowLeft = ArrowLeftDuotone;
export const Wallet = WalletDuotone;
export const WalletIcon = WalletDuotone;
export const Coins = CoinsDuotone;
export const Banknote = MoneyDuotone;
export const CreditCard = CreditCardDuotone;
export const Smartphone = DeviceMobileDuotone;
export const Sparkles = SparkleDuotone;
export const Plus = PlusDuotone;
export const PlusCircle = PlusCircleDuotone;
export const Edit3 = PencilSimpleDuotone;
export const Trash2 = TrashDuotone;
export const Calendar = CalendarDuotone;
export const Tag = TagDuotone;
export const FileText = FileTextDuotone;
export const Clock = ClockDuotone;
export const Hash = HashDuotone;
export const Download = DownloadSimpleDuotone;
export const Percent = PercentDuotone;
export const Flame = FlameDuotone;
export const Layers = StackDuotone;
export const Copy = CopyDuotone;
export const ShieldCheck = ShieldCheckDuotone;
export const Zap = LightningDuotone;
export const Lock = LockDuotone;
export const Mail = EnvelopeDuotone;
export const LogIn = SignInDuotone;
export const LogOut = SignOutDuotone;
export const User = UserDuotone;
export const UserPlus = UserPlusDuotone;
export const UserCheck = UserCheckDuotone;
export const LayoutList = RowsDuotone;
export const TableIcon = TableDuotone;


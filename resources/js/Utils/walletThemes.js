import {
    Banknote,
    CreditCard,
    Smartphone,
    TrendingUp,
    WalletIcon,
} from '@/Components/Icons/PhosphorDuotone';

export const WALLET_TYPES = [
    { key: 'bank', label: 'Rekening Bank', icon: CreditCard, desc: 'BCA, Mandiri, BNI, BRI, dll.' },
    { key: 'cash', label: 'Uang Tunai (Cash)', icon: Banknote, desc: 'Uang fisik di dompet / laci' },
    { key: 'ewallet', label: 'E-Wallet', icon: Smartphone, desc: 'GoPay, OVO, Dana, ShopeePay' },
    { key: 'investment', label: 'Investasi', icon: TrendingUp, desc: 'Reksadana, Saham, Kripto' },
    { key: 'other', label: 'Kas Lainnya', icon: WalletIcon, desc: 'Kas / simpanan lainnya' },
];

export const WALLET_GRADIENTS = {
    navy: {
        key: 'navy',
        label: 'Samudra Navy',
        swatchGradient: 'bg-gradient-to-br from-[#0028BD] via-[#00105B] to-[#000729]',
        bgGradient: 'bg-gradient-to-br from-[#001C8A] via-[#00105B] to-[#000729]',
        glowColor: 'bg-blue-400/20',
        borderColor: 'border-[#1E338D] hover:border-blue-400/60',
        accentShadow: 'hover:shadow-[0_16px_40px_-10px_rgba(0,16,91,0.5)]',
        pillClass: 'bg-blue-400/20 text-blue-100 border-blue-300/35',
    },
    teal: {
        key: 'teal',
        label: 'Teal Samudra',
        swatchGradient: 'bg-gradient-to-br from-teal-400 via-teal-700 to-cyan-950',
        bgGradient: 'bg-gradient-to-br from-[#0F4C5C] via-[#0A303D] to-[#041720]',
        glowColor: 'bg-teal-400/20',
        borderColor: 'border-teal-500/40 hover:border-teal-300/60',
        accentShadow: 'hover:shadow-[0_16px_40px_-10px_rgba(20,184,166,0.35)]',
        pillClass: 'bg-teal-400/20 text-teal-100 border-teal-300/35',
    },
    emerald: {
        key: 'emerald',
        label: 'Zamrud Royal',
        swatchGradient: 'bg-gradient-to-br from-emerald-400 via-emerald-700 to-green-950',
        bgGradient: 'bg-gradient-to-br from-[#0E3F29] via-[#082619] to-[#03120B]',
        glowColor: 'bg-emerald-400/20',
        borderColor: 'border-emerald-500/40 hover:border-emerald-300/60',
        accentShadow: 'hover:shadow-[0_16px_40px_-10px_rgba(16,185,129,0.35)]',
        pillClass: 'bg-emerald-400/20 text-emerald-100 border-emerald-300/35',
    },
    amber: {
        key: 'amber',
        label: 'Emas Hangat',
        swatchGradient: 'bg-gradient-to-br from-amber-400 via-orange-600 to-amber-950',
        bgGradient: 'bg-gradient-to-br from-[#4D2A09] via-[#2F1805] to-[#140A02]',
        glowColor: 'bg-amber-400/25',
        borderColor: 'border-amber-500/40 hover:border-amber-300/60',
        accentShadow: 'hover:shadow-[0_16px_40px_-10px_rgba(245,158,11,0.35)]',
        pillClass: 'bg-amber-400/20 text-amber-100 border-amber-300/35',
    },
    blue: {
        key: 'blue',
        label: 'Kobalt Malam',
        swatchGradient: 'bg-gradient-to-br from-sky-400 via-blue-700 to-slate-950',
        bgGradient: 'bg-gradient-to-br from-[#163168] via-[#0D1E42] to-[#060E21]',
        glowColor: 'bg-sky-400/20',
        borderColor: 'border-blue-500/40 hover:border-blue-300/60',
        accentShadow: 'hover:shadow-[0_16px_40px_-10px_rgba(59,130,246,0.4)]',
        pillClass: 'bg-sky-400/20 text-sky-100 border-sky-300/35',
    },
    violet: {
        key: 'violet',
        label: 'Violet Elegan',
        swatchGradient: 'bg-gradient-to-br from-violet-400 via-purple-700 to-indigo-950',
        bgGradient: 'bg-gradient-to-br from-[#341A5E] via-[#21103C] to-[#10061F]',
        glowColor: 'bg-violet-400/20',
        borderColor: 'border-violet-500/40 hover:border-violet-300/60',
        accentShadow: 'hover:shadow-[0_16px_40px_-10px_rgba(139,92,246,0.4)]',
        pillClass: 'bg-violet-400/20 text-violet-100 border-violet-300/35',
    },
    rose: {
        key: 'rose',
        label: 'Karmoisin Mewah',
        swatchGradient: 'bg-gradient-to-br from-rose-400 via-rose-700 to-red-950',
        bgGradient: 'bg-gradient-to-br from-[#52142B] via-[#340B1B] to-[#18040C]',
        glowColor: 'bg-rose-400/20',
        borderColor: 'border-rose-500/40 hover:border-rose-300/60',
        accentShadow: 'hover:shadow-[0_16px_40px_-10px_rgba(244,63,94,0.4)]',
        pillClass: 'bg-rose-400/20 text-rose-100 border-rose-300/35',
    },
    charcoal: {
        key: 'charcoal',
        label: 'Charcoal Gelap',
        swatchGradient: 'bg-gradient-to-br from-zinc-500 via-zinc-700 to-zinc-950',
        bgGradient: 'bg-gradient-to-br from-[#2C2C35] via-[#1E1E24] to-[#111115]',
        glowColor: 'bg-white/[0.08]',
        borderColor: 'border-[#3E3E48] hover:border-zinc-400/50',
        accentShadow: 'hover:shadow-[0_16px_40px_-10px_rgba(0,0,0,0.5)]',
        pillClass: 'bg-white/10 text-zinc-200 border-white/20',
    },
};

export const WALLET_GRADIENT_OPTIONS = Object.values(WALLET_GRADIENTS);

const TYPE_DEFAULT_COLOR = {
    bank: 'blue',
    cash: 'amber',
    ewallet: 'teal',
    investment: 'emerald',
    other: 'charcoal',
};

export function getWalletTypeMeta(type) {
    return WALLET_TYPES.find((item) => item.key === type) || WALLET_TYPES[WALLET_TYPES.length - 1];
}

export function getWalletCardTheme(wallet) {
    const typeMeta = getWalletTypeMeta(wallet?.type);
    const defaultColorKey = TYPE_DEFAULT_COLOR[wallet?.type] || 'charcoal';
    const gradient = WALLET_GRADIENTS[wallet?.color] || WALLET_GRADIENTS[defaultColorKey] || WALLET_GRADIENTS.charcoal;

    return {
        label: typeMeta.label,
        icon: typeMeta.icon,
        ...gradient,
    };
}

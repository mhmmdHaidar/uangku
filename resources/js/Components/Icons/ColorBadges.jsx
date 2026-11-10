import React from 'react';

/**
 * Uangku Full-Color Illustrated Squircle Badge Icons
 * - 100% Full Opacity Solid Color Squircle Container (Non-transparent in Light & Dark Mode)
 * - Multi-color cartoon vector illustration with crisp outlines and volume
 * - Beautiful highlights, shadows, and friendly cartoon style matching the Squirrel mascot
 */

// 1. POCKET / DOMPET (Blue pouch with gold coins on solid coral/salmon badge)
export function PocketBadge({ className = 'w-11 h-11', badgeBg = 'bg-[#FF7A63] border border-[#FF664C]' }) {
    return (
        <div className={`relative shrink-0 flex items-center justify-center rounded-2xl shadow-sm transition-transform duration-200 hover:scale-105 ${badgeBg} ${className}`}>
            <svg viewBox="0 0 100 100" className="w-[68%] h-[68%]" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Gold coins popping out */}
                <circle cx="50" cy="28" r="14" fill="#F59E0B" stroke="#78350F" strokeWidth="4" />
                <circle cx="50" cy="28" r="9" fill="#FCD34D" />
                <circle cx="36" cy="34" r="11" fill="#F59E0B" stroke="#78350F" strokeWidth="4" />
                <circle cx="36" cy="34" r="7" fill="#FDE68A" />
                <circle cx="64" cy="34" r="11" fill="#F59E0B" stroke="#78350F" strokeWidth="4" />
                <circle cx="64" cy="34" r="7" fill="#FDE68A" />

                {/* Pocket Pouch Body */}
                <path
                    d="M22 42C22 38 25 36 29 36H71C75 36 78 38 78 42V58C78 74 65 86 50 86C35 86 22 74 22 58V42Z"
                    fill="#3B82F6"
                    stroke="#1E3A8A"
                    strokeWidth="4"
                    strokeLinejoin="round"
                />
                {/* Pocket Front Rim/Stitch */}
                <path
                    d="M24 44C24 44 34 50 50 50C66 50 76 44 76 44"
                    stroke="#1D4ED8"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                />
                {/* Pocket Golden Stitch / Star Accent */}
                <circle cx="50" cy="65" r="5" fill="#FCD34D" stroke="#78350F" strokeWidth="2.5" />
                {/* Subtle highlight */}
                <path d="M30 46V58C30 68 37 77 46 80" stroke="#93C5FD" strokeWidth="3" strokeLinecap="round" />
            </svg>
        </div>
    );
}

// 2. MONEY / KAS MASUK (Green banknote bill on solid mint green badge)
export function MoneyBadge({ className = 'w-11 h-11', badgeBg = 'bg-[#96E665] border border-[#7DD846]' }) {
    return (
        <div className={`relative shrink-0 flex items-center justify-center rounded-2xl shadow-sm transition-transform duration-200 hover:scale-105 ${badgeBg} ${className}`}>
            <svg viewBox="0 0 100 100" className="w-[70%] h-[70%]" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Bill shadow */}
                <rect x="16" y="28" width="68" height="44" rx="8" fill="#15803D" stroke="#14532D" strokeWidth="4" />
                {/* Bill body */}
                <rect x="16" y="28" width="68" height="44" rx="8" fill="#4ADE80" />
                <rect x="22" y="34" width="56" height="32" rx="5" fill="#22C55E" stroke="#166534" strokeWidth="3" strokeDasharray="4 3" />
                {/* Center Circle & Currency Emblem */}
                <circle cx="50" cy="50" r="10" fill="#86EFAC" stroke="#14532D" strokeWidth="3.5" />
                <circle cx="50" cy="50" r="5" fill="#15803D" />
                {/* Side dots */}
                <circle cx="28" cy="50" r="3" fill="#166534" />
                <circle cx="72" cy="50" r="3" fill="#166534" />
            </svg>
        </div>
    );
}

// 3. TARGET / SASARAN (Red-white archery target with arrow on solid apricot/peach badge)
export function TargetBadge({ className = 'w-11 h-11', badgeBg = 'bg-[#FFB76B] border border-[#FFA54F]' }) {
    return (
        <div className={`relative shrink-0 flex items-center justify-center rounded-2xl shadow-sm transition-transform duration-200 hover:scale-105 ${badgeBg} ${className}`}>
            <svg viewBox="0 0 100 100" className="w-[70%] h-[70%]" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Target Outer Ring */}
                <circle cx="50" cy="50" r="34" fill="#EF4444" stroke="#991B1B" strokeWidth="4" />
                <circle cx="50" cy="50" r="26" fill="#FFFFFF" stroke="#991B1B" strokeWidth="3" />
                <circle cx="50" cy="50" r="18" fill="#EF4444" stroke="#991B1B" strokeWidth="3" />
                <circle cx="50" cy="50" r="10" fill="#FFFFFF" stroke="#991B1B" strokeWidth="2.5" />
                <circle cx="50" cy="50" r="5" fill="#DC2626" />

                {/* Arrow Dart hitting Bullseye */}
                <path d="M50 50L76 24" stroke="#1E293B" strokeWidth="4" strokeLinecap="round" />
                {/* Feathers */}
                <path d="M72 20L80 20L80 28" fill="#F59E0B" stroke="#B45309" strokeWidth="2.5" strokeLinejoin="round" />
                <path d="M68 24L76 16L84 24" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="2.5" strokeLinejoin="round" />
            </svg>
        </div>
    );
}

// 4. WALLET / SALDO DOMPET (Leather wallet with cards on solid sky blue badge)
export function WalletBadge({ className = 'w-11 h-11', badgeBg = 'bg-[#67D0FD] border border-[#48C3FC]' }) {
    return (
        <div className={`relative shrink-0 flex items-center justify-center rounded-2xl shadow-sm transition-transform duration-200 hover:scale-105 ${badgeBg} ${className}`}>
            <svg viewBox="0 0 100 100" className="w-[70%] h-[70%]" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Cards popping up */}
                <rect x="30" y="22" width="40" height="20" rx="3" fill="#F59E0B" stroke="#78350F" strokeWidth="3" transform="rotate(-6 30 22)" />
                <rect x="34" y="20" width="40" height="20" rx="3" fill="#10B981" stroke="#064E3B" strokeWidth="3" transform="rotate(4 34 20)" />

                {/* Main Wallet Body */}
                <rect x="18" y="32" width="64" height="48" rx="10" fill="#2563EB" stroke="#1E3A8A" strokeWidth="4" />
                {/* Wallet Flap Clasp */}
                <path
                    d="M58 44H78C81.3 44 84 46.7 84 50V62C84 65.3 81.3 68 78 68H58C55 68 53 66 53 63V49C53 46 55 44 58 44Z"
                    fill="#1D4ED8"
                    stroke="#1E3A8A"
                    strokeWidth="3.5"
                />
                {/* Gold Button on Clasp */}
                <circle cx="73" cy="56" r="4.5" fill="#FCD34D" stroke="#78350F" strokeWidth="2.5" />
            </svg>
        </div>
    );
}

// 5. GOLD COINS / TABUNGAN EMAS (Stack of golden coins with sparkles on solid amber badge)
export function CoinsBadge({ className = 'w-11 h-11', badgeBg = 'bg-[#FFD447] border border-[#F5C327]' }) {
    return (
        <div className={`relative shrink-0 flex items-center justify-center rounded-2xl shadow-sm transition-transform duration-200 hover:scale-105 ${badgeBg} ${className}`}>
            <svg viewBox="0 0 100 100" className="w-[72%] h-[72%]" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Bottom Coin */}
                <ellipse cx="44" cy="68" rx="26" ry="11" fill="#D97706" stroke="#78350F" strokeWidth="3.5" />
                <ellipse cx="44" cy="65" rx="26" ry="11" fill="#F59E0B" />
                <ellipse cx="44" cy="65" rx="18" ry="7" fill="#FCD34D" stroke="#B45309" strokeWidth="2" strokeDasharray="3 2" />

                {/* Middle Coin */}
                <ellipse cx="44" cy="52" rx="26" ry="11" fill="#D97706" stroke="#78350F" strokeWidth="3.5" />
                <ellipse cx="44" cy="49" rx="26" ry="11" fill="#FBBF24" />
                <ellipse cx="44" cy="49" rx="18" ry="7" fill="#FDE68A" stroke="#B45309" strokeWidth="2" strokeDasharray="3 2" />

                {/* Top Upright Coin */}
                <circle cx="62" cy="38" r="18" fill="#F59E0B" stroke="#78350F" strokeWidth="3.5" />
                <circle cx="62" cy="38" r="14" fill="#FCD34D" />
                {/* Dollar / Rp Symbol */}
                <text x="62" y="44" textAnchor="middle" fontSize="16" fontWeight="900" fill="#78350F" fontFamily="sans-serif">Rp</text>

                {/* Sparkle */}
                <path d="M22 28L25 36L33 39L25 42L22 50L19 42L11 39L19 36L22 28Z" fill="#FBBF24" stroke="#78350F" strokeWidth="2" />
            </svg>
        </div>
    );
}

// 6. FOOD & DRINK / MAKANAN & MINUMAN (Juicy burger & drink on solid warm orange badge)
export function FoodBadge({ className = 'w-11 h-11', badgeBg = 'bg-[#FFA85C] border border-[#F8953F]' }) {
    return (
        <div className={`relative shrink-0 flex items-center justify-center rounded-2xl shadow-sm transition-transform duration-200 hover:scale-105 ${badgeBg} ${className}`}>
            <svg viewBox="0 0 100 100" className="w-[70%] h-[70%]" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Top Bun */}
                <path d="M22 46C22 30 34 22 50 22C66 22 78 30 78 46H22Z" fill="#F59E0B" stroke="#78350F" strokeWidth="3.5" strokeLinejoin="round" />
                {/* Sesame Seeds */}
                <ellipse cx="42" cy="32" rx="2" ry="1.2" fill="#FEF3C7" transform="rotate(-15 42 32)" />
                <ellipse cx="58" cy="32" rx="2" ry="1.2" fill="#FEF3C7" transform="rotate(20 58 32)" />
                <ellipse cx="50" cy="38" rx="2" ry="1.2" fill="#FEF3C7" />

                {/* Lettuce */}
                <path d="M20 46C24 49 28 46 32 48C36 50 40 47 44 49C48 51 52 48 56 50C60 52 64 48 68 50C72 52 76 48 80 46" stroke="#22C55E" strokeWidth="4" strokeLinecap="round" />

                {/* Tomato / Cheese */}
                <rect x="22" y="52" width="56" height="5" rx="2" fill="#EF4444" stroke="#991B1B" strokeWidth="2.5" />
                <polygon points="40 55 52 62 60 55" fill="#FBBF24" stroke="#B45309" strokeWidth="2" />

                {/* Patty */}
                <rect x="20" y="58" width="60" height="9" rx="4" fill="#78350F" stroke="#451A03" strokeWidth="3" />

                {/* Bottom Bun */}
                <path d="M24 68H76C76 76 68 82 50 82C32 82 24 76 24 68Z" fill="#F59E0B" stroke="#78350F" strokeWidth="3.5" strokeLinejoin="round" />
            </svg>
        </div>
    );
}

// 7. TRANSPORT / KENDARAAN (Friendly blue car on solid sky blue badge)
export function TransportBadge({ className = 'w-11 h-11', badgeBg = 'bg-[#67D0FD] border border-[#48C3FC]' }) {
    return (
        <div className={`relative shrink-0 flex items-center justify-center rounded-2xl shadow-sm transition-transform duration-200 hover:scale-105 ${badgeBg} ${className}`}>
            <svg viewBox="0 0 100 100" className="w-[72%] h-[72%]" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Car Cabin */}
                <path d="M28 48L36 30H64L72 48H28Z" fill="#38BDF8" stroke="#0369A1" strokeWidth="3.5" strokeLinejoin="round" />
                {/* Windshield */}
                <path d="M38 34H62L68 46H32L38 34Z" fill="#E0F2FE" />

                {/* Car Body */}
                <rect x="18" y="46" width="64" height="24" rx="8" fill="#0284C7" stroke="#0369A1" strokeWidth="3.5" />

                {/* Headlights */}
                <circle cx="76" cy="56" r="3.5" fill="#FEF08A" stroke="#CA8A04" strokeWidth="2" />
                <circle cx="24" cy="56" r="3.5" fill="#EF4444" stroke="#991B1B" strokeWidth="2" />

                {/* Wheels */}
                <circle cx="34" cy="70" r="9" fill="#1E293B" stroke="#0F172A" strokeWidth="3" />
                <circle cx="34" cy="70" r="4" fill="#94A3B8" />
                <circle cx="66" cy="70" r="9" fill="#1E293B" stroke="#0F172A" strokeWidth="3" />
                <circle cx="66" cy="70" r="4" fill="#94A3B8" />
            </svg>
        </div>
    );
}

// 8. SHOPPING / BELANJA (Vibrant purple shopping bag on solid purple badge)
export function ShoppingBadge({ className = 'w-11 h-11', badgeBg = 'bg-[#CE96FD] border border-[#BD76FC]' }) {
    return (
        <div className={`relative shrink-0 flex items-center justify-center rounded-2xl shadow-sm transition-transform duration-200 hover:scale-105 ${badgeBg} ${className}`}>
            <svg viewBox="0 0 100 100" className="w-[70%] h-[70%]" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Handles */}
                <path d="M38 38V26C38 20 43 16 50 16C57 16 62 20 62 26V38" stroke="#6B21A8" strokeWidth="4" strokeLinecap="round" />

                {/* Bag Body */}
                <path d="M26 36L30 82C30 85 33 88 36 88H64C67 88 70 85 70 82L74 36H26Z" fill="#A855F7" stroke="#581C87" strokeWidth="3.5" strokeLinejoin="round" />

                {/* Discount Tag / Sparkle Accent */}
                <circle cx="50" cy="58" r="10" fill="#F472B6" stroke="#9D174D" strokeWidth="2.5" />
                <path d="M46 58H54M50 54V62" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
        </div>
    );
}

// 9. SALARY / GAJI & PAYROLL (Leather briefcase with green bills on solid emerald/lime badge)
export function SalaryBadge({ className = 'w-11 h-11', badgeBg = 'bg-[#96E665] border border-[#7DD846]' }) {
    return (
        <div className={`relative shrink-0 flex items-center justify-center rounded-2xl shadow-sm transition-transform duration-200 hover:scale-105 ${badgeBg} ${className}`}>
            <svg viewBox="0 0 100 100" className="w-[70%] h-[70%]" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Cash peeking out */}
                <rect x="36" y="24" width="28" height="14" rx="2" fill="#86EFAC" stroke="#166534" strokeWidth="2.5" />

                {/* Handle */}
                <path d="M40 34V26C40 23 43 20 46 20H54C57 20 60 23 60 26V34" stroke="#78350F" strokeWidth="4" strokeLinecap="round" />

                {/* Briefcase Body */}
                <rect x="20" y="34" width="60" height="46" rx="8" fill="#D97706" stroke="#78350F" strokeWidth="3.5" />
                {/* Upper Flap */}
                <path d="M20 34H80V52C80 52 64 58 50 58C36 58 20 52 20 52V34Z" fill="#F59E0B" stroke="#78350F" strokeWidth="3" />
                {/* Golden Lock */}
                <rect x="46" y="52" width="8" height="8" rx="2" fill="#FEF08A" stroke="#78350F" strokeWidth="2" />
            </svg>
        </div>
    );
}

// 10. BILLS & UTILITY / LISTRIK & AIR (Golden bolt on solid yellow badge)
export function UtilityBadge({ className = 'w-11 h-11', badgeBg = 'bg-[#FFE659] border border-[#F5D530]' }) {
    return (
        <div className={`relative shrink-0 flex items-center justify-center rounded-2xl shadow-sm transition-transform duration-200 hover:scale-105 ${badgeBg} ${className}`}>
            <svg viewBox="0 0 100 100" className="w-[70%] h-[70%]" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Light bulb outline or bold lightning */}
                <path
                    d="M56 16L28 52H48L44 84L72 48H52L56 16Z"
                    fill="#FACC15"
                    stroke="#854D0E"
                    strokeWidth="3.5"
                    strokeLinejoin="round"
                />
                {/* Highlight */}
                <polygon points="52 22 34 50 48 50" fill="#FEF08A" />
            </svg>
        </div>
    );
}

// 11. HEALTH / KESEHATAN (First aid heart on solid rose badge)
export function HealthBadge({ className = 'w-11 h-11', badgeBg = 'bg-[#FF8F9E] border border-[#F96D80]' }) {
    return (
        <div className={`relative shrink-0 flex items-center justify-center rounded-2xl shadow-sm transition-transform duration-200 hover:scale-105 ${badgeBg} ${className}`}>
            <svg viewBox="0 0 100 100" className="w-[70%] h-[70%]" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Heart */}
                <path
                    d="M50 82C50 82 18 64 18 40C18 26 28 18 40 18C46 18 50 22 50 22C50 22 54 18 60 18C72 18 82 26 82 40C82 64 50 82 50 82Z"
                    fill="#F43F5E"
                    stroke="#9F1239"
                    strokeWidth="3.5"
                    strokeLinejoin="round"
                />
                {/* White Medical Cross */}
                <rect x="46" y="32" width="8" height="20" rx="2" fill="#FFFFFF" />
                <rect x="40" y="38" width="20" height="8" rx="2" fill="#FFFFFF" />
            </svg>
        </div>
    );
}

// 12. EDUCATION / PENDIDIKAN (Graduation cap on solid indigo/periwinkle badge)
export function EducationBadge({ className = 'w-11 h-11', badgeBg = 'bg-[#A8B8FF] border border-[#8C9FFC]' }) {
    return (
        <div className={`relative shrink-0 flex items-center justify-center rounded-2xl shadow-sm transition-transform duration-200 hover:scale-105 ${badgeBg} ${className}`}>
            <svg viewBox="0 0 100 100" className="w-[72%] h-[72%]" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Cap Base */}
                <path d="M30 52V68C30 76 40 82 50 82C60 82 70 76 70 68V52" fill="#3730A3" stroke="#1E1B4B" strokeWidth="3.5" />

                {/* Diamond Cap */}
                <polygon points="50 24 86 42 50 60 14 42" fill="#4F46E5" stroke="#1E1B4B" strokeWidth="3.5" strokeLinejoin="round" />

                {/* Tassel Button & Cord */}
                <circle cx="50" cy="42" r="3.5" fill="#FBBF24" stroke="#78350F" strokeWidth="2" />
                <path d="M50 42L76 56V72" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
                <rect x="73" y="70" width="6" height="8" rx="1.5" fill="#F59E0B" />
            </svg>
        </div>
    );
}

// 13. TECH & FREELANCE / CODING & IT (MacBook laptop on solid cyan badge)
export function TechBadge({ className = 'w-11 h-11', badgeBg = 'bg-[#6DE6F7] border border-[#4CD6EA]' }) {
    return (
        <div className={`relative shrink-0 flex items-center justify-center rounded-2xl shadow-sm transition-transform duration-200 hover:scale-105 ${badgeBg} ${className}`}>
            <svg viewBox="0 0 100 100" className="w-[72%] h-[72%]" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Screen */}
                <rect x="24" y="24" width="52" height="38" rx="5" fill="#0891B2" stroke="#164E63" strokeWidth="3.5" />
                {/* Code Display */}
                <rect x="28" y="28" width="44" height="30" rx="3" fill="#0E7490" />
                <path d="M34 38L38 42L34 46" stroke="#A5F3FC" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                <line x1="42" y1="46" x2="48" y2="46" stroke="#FEF08A" strokeWidth="2.5" strokeLinecap="round" />

                {/* Laptop Base */}
                <path d="M14 66H86C86 70 82 74 78 74H22C18 74 14 70 14 66Z" fill="#94A3B8" stroke="#1E293B" strokeWidth="3.5" strokeLinejoin="round" />
            </svg>
        </div>
    );
}

// 14. CREDIT CARD / REKENING BANK (Gold chip card on solid soft blue badge)
export function CardBadge({ className = 'w-11 h-11', badgeBg = 'bg-[#90BEFF] border border-[#6FA7FA]' }) {
    return (
        <div className={`relative shrink-0 flex items-center justify-center rounded-2xl shadow-sm transition-transform duration-200 hover:scale-105 ${badgeBg} ${className}`}>
            <svg viewBox="0 0 100 100" className="w-[70%] h-[70%]" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Card Body */}
                <rect x="16" y="26" width="68" height="48" rx="8" fill="#1E40AF" stroke="#1E3A8A" strokeWidth="3.5" />
                {/* Magnetic Strip */}
                <rect x="16" y="36" width="68" height="10" fill="#172554" />
                {/* Gold Chip */}
                <rect x="24" y="52" width="14" height="10" rx="2" fill="#FCD34D" stroke="#78350F" strokeWidth="2" />
                {/* Visa / Master Circles */}
                <circle cx="68" cy="58" r="6" fill="#EF4444" />
                <circle cx="74" cy="58" r="6" fill="#F59E0B" />
            </svg>
        </div>
    );
}

// 15. SMARTPHONE / E-WALLET (Phone with balance on solid mint teal badge)
export function PhoneBadge({ className = 'w-11 h-11', badgeBg = 'bg-[#5FE8D2] border border-[#3AD7BE]' }) {
    return (
        <div className={`relative shrink-0 flex items-center justify-center rounded-2xl shadow-sm transition-transform duration-200 hover:scale-105 ${badgeBg} ${className}`}>
            <svg viewBox="0 0 100 100" className="w-[70%] h-[70%]" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Phone Body */}
                <rect x="30" y="16" width="40" height="68" rx="8" fill="#0F766E" stroke="#134E4A" strokeWidth="3.5" />
                {/* Screen */}
                <rect x="34" y="24" width="32" height="50" rx="3" fill="#14B8A6" />
                {/* QR / App Symbol */}
                <circle cx="50" cy="46" r="9" fill="#FEF08A" stroke="#78350F" strokeWidth="2" />
                <text x="50" y="50" textAnchor="middle" fontSize="10" fontWeight="900" fill="#78350F" fontFamily="sans-serif">Q</text>
                {/* Home Indicator */}
                <rect x="44" y="78" width="12" height="2" rx="1" fill="#99F6E4" />
            </svg>
        </div>
    );
}

// 16. EXPENSE GENERAL / PENGELUARAN UMUM (Receipt on solid coral badge)
export function ExpenseBadge({ className = 'w-11 h-11', badgeBg = 'bg-[#FFA394] border border-[#FF8773]' }) {
    return (
        <div className={`relative shrink-0 flex items-center justify-center rounded-2xl shadow-sm transition-transform duration-200 hover:scale-105 ${badgeBg} ${className}`}>
            <svg viewBox="0 0 100 100" className="w-[70%] h-[70%]" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Paper Receipt */}
                <path
                    d="M26 22H74V78L66 74L58 78L50 74L42 78L34 74L26 78V22Z"
                    fill="#F1F5F9"
                    stroke="#334155"
                    strokeWidth="3.5"
                    strokeLinejoin="round"
                />
                {/* Lines */}
                <line x1="36" y1="36" x2="64" y2="36" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round" />
                <line x1="36" y1="46" x2="64" y2="46" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round" />
                {/* Red Arrow Up-Right */}
                <circle cx="50" cy="60" r="10" fill="#EF4444" stroke="#991B1B" strokeWidth="2" />
                <path d="M46 64L54 56M54 56H48M54 56V62" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        </div>
    );
}

export default function ApplicationLogo({ className = 'h-10 w-auto', mascotOnly = false }) {
    if (mascotOnly) {
        return (
            <img
                src="/assets/mascot.png"
                alt="Uangku Mascot"
                className={`object-contain select-none ${className}`}
            />
        );
    }

    return (
        <div className="flex items-center select-none">
            {/* Light Mode Logo */}
            <img
                src="/assets/logo.png"
                alt="Uangku — Kelola Keuanganmu Lebih Mudah"
                className={`object-contain block dark:hidden transition-opacity ${className}`}
            />
            {/* Dark Mode Logo (High-contrast adapted text) */}
            <img
                src="/assets/logo-dark.png"
                alt="Uangku — Kelola Keuanganmu Lebih Mudah"
                className={`object-contain hidden dark:block transition-opacity ${className}`}
            />
        </div>
    );
}

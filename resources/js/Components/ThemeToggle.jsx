import { useEffect, useState } from 'react';
import { SunDuotone, MoonDuotone } from '@/Components/Icons/PhosphorDuotone';

export default function ThemeToggle({ className = '' }) {
    const [isDark, setIsDark] = useState(false);

    const syncThemeMetadata = (dark) => {
        document.documentElement.classList.toggle('dark', dark);
        document.documentElement.style.colorScheme = dark ? 'dark' : 'light';
        const themeMeta = document.querySelector('meta[name="theme-color"]');
        if (themeMeta) {
            themeMeta.setAttribute('content', dark ? '#0B1426' : '#FFFFFF');
        }
    };

    useEffect(() => {
        // Sync with current DOM state
        const darkModeActive = document.documentElement.classList.contains('dark');
        setIsDark(darkModeActive);
        syncThemeMetadata(darkModeActive);
    }, []);

    const toggleTheme = () => {
        const nextDark = !isDark;
        localStorage.theme = nextDark ? 'dark' : 'light';
        syncThemeMetadata(nextDark);
        setIsDark(nextDark);
    };

    return (
        <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap'}
            title={isDark ? 'Mode Terang' : 'Mode Gelap'}
            className={`relative inline-flex items-center justify-center p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/70 border border-transparent hover:border-slate-200/80 dark:hover:border-white/10 transition duration-150 focus:outline-none ${className}`}
        >
            {isDark ? (
                <SunDuotone className="w-4 h-4 text-amber-400 transition-transform duration-200 rotate-0 hover:rotate-45" />
            ) : (
                <MoonDuotone className="w-4 h-4 text-slate-600 transition-transform duration-200 -rotate-12 hover:rotate-0" />
            )}
        </button>
    );
}


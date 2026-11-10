import { useEffect, useState } from 'react';
import { SunDuotone, MoonDuotone } from '@/Components/Icons/PhosphorDuotone';

export default function ThemeToggle({ className = '' }) {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        // Sync with current DOM state
        const darkModeActive = document.documentElement.classList.contains('dark');
        setIsDark(darkModeActive);
    }, []);

    const toggleTheme = () => {
        if (isDark) {
            document.documentElement.classList.remove('dark');
            localStorage.theme = 'light';
            setIsDark(false);
        } else {
            document.documentElement.classList.add('dark');
            localStorage.theme = 'dark';
            setIsDark(true);
        }
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


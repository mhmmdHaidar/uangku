import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['"Plus Jakarta Sans"', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                brand: {
                    50: '#f0fdf4',
                    100: '#dcfce7',
                    200: '#bbf7d0',
                    300: '#86efac',
                    400: '#4ade80',
                    500: '#22c55e',
                    600: '#16a34a',
                    700: '#15803d',
                    800: '#166534',
                    900: '#14532d',
                    950: '#052e16',
                },
                sage: {
                    50: '#f4f6f4',
                    100: '#e5ebe5',
                    200: '#ccd8cc',
                    300: '#a7bfa7',
                    400: '#7e9f7e',
                    500: '#5f835f',
                    600: '#4a684a',
                    700: '#3c533c',
                    800: '#324432',
                    900: '#2a382a',
                },
                dark: {
                    base: '#0B0F17',
                    card: '#111827',
                    elevated: '#1E293B',
                }
            },
            boxShadow: {
                'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.04)',
                'glass': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
                'glass-dark': '0 4px 20px -2px rgba(0, 0, 0, 0.35)',
            },
        },
    },

    plugins: [forms],
};

<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover">

        <title inertia>{{ config('app.name', 'Uangku') }}</title>

        <!-- SEO & Description -->
        <meta name="description" content="Uangku - Kelola keuanganmu lebih mudah, catat pemasukan dan pengeluaran, pantau saldo dompet, dan capai impian finansialmu secara otomatis, aman, dan menyenangkan.">
        <meta name="author" content="Uangku">

        <!-- Theme Color for Mobile Status Bars -->
        <meta name="theme-color" content="#0A1120" media="(prefers-color-scheme: dark)">
        <meta name="theme-color" content="#10B981" media="(prefers-color-scheme: light)">

        <!-- OpenGraph Meta Tags for Rich Social Sharing (WhatsApp, Telegram, Facebook, LinkedIn) -->
        <meta property="og:type" content="website">
        <meta property="og:site_name" content="Uangku">
        <meta property="og:title" content="Uangku - Kelola Keuangan Pribadi Lebih Mudah">
        <meta property="og:description" content="Catat pemasukan & pengeluaran, kelola rekening & dompet digitalmu secara real-time bersama Si Uangku.">
        <meta property="og:image" content="{{ asset('assets/mascot.png') }}">
        <meta property="og:url" content="{{ url('/') }}">

        <!-- Twitter Card -->
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="Uangku - Kelola Keuangan Pribadi Lebih Mudah">
        <meta name="twitter:description" content="Catat pemasukan & pengeluaran, kelola rekening & dompet digitalmu secara real-time bersama Si Uangku.">
        <meta name="twitter:image" content="{{ asset('assets/mascot.png') }}">

        <!-- PWA & Mobile Web App -->
        <link rel="manifest" href="/manifest.json">
        <meta name="mobile-web-app-capable" content="yes">
        <meta name="apple-mobile-web-app-capable" content="yes">
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
        <meta name="apple-mobile-web-app-title" content="Uangku">

        <!-- Favicon -->
        <link rel="icon" type="image/x-icon" href="/favicon.ico">
        <link rel="shortcut icon" type="image/x-icon" href="/favicon.ico">
        <link rel="icon" type="image/png" href="/assets/favicon.png">
        <link rel="apple-touch-icon" href="/assets/favicon.png">

        <!-- Theme script to prevent flash -->
        <script>
            if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        </script>

        <!-- PWA Service Worker Registration -->
        <script>
            if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                    navigator.serviceWorker.register('/sw.js').then((reg) => {
                        console.log('Uangku PWA ready');
                    }).catch((err) => {
                        console.warn('PWA registration:', err);
                    });
                });
            }
        </script>

        <!-- Fonts: Plus Jakarta Sans -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300..800;1,300..800&display=swap" rel="stylesheet">

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-[#0B0F17] transition-colors duration-200">
        @inertia
    </body>
</html>

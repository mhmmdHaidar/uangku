<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
    <title>500 - Kendala Sistem | Uangku</title>
    <link rel="icon" type="image/png" href="/assets/favicon.png">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Plus Jakarta Sans', sans-serif; }
        body { background-color: #0A1120; color: #F1F5F9; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 1.5rem; text-align: center; }
        .card { background: rgba(14, 26, 51, 0.95); border: 1px solid #1E3158; border-radius: 1.5rem; padding: 2.5rem 2rem; max-width: 480px; width: 100%; box-shadow: 0 10px 40px rgba(0,0,0,0.5); }
        .mascot { width: 140px; height: 140px; object-fit: contain; margin: 0 auto 1.5rem; display: block; animation: float 3s ease-in-out infinite; }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        .badge { display: inline-block; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; background: rgba(245,158,11,0.15); color: #FCD34D; border: 1px solid rgba(245,158,11,0.3); margin-bottom: 0.75rem; }
        h1 { font-size: 1.5rem; font-weight: 800; color: #FFFFFF; margin-bottom: 0.5rem; }
        p { font-size: 0.875rem; color: #94A3B8; line-height: 1.5; margin-bottom: 1.5rem; }
        .btn { display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; background: #059669; color: #FFFFFF; font-weight: 700; font-size: 0.875rem; padding: 0.75rem 1.5rem; border-radius: 1rem; text-decoration: none; transition: background 0.15s; }
        .btn:hover { background: #047857; }
    </style>
</head>
<body>
    <div class="card">
        <img src="/assets/mascot.png" alt="Si Uangku" class="mascot">
        <span class="badge">Error 500</span>
        <h1>Terjadi Kendala Sistem</h1>
        <p>Maaf, server sedang mengalami kendala sementara. Tim teknis sedang memperbaikinya. Silakan coba kembali beberapa saat lagi.</p>
        <a href="/" class="btn">Kembali ke Beranda</a>
    </div>
</body>
</html>


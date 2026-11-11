<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
    <title>404 - Halaman Tidak Ditemukan | Uangku</title>
    <link rel="icon" type="image/png" href="/assets/favicon.png">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Plus Jakarta Sans', sans-serif; }
        body { background-color: #121214; color: #F4F4F5; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 1.5rem; text-align: center; }
        .card { background: #1C1C20; border: 1px solid #2C2C32; border-radius: 1.5rem; padding: 2.5rem 2rem; max-width: 480px; width: 100%; box-shadow: 0 10px 40px rgba(0,0,0,0.5); }
        .mascot { width: 140px; height: 140px; object-fit: contain; margin: 0 auto 1.5rem; display: block; animation: float 3s ease-in-out infinite; }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        .badge { display: inline-block; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; background: rgba(244,63,94,0.15); color: #FDA4AF; border: 1px solid rgba(244,63,94,0.3); margin-bottom: 0.75rem; }
        h1 { font-size: 1.5rem; font-weight: 800; color: #FFFFFF; margin-bottom: 0.5rem; }
        p { font-size: 0.875rem; color: #A1A1AA; line-height: 1.5; margin-bottom: 1.5rem; }
        .btn { display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; background: #F4F4F5; color: #121214; font-weight: 700; font-size: 0.875rem; padding: 0.75rem 1.5rem; border-radius: 1rem; text-decoration: none; transition: background 0.15s; }
        .btn:hover { background: #FFFFFF; }
    </style>
</head>
<body>
    <div class="card">
        <img src="/assets/mascot.png" alt="Si Uangku" class="mascot">
        <span class="badge">Error 404</span>
        <h1>Halaman Tidak Ditemukan</h1>
        <p>Ups! Halaman yang kamu cari sepertinya terselip atau sudah dipindahkan. Tenang, catatan keuanganmu tetap aman bersama Si Uangku.</p>
        <a href="/" class="btn">Kembali ke Beranda</a>
    </div>
</body>
</html>


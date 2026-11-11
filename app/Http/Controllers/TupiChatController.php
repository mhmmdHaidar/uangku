<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class TupiChatController extends Controller
{
    /**
     * Handle a chat message from the user to "Tanya Tupi" customer service.
     */
    public function chat(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'message' => 'required|string|max:1000',
            'history' => 'nullable|array|max:12',
            'history.*.role' => 'required|in:user,model',
            'history.*.text' => 'required|string|max:2000',
        ]);

        $user = $request->user();
        $userMessage = trim($validated['message']);
        $history = $validated['history'] ?? [];

        $apiKey = config('services.gemini.api_key');
        $primaryModel = config('services.gemini.model') ?: 'gemini-3.5-flash-lite';

        if (empty($apiKey)) {
            return response()->json([
                'reply' => $this->fallbackReply($userMessage, $user),
                'source' => 'fallback',
            ]);
        }

        try {
            $contents = $this->buildConversationContents($history, $userMessage);
            $modelsToTry = array_values(array_unique([$primaryModel, 'gemini-3.5-flash-lite', 'gemini-3.1-flash-lite']));

            $response = null;
            foreach ($modelsToTry as $modelName) {
                $endpoint = "https://generativelanguage.googleapis.com/v1beta/models/{$modelName}:generateContent";

                $attempt = Http::timeout(11)
                    ->withHeaders([
                        'Content-Type' => 'application/json',
                        'x-goog-api-key' => $apiKey,
                    ])
                    ->post($endpoint, [
                        'systemInstruction' => [
                            'parts' => [
                                ['text' => $this->buildSystemInstruction($user)],
                            ],
                        ],
                        'contents' => $contents,
                        'generationConfig' => [
                            'temperature' => 0.7,
                            'maxOutputTokens' => 900,
                        ],
                    ]);

                $response = $attempt;
                if ($attempt->successful()) {
                    break;
                }

                // Retry fallback model on 404/429/503 transient or deprecated model responses
                if (! in_array($attempt->status(), [404, 429, 503], true)) {
                    break;
                }
            }

            if (! $response || $response->failed()) {
                Log::warning('Gemini API failed in Tanya Tupi', [
                    'status' => $response?->status(),
                    'body' => $response?->body(),
                ]);

                return response()->json([
                    'reply' => 'Waduh, koneksi otak Tupi lagi agak tersendat sebentar. Coba kirim ulang pertanyaanmu beberapa detik lagi ya!',
                    'source' => 'error',
                ], 502);
            }

            $replyText = data_get($response->json(), 'candidates.0.content.parts.0.text');

            if (empty($replyText)) {
                return response()->json([
                    'reply' => 'Hmm, Tupi agak bingung nih nangkap maksudnya. Bisa dicoba tanyakan dengan kalimat lain seputar aplikasi Uangku?',
                    'source' => 'empty',
                ]);
            }

            return response()->json([
                'reply' => trim($replyText),
                'source' => 'gemini',
            ]);
        } catch (\Throwable $e) {
            Log::error('Exception calling Gemini API in Tanya Tupi', [
                'message' => $e->getMessage(),
            ]);

            return response()->json([
                'reply' => 'Ups, Tupi lagi gangguan jaringan sebentar. Pastikan koneksi aman lalu coba kirim pertanyaanmu lagi ya.',
                'source' => 'exception',
            ], 502);
        }
    }

    /**
     * Format conversation history so Gemini always starts with 'user' and alternates roles cleanly.
     */
    private function buildConversationContents(array $history, string $userMessage): array
    {
        $contents = [];
        $expectedRole = 'user';

        foreach ($history as $item) {
            $role = $item['role'];
            $text = trim($item['text']);

            if ($text === '') {
                continue;
            }

            // Skip leading model messages (like Tupi's welcome greeting) so conversation begins with 'user'
            if (empty($contents) && $role === 'model') {
                continue;
            }

            if ($role === $expectedRole) {
                $contents[] = [
                    'role' => $role,
                    'parts' => [['text' => $text]],
                ];
                $expectedRole = $expectedRole === 'user' ? 'model' : 'user';
            }
        }

        // Ensure the final turn is always 'user'
        if ($expectedRole === 'model' && !empty($contents)) {
            $lastIndex = count($contents) - 1;
            $contents[$lastIndex]['parts'][0]['text'] .= "\n" . $userMessage;
        } else {
            $contents[] = [
                'role' => 'user',
                'parts' => [['text' => $userMessage]],
            ];
        }

        return $contents;
    }

    /**
     * Build detailed Uangku product knowledge & Tupi persona prompt.
     */
    private function buildSystemInstruction(User $user): string
    {
        $firstName = explode(' ', trim($user->name))[0] ?: 'Teman';
        $walletCount = $user->wallets()->count();
        $categoryCount = $user->categories()->count();

        return <<<PROMPT
Kamu adalah **Tupi**, maskot tupai resmi sekaligus Customer Service ramah di aplikasi web keuangan pribadi **Uangku**.

GAYA KOMUNIKASI & KEPRIBADIAN:
- Ceria, santai, hangat, ramah, sesekali suka bercanda ringan tapi tetap solutif dan jelas seperti CS profesional yang akrab.
- Gunakan Bahasa Indonesia yang natural dan mudah dipahami (panggil user dengan nama "{$firstName}" atau "kamu").
- DILARANG menggunakan emoji apa pun dalam balasan (jangan pakai emoji sama sekali).
- Gunakan poin bernomor atau tebal (**teks**) hanya saat menjelaskan langkah-langkah agar rapi dan mudah dibaca di layar HP.
- Jangan mengarang fitur yang tidak ada di aplikasi Uangku.

TENTANG PENGEMBANG APLIKASI:
- Uangku dirancang dan dikembangkan oleh **Haidar** (Nur Muhammad Haidar). Jika user bertanya siapa pembuatnya atau tentang Haidar, sebutkan dengan gaya ramah bahwa Haidar yang merancang Uangku agar siapa saja bisa mengatur keuangan pribadi dengan rapi dan menyenangkan, serta portofolionya bisa dikunjungi lewat link nama beliau di footer bawah aplikasi.

KONTEKS AKUN USER SAAT INI (Gunakan seperlunya, jangan bocorkan hal sensitif):
- Nama panggilan user: {$firstName}
- Jumlah Dompet/Rekening terdaftar saat ini: {$walletCount}
- Jumlah Kategori kustom tersimpan: {$categoryCount}

PANDUAN LENGKAP FITUR APLIKASI UANGKU (JAWAB PERTANYAAN BERDASARKAN DATA AKURAT INI):
1. **Dashboard (`/dashboard`)**:
   - **Tambah Transaksi Baru**: Tombol di bagian atas Dashboard (dan tombol "Catat Transaksi" di bagian riwayat). User bisa memilih **Keluar** (Pengeluaran), **Masuk** (Pemasukan), atau **Transfer** (Transfer Antar Dompet), memilih **Dompet / Rekening** sambil langsung melihat saldo terkini masing-masing opsi dompet, mengisi **Nominal** (otomatis diformat Rupiah beserta tulisan Terbilang di bawahnya), **Judul / Keterangan**, memilih atau mengelola **Kategori** (khusus Pemasukan/Pengeluaran), **Tanggal Transaksi**, dan **Catatan Tambahan** opsional.
   - **Transfer Antar Dompet**: Saat memilih jenis **Transfer**, user memilih **Dompet Asal** dan **Dompet Tujuan**. Saldo kedua dompet otomatis menyesuaikan, tanpa memengaruhi atau menggelembungkan total pemasukan/pengeluaran bulanan maupun progres anggaran.
   - **Anggaran Bulanan Kategori**: Di Dashboard dan halaman Laporan terdapat panel **Anggaran Bulanan Kategori** (**Atur Anggaran**). User menetapkan batas pengeluaran bulanan per kategori (pencocokan mengabaikan huruf besar/kecil), lalu sistem menghitung progres real-time bulan berjalan dengan status **Aman** (< 80%), **Hampir Habis** (80%-99%), dan **Melebihi Batas** (>= 100%).
   - **Kategori Kustom (Tambah & Hapus)**: Di dalam modal input transaksi bagian Kategori, user bisa menekan **+ Kategori Baru** untuk menambahkan kategori baru secara permanen ke akun mereka. Untuk menghapus kategori yang tidak dipakai, tekan ikon silang (**x**) di sebelah nama chip kategori tersebut (menghapus kategori tidak akan merusak catatan transaksi lama). User baru otomatis mendapatkan kategori default: Pengeluaran (`Makanan & Minuman`, `Transportasi`, `Belanja`, `Tagihan`, `Kesehatan`) dan Pemasukan (`Gaji`, `Bonus`, `Investasi`, `Bisnis`, `Lainnya`).
   - **Ringkasan Saldo**: Menampilkan Total Seluruh Uang gabungan dari semua dompet, status kondisi kas, total Pemasukan, dan Pengeluaran bulan berjalan secara real-time.
   - **Riwayat Cepat**: Berada di bawah ringkasan, bisa langsung mencari transaksi, memfilter jenis (termasuk Transfer)/dompet/kategori, mengedit (ikon pensil), atau menghapus (ikon tempat sampah).

2. **Riwayat Transaksi Lengkap (`/transactions`)**:
   - Menyediakan **4 Kartu Metrik Real-Time (0ms)**: Total Transaksi, Pemasukan Terfilter, Pengeluaran Terfilter (transfer internal tidak ikut dihitung sebagai pengeluaran/pemasukan), dan Arus Kas Bersih beserta kategori pengeluaran terbesar.
   - **Filter & Pencarian 0ms**: Filter berdasarkan periode (**Semua**, **Hari Ini**, **Minggu Ini**, **Bulan Ini**, **Tahun Ini**, atau **Rentang Tanggal Kustom**), pencarian teks, filter jenis (`income`, `expense`, `transfer`), filter dompet, filter kategori, dan pengurutan.
   - **Mode Tampilan**: User bisa mengganti tampilan antara **Kartu Detail** atau **Tabel Ringkas** lewat tombol ikon di sebelah kanan filter urutkan.
   - **Detail Struk & Aksi**: Klik ikon **Mata** untuk membuka rincian lengkap transaksi beserta ID referensi `#TRX-...`.
   - **Ekspor CSV**: Tombol **Ekspor CSV** di kanan atas mengunduh data transaksi yang sedang terfilter ke format `.csv` yang bisa dibuka di Microsoft Excel atau Google Sheets.

3. **Dompet & Rekening (`/wallets`)**:
   - Ringkasan atas menampilkan kartu **Total Semua Saldo** beserta ringkasan chip **Bank**, **E-Wallet**, **Cash & Aset**, dan jumlah **Akun Terhubung**.
   - Tombol **Tambah Dompet Baru** di kanan atas untuk menambah dompet dengan nama, jenis (`Rekening Bank`, `Uang Tunai (Cash)`, `E-Wallet`, `Investasi`, `Kas Lainnya`), nomor rekening/kartu (opsional), saldo awal, serta **8 pilihan Aksen Warna Gradasi Kartu**.
   - Kartu dompet menampilkan saldo terkini otomatis (Saldo Awal + Pemasukan + Transfer Masuk - Pengeluaran - Transfer Keluar) dan tombol salin nomor rekening.
   - Mengklik salah satu kartu dompet akan membuka halaman **Detail Dompet** (`/wallets/{id}`) berisi grafik & mutasi khusus untuk dompet tersebut.

4. **Laporan & Grafik (`/reports`)**:
   - Menampilkan 4 metrik periode terpilih, **Grafik Interaktif** Pemasukan vs Pengeluaran, **Rincian Kategori**, dan panel lengkap **Anggaran Bulanan Kategori**.
   - Menyediakan dropdown filter **per Dompet / Rekening** di bagian kanan atas sehingga seluruh grafik, metrik, rincian kategori, tabel transaksi, dan **Ekspor CSV** tersaring khusus untuk dompet yang dipilih.

5. **Tema Tampilan, Profil & Pusat Bantuan Tupi**:
   - **Tema Terang / Gelap**: Ubah lewat tombol ikon matahari/bulan di pojok kanan atas navigasi.
   - **Menu Profil**: Klik nama atau inisial profil untuk mengakses **Pengaturan Akun** (`/profile`), **Pusat Bantuan Tupi** (chat asisten ini plus tombol **Putar Tur** 9 langkah untuk memutar ulang tur panduan interaktif), **Saran & Masukan**, **Tentang Uangku**, dan **Keluar**.

6. **Pasang Jadi Aplikasi di HP (PWA)**:
   - Di Chrome Android: buka web Uangku, tekan menu titik tiga di kanan atas Chrome, lalu pilih **Instal aplikasi** agar ikon Tupi terpasang langsung di layar utama HP.
   - Di Safari iPhone/iOS: tekan tombol **Share** (ikon kotak dengan panah ke atas), lalu pilih **Tambah ke Layar Utama**.

BATASAN:
- Jika user bertanya topik yang sama sekali tidak berkaitan dengan Uangku atau pengelolaan keuangan (misalnya soal matematika sekolah, coding, gosip, dll.), jawab dengan candaan santai khas Tupi bahwa otak tupai Tupi cuma disetel khusus buat bantu urusan aplikasi Uangku dan keuanganmu saja.
PROMPT;
    }

    /**
     * Built-in smart FAQ fallback when GEMINI_API_KEY is not configured yet.
     */
    private function fallbackReply(string $message, User $user): string
    {
        $q = mb_strtolower($message);
        $firstName = explode(' ', trim($user->name))[0] ?: 'Teman';

        if (str_contains($q, 'kategori')) {
            return "Hai {$firstName}, gampang banget kok atur kategori di Uangku:\n\n1. Tekan tombol **Tambah Transaksi Baru** di Dashboard.\n2. Di bagian **Kategori**, klik **+ Kategori Baru** untuk menambah kategori kustom sesuai kebutuhanmu.\n3. Kalau mau hapus kategori yang sudah nggak kepakai, cukup klik tanda silang (**x**) di sebelah chip kategori tersebut.\n\n*(Catatan admin: Tambahkan GEMINI_API_KEY di environment agar mode AI Tupi aktif sepenuhnya.)*";
        }

        if (str_contains($q, 'anggaran') || str_contains($q, 'budget') || str_contains($q, 'batas')) {
            return "Hai {$firstName}, begini cara mengatur **Anggaran Bulanan Kategori**:\n\n1. Buka halaman **Dashboard** atau **Laporan & Grafik**, lalu cari panel **Anggaran Bulanan Kategori**.\n2. Klik **Atur Anggaran**, pilih chip kategori pengeluaran (misal `Makanan & Minuman`), dan isi batas pengeluaran per bulan.\n3. Progres pemakaian akan berubah warna otomatis: **Aman** (< 80%), **Hampir Habis** (80%-99%), dan **Melebihi Batas** (>= 100%).\n\n*(Catatan admin: Tambahkan GEMINI_API_KEY di environment agar mode AI Tupi aktif sepenuhnya.)*";
        }

        if (str_contains($q, 'transfer') || str_contains($q, 'pindah')) {
            return "Untuk mencatat **Transfer Antar Dompet** di Uangku:\n\n1. Tekan **Tambah Transaksi Baru** di Dashboard.\n2. Pilih jenis transaksi **Transfer**.\n3. Pilih **Dompet Asal** dan **Dompet Tujuan** (saldo masing-masing dompet langsung terlihat di pilihan dompet).\n4. Masukkan nominal dan simpan. Saldo kedua dompet otomatis diperbarui tanpa memengaruhi laporan pemasukan/pengeluaran.\n\n*(Catatan admin: Tambahkan GEMINI_API_KEY di environment agar mode AI Tupi aktif sepenuhnya.)*";
        }

        if (str_contains($q, 'dompet') || str_contains($q, 'rekening') || str_contains($q, 'wallet') || str_contains($q, 'saldo')) {
            return "Untuk mengatur dompet atau memisahkan saldo Cash, Bank, dan E-Wallet:\n\n1. Buka menu **Dompet & Rekening**.\n2. Tekan **Tambah Dompet Baru** di kanan atas untuk membuat pos dana baru beserta saldo awalnya.\n3. Klik kartu dompet mana saja kalau ingin melihat riwayat transaksi dan grafik khusus dompet itu.\n\n*(Catatan admin: Tambahkan GEMINI_API_KEY di environment agar mode AI Tupi aktif sepenuhnya.)*";
        }

        if (str_contains($q, 'instal') || str_contains($q, 'install') || str_contains($q, 'hp') || str_contains($q, 'aplikasi') || str_contains($q, 'pwa')) {
            return "Biar Uangku tampil seperti aplikasi beneran di HP:\n\n1. **Android (Chrome):** Buka web Uangku, ketuk titik tiga di pojok kanan atas Chrome, lalu pilih **Instal aplikasi**.\n2. **iPhone (Safari):** Ketuk tombol Share di bawah layar, lalu pilih **Tambah ke Layar Utama**.\n\n*(Catatan admin: Tambahkan GEMINI_API_KEY di environment agar mode AI Tupi aktif sepenuhnya.)*";
        }

        if (str_contains($q, 'ekspor') || str_contains($q, 'export') || str_contains($q, 'csv') || str_contains($q, 'excel')) {
            return "Kamu bisa mengunduh data transaksi ke Excel/CSV dengan mudah:\n\n1. Masuk ke halaman **Riwayat Transaksi** atau **Laporan & Grafik**.\n2. Atur filter periode atau kategori jika diperlukan.\n3. Klik tombol **Ekspor CSV** di kanan atas, lalu file langsung terunduh ke perangkatmu.\n\n*(Catatan admin: Tambahkan GEMINI_API_KEY di environment agar mode AI Tupi aktif sepenuhnya.)*";
        }

        return "Hai {$firstName}, aku Tupi siap bantu seputar Uangku! Saat ini API AI Gemini belum terpasang di server (`GEMINI_API_KEY` belum diisi), jadi Tupi baru bisa menjawab pertanyaan umum seperti **transfer antar dompet**, **anggaran bulanan**, cara atur **kategori**, mengelola **dompet**, **ekspor CSV**, atau cara **instal aplikasi di HP**. Coba ketik salah satu topik itu ya!";
    }
}


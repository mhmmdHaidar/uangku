# Uangku — Aplikasi Manajemen Keuangan Pribadi

**Uangku** adalah aplikasi web pengelola keuangan pribadi yang dirancang minimalis, elegan, dan fungsional. Aplikasi ini mengedepankan kecepatan pencatatan, tata letak data yang jernih, serta antarmuka modern yang terbebas dari kesan generik kecerdasan buatan (*anti-AI slop*).

---

## 💎 Karakteristik Desain & Estetika
* **Subtle Glassmorphism**: Permukaan latar belakang dengan efek blur transparan lembut (*backdrop-blur*), garis tepi tipis (*1px border*), tanpa bayangan kasar (*heavy drop shadows*) atau efek neon berlebihan.
* **Tipografi Organik & Modern**: Menggunakan font **Plus Jakarta Sans** dengan angka tabular (*tabular-nums*) untuk keterbacaan data finansial yang presisi.
* **Strictly No Emojis**: Menggunakan set ikon SVG profesional dari **Lucide Icons** untuk menjaga konsistensi tampilan.
* **Mode Terang & Gelap (Light / Dark Mode)**: Dilengkapi tombol pergantian mode berbasis ikon SVG tanpa flicker saat halaman dimuat.
* **Mobile-First Responsive**: Dirancang nyaman digunakan pada perangkat smartphone layar sentuh hingga monitor desktop lebar.

---

## 🛠️ Tech Stack
* **Backend Framework**: Laravel 11 (PHP 8.2+)
* **Frontend Framework**: React JS 18
* **Integration Layer**: Inertia JS (Server-driven Single Page Application)
* **Styling**: Tailwind CSS
* **Autentikasi**: Laravel Breeze (React + Inertia Stack)
* **Ikon**: Lucide React (SVG)
* **Database**: PostgreSQL (Supabase) & SQLite (Lokal out-of-the-box)

---

## 🚀 Fitur Utama
1. **Autentikasi & Multi-Tenant**:
   - Registrasi pengguna baru, Login, dan Logout yang aman.
   - **Isolasi Data Penuh**: Setiap pengguna hanya dapat melihat dan mengelola data keuangannya sendiri.
2. **Sistem 2 Dompet Finansial (Dompet Saldo & Dompet Cash)**:
   - **Dompet Saldo**: Mengelola saldo rekening bank, e-wallet, dan instrumen non-tunai.
   - **Dompet Cash**: Mengelola ketersediaan uang tunai / fisik di kantong.
   - **Sisa Uang (Total Gabungan)**: Kalkulasi otomatis saldo agregat (Saldo + Cash) secara real-time.
   - **Pilihan Dompet Transaksi**: Opsi pemilihan dompet sumber/tujuan langsung pada modal pencatatan transaksi.
   - **Ringkasan Arus Kas**: Total pemasukan dan total pengeluaran terpisah, dilengkapi perbandingan bulan berjalan.
   - **Visualisasi Proporsi Arus Kas**: Bar indikator persentase uang yang tersimpan vs terpakai.
3. **Pencatatan Transaksi Cepat**:
   - Modal input intuitif untuk mencatat Pemasukan atau Pengeluaran.
   - Input nominal dengan format Rupiah, judul/keterangan, kategori (dengan *quick chips*), tanggal transaksi, dan catatan tambahan.
4. **Halaman Laporan & Grafik Interaktif**:
   - Filter rentang waktu: **1 Minggu**, **1 Bulan**, **6 Bulan**, dan **1 Tahun**.
   - **Diagram Batang Ganda (Bar Chart)** & **Grafik Tren Area (Smooth Area Curve)** interaktif dengan *hover tooltip* presisi tinggi.
   - **Analisis Alokasi Kategori**: Pemeringkatan pengeluaran & pemasukan per kategori beserta persentase kontribusi.
   - **Metrik Analitis**: Total Pemasukan/Pengeluaran periode, Selisih Kas Bersih, Rasio Tabungan, Rata-rata pengeluaran harian, dan Transaksi terbesar.
   - **Ekspor CSV**: Unduh data transaksi periode terpilih dalam 1 klik ke format CSV/Excel.
5. **Riwayat & Filter Transaksi**:
   - Daftar transaksi terurut dari yang paling baru.
   - Filter cepat berdasarkan jenis (Semua, Pemasukan, Pengeluaran).
   - Pencarian real-time berdasarkan judul atau catatan.
   - Filter berdasarkan kategori transaksi.
   - Ubah (*Edit*) dan Hapus (*Delete*) transaksi dengan dialog konfirmasi aman.
   - Paginasi data rapi tanpa reload halaman penuh.

---

## ⚙️ Cara Menjalankan Aplikasi

### 1. Menjalankan Server Lokal
Pastikan dependencies sudah terpasang. Jalankan perintah berikut di terminal:

```bash
# Menjalankan server Laravel
php artisan serve
```

Aplikasi dapat dibuka di browser pada alamat:
👉 **`http://127.0.0.1:8000`**

Untuk menjalankan Vite asset watcher saat pengembangan frontend:
```bash
npm run dev
```

### 2. Akun Demo untuk Pengujian Langsung
Database lokal sudah dilengkapi dengan data contoh (seeder) yang dapat langsung dicoba:
* **Email**: `demo@uangku.id`
* **Password**: `password123`

Atau Anda juga dapat langsung mendaftar akun baru melalui tombol **Daftar Akun** pada halaman utama.

---

## 🌐 Konfigurasi Database Supabase (PostgreSQL)

Secara bawaan (*default*), aplikasi menggunakan database **SQLite** agar langsung dapat dijalankan tanpa konfigurasi tambahan.

Jika ingin menghubungkan ke database **Supabase PostgreSQL**:
1. Buka dashboard proyek Anda di [supabase.com](https://supabase.com).
2. Masuk ke **Project Settings** > **Database** > **Connection Parameters**.
3. Buka file `.env` di direktori proyek ini dan sesuaikan baris berikut:

```env
DB_CONNECTION=pgsql
DB_HOST=aws-0-ap-southeast-1.pooler.supabase.com  # Sesuaikan host Supabase Anda
DB_PORT=5432                                    # Atau 6543 untuk transaction pooler
DB_DATABASE=postgres
DB_USERNAME=postgres.your_project_id
DB_PASSWORD=your_supabase_password
DB_SSLMODE=require
```

4. Jalankan migrasi database ke Supabase:
```bash
php artisan migrate --seed
```

---

## 🧪 Pengujian Otomatis (Automated Tests)
Semua skenario pengujian unit dan fitur telah lolos verifikasi (100% Pass):
```bash
php artisan test
```
* Skenario meliputi: Autentikasi, Registrasi, Pengaturan Profil, CRUD Transaksi, Kalkulasi Saldo, serta Pengujian Isolasi Data Multi-Tenant.

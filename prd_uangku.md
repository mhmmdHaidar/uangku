# Product Requirements Document (PRD)

## 1. Informasi Umum
* **Nama Produk:** Uangku
* **Platform:** Web Application (Mobile-First)
* **Kategori:** Personal Finance Management
* **Status Dokumen:** Draft - Versi 1.0

## 2. Ringkasan Produk
Uangku adalah aplikasi web pengelola keuangan pribadi yang dirancang minimalis dan elegan. Aplikasi ini memungkinkan banyak pengguna (multi-user) untuk mendaftar dan mengelola arus kas mereka masing-masing secara independen. Fokus utama Uangku adalah kemudahan penggunaan, kecepatan pencatatan transaksi (pemasukan dan pengeluaran), serta antarmuka yang modern tanpa terlihat pasaran (menghindari gaya desain generik yang sering dihasilkan oleh kecerdasan buatan).

## 3. Tech Stack
* **Backend Framework:** Laravel (PHP)
* **Frontend Framework:** React JS
* **Integration Layer:** Inertia JS (Server-driven Single Page Application)
* **Database & Hosting Database:** Supabase (PostgreSQL)
* **Authentication:** Laravel Breeze
* **Styling:** Tailwind CSS

## 4. Fitur Utama

### 4.1. Autentikasi dan Multi-Login
* **Registrasi:** Pengguna baru dapat membuat akun menggunakan email dan kata sandi.
* **Login/Logout:** Sistem autentikasi aman untuk masuk dan keluar dari aplikasi.
* **Isolasi Data (Multi-tenant):** Setiap pengguna hanya dapat melihat dan mengelola data keuangannya sendiri.

### 4.2. Manajemen Transaksi (Dashboard)
* **Informasi Saldo (Sisa Uang):** Menampilkan kalkulasi otomatis dari total pemasukan dikurangi total pengeluaran.
* **Ringkasan Arus Kas:** Menampilkan total pemasukan dan total pengeluaran secara terpisah.
* **Input Transaksi:** Form sederhana untuk mencatat transaksi baru yang mencakup:
  * Jenis Transaksi (Pemasukan / Pengeluaran)
  * Judul / Catatan (Teks)
  * Nominal (Angka)
* **Riwayat Transaksi:** Daftar transaksi terakhir yang diurutkan dari yang paling baru.

### 4.3. User Interface & User Experience (UI/UX)
* **Tema Visual (Light & Dark Mode):** Pengguna dapat mengubah tampilan antarmuka antara mode terang dan gelap. Pergantian mode dilakukan melalui tombol khusus berbasis ikon sederhana atau teks (tanpa emoji).
* **Gaya Desain Glassmorphism Subtil:** 
  * Menggunakan efek blur pada latar belakang elemen dengan transparansi rendah.
  * Border tipis yang elegan.
  * Menghindari efek neon, bayangan kasar (heavy drop shadows), atau elemen yang terlalu mencolok.
* **Responsivitas:** Tampilan dioptimalkan penuh untuk perangkat seluler (Mobile-First) dan dapat menyesuaikan dengan baik pada layar tablet maupun desktop.
* **Tipografi:** Menggunakan font dengan karakter modern dan organik seperti Plus Jakarta Sans atau DM Sans.

## 5. Struktur Database (Supabase / PostgreSQL)

### 5.1. Tabel: users (Bawaan Laravel)
* id (Primary Key)
* name (String)
* email (String, Unique)
* password (String)
* timestamps (created_at, updated_at)

### 5.2. Tabel: transactions
* id (Primary Key)
* user_id (Foreign Key ke tabel users, Cascade on Delete)
* title (String)
* type (Enum: 'income', 'expense')
* amount (Decimal/Numeric)
* timestamps (created_at, updated_at)

## 6. Non-Functional Requirements
* **Keamanan:** Menerapkan CSRF protection bawaan Laravel dan validasi input yang ketat pada sisi server.
* **Performa:** Waktu muat halaman harus cepat, diuntungkan oleh arsitektur Inertia JS yang tidak memerlukan muat ulang halaman penuh.
* **Aksesibilitas:** Kontras warna antara teks dan latar belakang harus memenuhi standar minimum keterbacaan, baik pada mode terang maupun gelap.

## 7. Catatan Khusus Pengembangan
* Hindari penggunaan ikon berbasis emoji pada seluruh antarmuka aplikasi. Gunakan library ikon berbasis SVG (seperti Lucide Icons atau Heroicons) untuk menjaga konsistensi dan kesan profesional.
* Warna latar belakang (background) sebaiknya menggunakan warna solid atau gradasi sangat halus (muted colors) seperti off-white, sage green pucat, atau dark slate untuk mode gelap, agar efek glassmorphism dapat terlihat natural.
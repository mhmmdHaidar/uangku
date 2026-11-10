<?php

namespace Database\Seeders;

use App\Models\Transaction;
use App\Models\User;
use App\Models\Wallet;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $user = User::firstOrCreate(
            ['email' => 'demo@uangku.id'],
            [
                'name' => 'Haidar Pratama',
                'password' => Hash::make('password123'),
            ]
        );

        // Clear previous data for demo user
        $user->transactions()->delete();
        $user->wallets()->delete();

        // 1. Create realistic user wallets
        $bcaWallet = $user->wallets()->create([
            'name' => 'BCA Tahapan (Payroll)',
            'type' => 'bank',
            'account_number' => '8210948291',
            'initial_balance' => 8500000,
            'color' => 'blue',
        ]);

        $mandiriWallet = $user->wallets()->create([
            'name' => 'Bank Mandiri Livin',
            'type' => 'bank',
            'account_number' => '137001928374',
            'initial_balance' => 4200000,
            'color' => 'teal',
        ]);

        $gopayWallet = $user->wallets()->create([
            'name' => 'GoPay & QRIS',
            'type' => 'ewallet',
            'account_number' => '0812-3456-7890',
            'initial_balance' => 450000,
            'color' => 'emerald',
        ]);

        $cashWallet = $user->wallets()->create([
            'name' => 'Uang Tunai (Cash)',
            'type' => 'cash',
            'account_number' => null,
            'initial_balance' => 950000,
            'color' => 'amber',
        ]);

        $investWallet = $user->wallets()->create([
            'name' => 'Bibit Reksadana Pasar Uang',
            'type' => 'investment',
            'account_number' => 'INV-992014',
            'initial_balance' => 15000000,
            'color' => 'violet',
        ]);

        $today = Carbon::today();
        $transactions = [];

        // 2. Transactions for the past 12 months
        for ($i = 11; $i >= 0; $i--) {
            $monthDate = $today->copy()->subMonths($i);

            // Monthly Salary (BCA)
            $salaryDate = $monthDate->copy()->startOfMonth()->addDays(24);
            if ($salaryDate->greaterThan($today)) {
                $salaryDate = $monthDate->copy()->startOfMonth()->addDays(2);
            }
            $transactions[] = [
                'wallet_id' => $bcaWallet->id,
                'title' => 'Gaji Pokok ' . $monthDate->locale('id')->translatedFormat('F Y'),
                'type' => 'income',
                'wallet' => 'saldo',
                'amount' => 15000000,
                'category' => 'Gaji Pokok',
                'transaction_date' => $salaryDate->toDateString(),
                'notes' => 'Payroll transfer bank kantor',
            ];

            // Monthly Electricity & Water (Mandiri)
            $transactions[] = [
                'wallet_id' => $mandiriWallet->id,
                'title' => 'Tagihan Listrik & PAM ' . $monthDate->locale('id')->translatedFormat('F'),
                'type' => 'expense',
                'wallet' => 'saldo',
                'amount' => rand(480000, 620000),
                'category' => 'Tagihan & Utilitas',
                'transaction_date' => $monthDate->copy()->startOfMonth()->addDays(5)->toDateString(),
                'notes' => 'Pembayaran via m-banking Mandiri',
            ];

            // Monthly Internet (Mandiri)
            $transactions[] = [
                'wallet_id' => $mandiriWallet->id,
                'title' => 'Internet Fiber Rumah',
                'type' => 'expense',
                'wallet' => 'saldo',
                'amount' => 385000,
                'category' => 'Tagihan & Utilitas',
                'transaction_date' => $monthDate->copy()->startOfMonth()->addDays(10)->toDateString(),
                'notes' => 'Autodebet tagihan internet',
            ];

            // Monthly Groceries (BCA)
            $transactions[] = [
                'wallet_id' => $bcaWallet->id,
                'title' => 'Belanja Bulanan & Supermarket',
                'type' => 'expense',
                'wallet' => 'saldo',
                'amount' => rand(1200000, 1800000),
                'category' => 'Belanja',
                'transaction_date' => $monthDate->copy()->startOfMonth()->addDays(14)->toDateString(),
                'notes' => 'Kebutuhan dapur & rumah tangga',
            ];

            // Occasional Freelance / Bonus (BCA)
            if ($i % 2 === 0) {
                $transactions[] = [
                    'wallet_id' => $bcaWallet->id,
                    'title' => 'Proyek Freelance UI/UX ' . $monthDate->locale('id')->translatedFormat('M'),
                    'type' => 'income',
                    'wallet' => 'saldo',
                    'amount' => rand(2500000, 5000000),
                    'category' => 'Freelance / Proyek',
                    'transaction_date' => $monthDate->copy()->startOfMonth()->addDays(18)->toDateString(),
                    'notes' => 'Milestone pengerjaan aplikasi klien',
                ];
            }

            // Occasional Investment Dividend (Bibit)
            if ($i % 3 === 0) {
                $transactions[] = [
                    'wallet_id' => $investWallet->id,
                    'title' => 'Dividen Portofolio Reksadana',
                    'type' => 'income',
                    'wallet' => 'saldo',
                    'amount' => rand(600000, 1200000),
                    'category' => 'Investasi & Dividen',
                    'transaction_date' => $monthDate->copy()->startOfMonth()->addDays(20)->toDateString(),
                    'notes' => 'Passive income investasi pasar uang',
                ];
            }
        }

        // 3. Daily Cash & E-Wallet expenses for the past week
        $recentTransactions = [
            ['sub' => 6, 'wallet' => $cashWallet->id, 'w_type' => 'cash', 'title' => 'Beli Obat Apotek & Vitamin', 'type' => 'expense', 'amount' => 125000, 'cat' => 'Kesehatan'],
            ['sub' => 5, 'wallet' => $cashWallet->id, 'w_type' => 'cash', 'title' => 'Makan Malam Seafood', 'type' => 'expense', 'amount' => 240000, 'cat' => 'Makanan & Minuman'],
            ['sub' => 4, 'wallet' => $bcaWallet->id, 'w_type' => 'saldo', 'title' => 'Servis Ringan Kendaraan Motor', 'type' => 'expense', 'amount' => 195000, 'cat' => 'Transportasi'],
            ['sub' => 3, 'wallet' => $gopayWallet->id, 'w_type' => 'saldo', 'title' => 'Makan Siang & Es Kopi Susu', 'type' => 'expense', 'amount' => 85000, 'cat' => 'Makanan & Minuman'],
            ['sub' => 2, 'wallet' => $mandiriWallet->id, 'w_type' => 'saldo', 'title' => 'Beli Buku Pengembangan Diri', 'type' => 'expense', 'amount' => 140000, 'cat' => 'Pendidikan'],
            ['sub' => 1, 'wallet' => $gopayWallet->id, 'w_type' => 'saldo', 'title' => 'Kopi Pagi & Sarapan Roti', 'type' => 'expense', 'amount' => 45000, 'cat' => 'Makanan & Minuman'],
            ['sub' => 0, 'wallet' => $cashWallet->id, 'w_type' => 'cash', 'title' => 'Isi Bensin Pertamax SPBU', 'type' => 'expense', 'amount' => 150000, 'cat' => 'Transportasi'],
        ];

        foreach ($recentTransactions as $item) {
            $transactions[] = [
                'wallet_id' => $item['wallet'],
                'title' => $item['title'],
                'type' => $item['type'],
                'wallet' => $item['w_type'],
                'amount' => $item['amount'],
                'category' => $item['cat'],
                'transaction_date' => $today->copy()->subDays($item['sub'])->toDateString(),
                'notes' => 'Transaksi harian',
            ];
        }

        foreach ($transactions as $tx) {
            $user->transactions()->create($tx);
        }
    }
}

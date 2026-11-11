<?php

namespace Tests\Feature;

use App\Models\Budget;
use App\Models\Transaction;
use App\Models\User;
use App\Models\Wallet;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Inertia\Testing\AssertableInertia;
use Tests\TestCase;

class TransferAndReportTest extends TestCase
{
    use RefreshDatabase;

    private function makeWallet(User $user, string $name, string $type, float $initialBalance): Wallet
    {
        return Wallet::create([
            'user_id' => $user->id,
            'name' => $name,
            'type' => $type,
            'initial_balance' => $initialBalance,
            'color' => 'navy',
        ]);
    }

    public function test_user_can_create_and_delete_wallet_transfer_preserving_total_balance_without_inflating_income_or_expense(): void
    {
        $user = User::factory()->create();
        $bank = $this->makeWallet($user, 'BCA Utama', 'bank', 2000000);
        $ewallet = $this->makeWallet($user, 'GoPay', 'e_wallet', 500000);

        $today = Carbon::now()->toDateString();

        // Create transfer of 350,000 from BCA -> GoPay
        $response = $this->actingAs($user)->post(route('transactions.store'), [
            'title' => 'Top Up GoPay Bulanan',
            'amount' => 350000,
            'type' => 'transfer',
            'wallet_id' => $bank->id,
            'to_wallet_id' => $ewallet->id,
            'transaction_date' => $today,
            'notes' => 'Alokasi transport',
        ]);

        $response->assertRedirect();
        $response->assertSessionHasNoErrors();

        $this->assertDatabaseHas('transactions', [
            'user_id' => $user->id,
            'type' => 'transfer',
            'wallet_id' => $bank->id,
            'to_wallet_id' => $ewallet->id,
            'amount' => 350000,
            'category' => null,
        ]);

        // Individual wallet balances updated accurately, total remains 2,500,000
        $this->assertEquals(1650000.0, (float) $bank->fresh()->current_balance);
        $this->assertEquals(850000.0, (float) $ewallet->fresh()->current_balance);

        // Dashboard metrics exclude transfer from income & expense
        $this->actingAs($user)
            ->get(route('dashboard'))
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->component('Dashboard')
                ->where('metrics.total_balance', 2500000)
                ->has('wallets.0.current_balance')
                ->where('metrics.total_income', 0)
                ->where('metrics.total_expense', 0)
                ->where('metrics.month_income', 0)
                ->where('metrics.month_expense', 0)
            );

        // Deleting transfer restores original balances
        $transfer = Transaction::where('user_id', $user->id)->where('type', 'transfer')->firstOrFail();

        $this->actingAs($user)
            ->delete(route('transactions.destroy', $transfer))
            ->assertRedirect();

        $this->assertEquals(2000000.0, (float) $bank->fresh()->current_balance);
        $this->assertEquals(500000.0, (float) $ewallet->fresh()->current_balance);
    }

    public function test_transfer_validation_rejects_same_wallet_and_foreign_target_wallet(): void
    {
        $user = User::factory()->create();
        $stranger = User::factory()->create();

        $myWallet = $this->makeWallet($user, 'Dompet Saya', 'cash', 1000000);
        $strangerWallet = $this->makeWallet($stranger, 'Dompet Orang Lain', 'bank', 1000000);

        $today = Carbon::now()->toDateString();

        // Same source & target wallet
        $this->actingAs($user)
            ->post(route('transactions.store'), [
                'title' => 'Transfer Diri Sendiri',
                'amount' => 100000,
                'type' => 'transfer',
                'wallet_id' => $myWallet->id,
                'to_wallet_id' => $myWallet->id,
                'transaction_date' => $today,
            ])
            ->assertSessionHasErrors('to_wallet_id');

        // Foreign target wallet belongs to another user (403)
        $this->actingAs($user)
            ->post(route('transactions.store'), [
                'title' => 'Kirim Ke Orang Lain',
                'amount' => 100000,
                'type' => 'transfer',
                'wallet_id' => $myWallet->id,
                'to_wallet_id' => $strangerWallet->id,
                'transaction_date' => $today,
            ])
            ->assertForbidden();
    }

    public function test_expense_or_income_succeeds_even_if_stale_to_wallet_id_matches_wallet_id(): void
    {
        $user = User::factory()->create();
        $wallet = $this->makeWallet($user, 'GoPay', 'ewallet', 1000000);

        $today = Carbon::now()->toDateString();

        $response = $this->actingAs($user)->post(route('transactions.store'), [
            'title' => 'Beli Makan Siang',
            'amount' => 400000,
            'type' => 'expense',
            'wallet_id' => $wallet->id,
            'to_wallet_id' => $wallet->id,
            'category' => 'Makanan & Minuman',
            'transaction_date' => $today,
        ]);

        $response->assertRedirect();
        $response->assertSessionHasNoErrors();

        $this->assertDatabaseHas('transactions', [
            'user_id' => $user->id,
            'title' => 'Beli Makan Siang',
            'type' => 'expense',
            'wallet_id' => $wallet->id,
            'to_wallet_id' => null,
            'amount' => 400000,
        ]);

        $this->assertEquals(600000.0, (float) $wallet->fresh()->current_balance);
    }

    public function test_reports_filter_by_wallet_id_include_budgets_and_exclude_transfers_from_income_expense_metrics(): void
    {
        $user = User::factory()->create();
        $bca = $this->makeWallet($user, 'BCA', 'bank', 1000000);
        $cash = $this->makeWallet($user, 'Uang Tunai', 'cash', 200000);

        $today = Carbon::now()->toDateString();

        Transaction::create([
            'user_id' => $user->id,
            'wallet_id' => $bca->id,
            'title' => 'Gaji Proyek',
            'amount' => 3000000,
            'type' => 'income',
            'category' => 'Gaji',
            'transaction_date' => $today,
        ]);

        Transaction::create([
            'user_id' => $user->id,
            'wallet_id' => $bca->id,
            'title' => 'Listrik',
            'amount' => 450000,
            'type' => 'expense',
            'category' => 'Tagihan & Utilitas',
            'transaction_date' => $today,
        ]);

        Transaction::create([
            'user_id' => $user->id,
            'wallet_id' => $cash->id,
            'title' => 'Kopi',
            'amount' => 50000,
            'type' => 'expense',
            'category' => 'Makanan & Minuman',
            'transaction_date' => $today,
        ]);

        Transaction::create([
            'user_id' => $user->id,
            'wallet_id' => $bca->id,
            'to_wallet_id' => $cash->id,
            'title' => 'Tarik Tunai ATM',
            'amount' => 500000,
            'type' => 'transfer',
            'category' => null,
            'transaction_date' => $today,
        ]);

        Budget::create([
            'user_id' => $user->id,
            'category' => 'Tagihan & Utilitas',
            'limit_amount' => 600000,
        ]);

        // Unfiltered report excludes transfer from income & expense (income = 3,000,000, expense = 500,000)
        $this->actingAs($user)
            ->get(route('reports.index', ['timeframe' => '1m']))
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->component('Report')
                ->where('metrics.total_income', 3000000)
                ->where('metrics.total_expense', 500000)
                ->has('budgets', 1)
                ->where('budgets.0.spent_amount', 450000)
            );

        // Filtered by cash wallet: only Coffee (50k) in expense, income = 0, transfer appears in transaction list
        $this->actingAs($user)
            ->get(route('reports.index', ['timeframe' => '1m', 'wallet_id' => $cash->id]))
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->component('Report')
                ->where('filters.wallet_id', (string) $cash->id)
                ->where('metrics.total_income', 0)
                ->where('metrics.total_expense', 50000)
                ->has('transactions.data', 2)
            );

        // CSV export filtered by wallet_id
        $csvResponse = $this->actingAs($user)
            ->get(route('reports.export', ['timeframe' => '1m', 'wallet_id' => $cash->id]));

        $csvResponse->assertOk();
        $csvContent = $csvResponse->streamedContent();
        $this->assertStringContainsString('Kopi', $csvContent);
        $this->assertStringContainsString('Tarik Tunai ATM', $csvContent);
        $this->assertStringNotContainsString('Gaji Proyek', $csvContent);
    }
}

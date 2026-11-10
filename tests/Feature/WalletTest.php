<?php

namespace Tests\Feature;

use App\Models\Transaction;
use App\Models\User;
use App\Models\Wallet;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class WalletTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_cannot_access_wallets_page(): void
    {
        $response = $this->get('/wallets');
        $response->assertRedirect('/login');
    }

    public function test_authenticated_user_can_view_wallets_and_auto_seeds_defaults(): void
    {
        $user = User::factory()->create();

        $this->assertEquals(0, $user->wallets()->count());

        $response = $this->actingAs($user)->get('/wallets');

        $response->assertStatus(200);
        // Default starter wallets should be created automatically
        $this->assertDatabaseHas('wallets', [
            'user_id' => $user->id,
            'name' => 'Rekening Utama',
            'type' => 'bank',
        ]);
        $this->assertDatabaseHas('wallets', [
            'user_id' => $user->id,
            'name' => 'Uang Tunai (Cash)',
            'type' => 'cash',
        ]);
    }

    public function test_user_can_create_a_custom_wallet(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post('/wallets', [
            'name' => 'BCA Tahapan',
            'type' => 'bank',
            'account_number' => '1234567890',
            'initial_balance' => 5000000,
            'color' => '#3b82f6',
        ]);

        $response->assertSessionHas('success');
        $this->assertDatabaseHas('wallets', [
            'user_id' => $user->id,
            'name' => 'BCA Tahapan',
            'type' => 'bank',
            'account_number' => '1234567890',
            'initial_balance' => 5000000,
            'color' => '#3b82f6',
        ]);
    }

    public function test_user_can_update_their_own_wallet(): void
    {
        $user = User::factory()->create();
        $wallet = $user->wallets()->create([
            'name' => 'GoPay',
            'type' => 'ewallet',
            'account_number' => '08123456789',
            'initial_balance' => 100000,
            'color' => '#10b981',
        ]);

        $response = $this->actingAs($user)->put("/wallets/{$wallet->id}", [
            'name' => 'GoPay Utama',
            'type' => 'ewallet',
            'account_number' => '08129999888',
            'initial_balance' => 250000,
            'color' => '#06b6d4',
        ]);

        $response->assertSessionHas('success');
        $this->assertDatabaseHas('wallets', [
            'id' => $wallet->id,
            'name' => 'GoPay Utama',
            'initial_balance' => 250000,
            'color' => '#06b6d4',
        ]);
    }

    public function test_user_cannot_update_another_users_wallet(): void
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();

        $wallet = $user1->wallets()->create([
            'name' => 'Dompet Rahasia',
            'type' => 'cash',
            'initial_balance' => 1000000,
            'color' => '#10b981',
        ]);

        $response = $this->actingAs($user2)->put("/wallets/{$wallet->id}", [
            'name' => 'Hacked Dompet',
            'type' => 'cash',
            'initial_balance' => 0,
            'color' => '#000000',
        ]);

        $response->assertStatus(403);
        $this->assertDatabaseHas('wallets', [
            'id' => $wallet->id,
            'name' => 'Dompet Rahasia',
        ]);
    }

    public function test_user_can_delete_their_own_wallet(): void
    {
        $user = User::factory()->create();
        $wallet = $user->wallets()->create([
            'name' => 'OVO Lama',
            'type' => 'ewallet',
            'initial_balance' => 0,
            'color' => '#8b5cf6',
        ]);

        $response = $this->actingAs($user)->delete("/wallets/{$wallet->id}");

        $response->assertSessionHas('success');
        $this->assertDatabaseMissing('wallets', [
            'id' => $wallet->id,
        ]);
    }

    public function test_user_cannot_delete_another_users_wallet(): void
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();

        $wallet = $user1->wallets()->create([
            'name' => 'Mandiri Bisnis',
            'type' => 'bank',
            'initial_balance' => 50000000,
            'color' => '#3b82f6',
        ]);

        $response = $this->actingAs($user2)->delete("/wallets/{$wallet->id}");

        $response->assertStatus(403);
        $this->assertDatabaseHas('wallets', [
            'id' => $wallet->id,
        ]);
    }

    public function test_wallet_current_balance_calculation_with_transactions(): void
    {
        $user = User::factory()->create();
        $wallet = $user->wallets()->create([
            'name' => 'Tabungan BSI',
            'type' => 'bank',
            'initial_balance' => 1000000, // 1.000.000
            'color' => '#10b981',
        ]);

        // Income +500,000
        $user->transactions()->create([
            'wallet_id' => $wallet->id,
            'title' => 'Transfer Masuk',
            'type' => 'income',
            'wallet' => 'saldo',
            'amount' => 500000,
            'transaction_date' => now()->toDateString(),
        ]);

        // Expense -200,000
        $user->transactions()->create([
            'wallet_id' => $wallet->id,
            'title' => 'Beli Kuota',
            'type' => 'expense',
            'wallet' => 'saldo',
            'amount' => 200000,
            'transaction_date' => now()->toDateString(),
        ]);

        // Expected: 1,000,000 + 500,000 - 200,000 = 1,300,000
        $wallet->refresh();
        $this->assertEquals(1300000, $wallet->current_balance);
    }

    public function test_user_can_view_their_own_wallet_detail_page(): void
    {
        $user = User::factory()->create();
        $wallet = $user->wallets()->create([
            'name' => 'BCA Syariah',
            'type' => 'bank',
            'initial_balance' => 2000000,
            'color' => 'teal',
        ]);

        $user->transactions()->create([
            'wallet_id' => $wallet->id,
            'title' => 'Dividen Investasi',
            'type' => 'income',
            'wallet' => 'saldo',
            'amount' => 300000,
            'transaction_date' => now()->toDateString(),
        ]);

        $response = $this->actingAs($user)->get("/wallets/{$wallet->id}");

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Wallet/Show')
            ->has('wallet')
            ->has('chartData')
            ->has('transactions')
            ->where('wallet.name', 'BCA Syariah')
        );
    }

    public function test_user_cannot_view_another_users_wallet_detail_page(): void
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();

        $wallet = $user1->wallets()->create([
            'name' => 'Dompet Rahasia',
            'type' => 'cash',
            'initial_balance' => 500000,
            'color' => 'amber',
        ]);

        $response = $this->actingAs($user2)->get("/wallets/{$wallet->id}");

        $response->assertStatus(403);
    }

    public function test_wallet_detail_page_supports_timeframe_and_type_filters(): void
    {
        $user = User::factory()->create();
        $wallet = $user->wallets()->create([
            'name' => 'GoPay Tabungan',
            'type' => 'ewallet',
            'initial_balance' => 100000,
            'color' => 'blue',
        ]);

        $response = $this->actingAs($user)->get("/wallets/{$wallet->id}?timeframe=6m&type=income");

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Wallet/Show')
            ->where('timeframe', '6m')
        );
    }
}

<?php

namespace Tests\Feature;

use App\Models\Transaction;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TransactionTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_cannot_access_dashboard(): void
    {
        $response = $this->get('/dashboard');
        $response->assertRedirect('/login');
    }

    public function test_authenticated_user_can_view_dashboard(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get('/dashboard');

        $response->assertStatus(200);
    }

    public function test_user_can_create_income_and_expense_transactions_with_wallet(): void
    {
        $user = User::factory()->create();

        // Income to Dompet Saldo
        $response = $this->actingAs($user)->post('/transactions', [
            'title' => 'Gaji Bulanan',
            'type' => 'income',
            'wallet' => 'saldo',
            'amount' => 10000000,
            'category' => 'Gaji',
            'transaction_date' => '2026-11-09',
            'notes' => 'Gaji bulan ini',
        ]);

        $response->assertSessionHas('success');
        $this->assertDatabaseHas('transactions', [
            'user_id' => $user->id,
            'title' => 'Gaji Bulanan',
            'type' => 'income',
            'wallet' => 'saldo',
            'amount' => 10000000,
        ]);

        // Expense from Dompet Cash
        $response = $this->actingAs($user)->post('/transactions', [
            'title' => 'Makan Siang Tunai',
            'type' => 'expense',
            'wallet' => 'cash',
            'amount' => 50000,
            'category' => 'Makanan',
            'transaction_date' => '2026-11-09',
        ]);

        $response->assertSessionHas('success');
        $this->assertDatabaseHas('transactions', [
            'user_id' => $user->id,
            'title' => 'Makan Siang Tunai',
            'type' => 'expense',
            'wallet' => 'cash',
            'amount' => 50000,
        ]);
    }

    public function test_user_can_update_their_own_transaction_wallet(): void
    {
        $user = User::factory()->create();
        $transaction = $user->transactions()->create([
            'title' => 'Beli Baju',
            'type' => 'expense',
            'wallet' => 'saldo',
            'amount' => 200000,
            'transaction_date' => '2026-11-09',
        ]);

        $response = $this->actingAs($user)->put("/transactions/{$transaction->id}", [
            'title' => 'Beli Jaket Hangat',
            'type' => 'expense',
            'wallet' => 'cash',
            'amount' => 250000,
            'category' => 'Belanja',
            'transaction_date' => '2026-11-09',
        ]);

        $response->assertSessionHas('success');
        $this->assertDatabaseHas('transactions', [
            'id' => $transaction->id,
            'title' => 'Beli Jaket Hangat',
            'wallet' => 'cash',
            'amount' => 250000,
        ]);
    }

    public function test_user_can_delete_their_own_transaction(): void
    {
        $user = User::factory()->create();
        $transaction = $user->transactions()->create([
            'title' => 'Langganan Musik',
            'type' => 'expense',
            'wallet' => 'saldo',
            'amount' => 60000,
            'transaction_date' => '2026-11-09',
        ]);

        $response = $this->actingAs($user)->delete("/transactions/{$transaction->id}");

        $response->assertSessionHas('success');
        $this->assertDatabaseMissing('transactions', [
            'id' => $transaction->id,
        ]);
    }

    public function test_multi_tenant_isolation_prevents_user_modifying_others_transactions(): void
    {
        $userA = User::factory()->create();
        $userB = User::factory()->create();

        $transactionA = $userA->transactions()->create([
            'title' => 'Rahasia Keuangan User A',
            'type' => 'income',
            'wallet' => 'saldo',
            'amount' => 50000000,
            'transaction_date' => '2026-11-09',
        ]);

        // User B attempts to edit User A's transaction
        $response = $this->actingAs($userB)->put("/transactions/{$transactionA->id}", [
            'title' => 'Hacked by User B',
            'type' => 'expense',
            'wallet' => 'cash',
            'amount' => 1000,
            'transaction_date' => '2026-11-09',
        ]);

        $response->assertStatus(403);

        // User B attempts to delete User A's transaction
        $deleteResponse = $this->actingAs($userB)->delete("/transactions/{$transactionA->id}");
        $deleteResponse->assertStatus(403);

        // Verify transaction A is untouched
        $this->assertDatabaseHas('transactions', [
            'id' => $transactionA->id,
            'title' => 'Rahasia Keuangan User A',
        ]);
    }

    public function test_guests_cannot_access_transactions_history_page(): void
    {
        $response = $this->get('/transactions');
        $response->assertRedirect('/login');
    }

    public function test_authenticated_user_can_view_transactions_history_page(): void
    {
        $user = User::factory()->create();

        // Create sample transactions
        $user->transactions()->create([
            'title' => 'Penjualan Desain',
            'type' => 'income',
            'amount' => 1500000,
            'category' => 'Bisnis',
            'transaction_date' => '2026-11-09',
        ]);

        $user->transactions()->create([
            'title' => 'Bayar Tagihan Wifi',
            'type' => 'expense',
            'amount' => 350000,
            'category' => 'Tagihan & Utilitas',
            'transaction_date' => '2026-11-09',
        ]);

        $response = $this->actingAs($user)->get('/transactions');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Transaction/Index')
            ->has('transactions.data', 2)
            ->has('summary')
            ->where('summary.total_count', 2)
            ->where('summary.total_income', 1500000)
            ->where('summary.total_expense', 350000)
            ->where('summary.net_cashflow', 1150000)
        );
    }

    public function test_transactions_history_supports_period_type_and_search_filters(): void
    {
        $user = User::factory()->create();

        $user->transactions()->create([
            'title' => 'Gaji Bulanan PT Maju',
            'type' => 'income',
            'amount' => 12000000,
            'category' => 'Gaji Pokok',
            'transaction_date' => now()->toDateString(),
            'notes' => 'Gaji transfer payroll',
        ]);

        $user->transactions()->create([
            'title' => 'Beli Meja Kerja',
            'type' => 'expense',
            'amount' => 1200000,
            'category' => 'Belanja',
            'transaction_date' => now()->toDateString(),
            'notes' => 'Furnitur kantor',
        ]);

        // Filter by type: income
        $response = $this->actingAs($user)->get('/transactions?type=income');
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->has('transactions.data', 1)
            ->where('transactions.data.0.title', 'Gaji Bulanan PT Maju')
        );

        // Filter by search: Meja
        $searchResponse = $this->actingAs($user)->get('/transactions?search=Meja');
        $searchResponse->assertStatus(200);
        $searchResponse->assertInertia(fn ($page) => $page
            ->has('transactions.data', 1)
            ->where('transactions.data.0.title', 'Beli Meja Kerja')
        );

        // Filter by period: today
        $periodResponse = $this->actingAs($user)->get('/transactions?period=today');
        $periodResponse->assertStatus(200);
        $periodResponse->assertInertia(fn ($page) => $page
            ->has('transactions.data', 2)
        );
    }

    public function test_user_can_export_transactions_csv(): void
    {
        $user = User::factory()->create();

        $user->transactions()->create([
            'title' => 'Dividen Saham',
            'type' => 'income',
            'amount' => 2500000,
            'category' => 'Investasi & Dividen',
            'transaction_date' => '2026-11-09',
        ]);

        $response = $this->actingAs($user)->get('/transactions/export');

        $response->assertStatus(200);
        $this->assertEquals('text/csv; charset=UTF-8', $response->headers->get('content-type'));
        $this->assertStringContainsString('Dividen Saham', $response->streamedContent());
        $this->assertStringContainsString('Pemasukan', $response->streamedContent());
    }

    public function test_transactions_history_enforces_multi_tenant_isolation(): void
    {
        $userA = User::factory()->create();
        $userB = User::factory()->create();

        $userA->transactions()->create([
            'title' => 'Gaji Rahasia User A',
            'type' => 'income',
            'amount' => 99000000,
            'transaction_date' => '2026-11-09',
        ]);

        $userB->transactions()->create([
            'title' => 'Pengeluaran Pribadi User B',
            'type' => 'expense',
            'amount' => 50000,
            'transaction_date' => '2026-11-09',
        ]);

        // User A only sees their transaction
        $responseA = $this->actingAs($userA)->get('/transactions');
        $responseA->assertInertia(fn ($page) => $page
            ->has('transactions.data', 1)
            ->where('transactions.data.0.title', 'Gaji Rahasia User A')
            ->where('summary.total_count', 1)
        );

        // User B only sees their transaction
        $responseB = $this->actingAs($userB)->get('/transactions');
        $responseB->assertInertia(fn ($page) => $page
            ->has('transactions.data', 1)
            ->where('transactions.data.0.title', 'Pengeluaran Pribadi User B')
            ->where('summary.total_count', 1)
        );
    }
}

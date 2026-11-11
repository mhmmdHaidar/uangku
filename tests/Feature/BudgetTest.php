<?php

namespace Tests\Feature;

use App\Models\Budget;
use App\Models\Transaction;
use App\Models\User;
use App\Models\Wallet;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Tests\TestCase;

class BudgetTest extends TestCase
{
    use RefreshDatabase;

    private function makeWallet(User $user, string $name = 'BCA', float $initialBalance = 1000000): Wallet
    {
        return Wallet::create([
            'user_id' => $user->id,
            'name' => $name,
            'type' => 'bank',
            'initial_balance' => $initialBalance,
            'color' => 'navy',
        ]);
    }

    public function test_user_can_create_update_and_delete_budget(): void
    {
        $user = User::factory()->create();

        // Store new category budget
        $storeResponse = $this->actingAs($user)->post(route('budgets.store'), [
            'category' => 'Makanan & Minuman',
            'limit_amount' => 1500000,
        ]);

        $storeResponse->assertRedirect();
        $storeResponse->assertSessionHasNoErrors();

        $this->assertDatabaseHas('budgets', [
            'user_id' => $user->id,
            'category' => 'Makanan & Minuman',
            'limit_amount' => 1500000,
        ]);

        // Storing the same category again updates cleanly (updateOrCreate)
        $upsertResponse = $this->actingAs($user)->post(route('budgets.store'), [
            'category' => 'Makanan & Minuman',
            'limit_amount' => 2000000,
        ]);

        $upsertResponse->assertRedirect();
        $this->assertEquals(1, Budget::where('user_id', $user->id)->where('category', 'Makanan & Minuman')->count());
        $this->assertDatabaseHas('budgets', [
            'user_id' => $user->id,
            'category' => 'Makanan & Minuman',
            'limit_amount' => 2000000,
        ]);

        $budget = Budget::where('user_id', $user->id)->firstOrFail();

        // Explicit PUT update
        $updateResponse = $this->actingAs($user)->put(route('budgets.update', $budget), [
            'category' => 'Makanan & Minuman',
            'limit_amount' => 2500000,
        ]);

        $updateResponse->assertRedirect();
        $this->assertEquals(2500000.0, (float) $budget->fresh()->limit_amount);

        // Delete
        $deleteResponse = $this->actingAs($user)->delete(route('budgets.destroy', $budget));
        $deleteResponse->assertRedirect();
        $this->assertDatabaseMissing('budgets', ['id' => $budget->id]);
    }

    public function test_budget_progress_calculates_safe_warning_exceeded_and_ignores_transfers_and_income(): void
    {
        $user = User::factory()->create();
        $walletA = $this->makeWallet($user, 'BCA', 5000000);
        $walletB = $this->makeWallet($user, 'GoPay', 500000);

        $now = Carbon::now();

        Budget::create(['user_id' => $user->id, 'category' => 'Transportasi', 'limit_amount' => 1000000]); // safe (50%)
        Budget::create(['user_id' => $user->id, 'category' => 'Makanan & Minuman', 'limit_amount' => 1000000]); // warning (85%)
        Budget::create(['user_id' => $user->id, 'category' => 'Belanja', 'limit_amount' => 500000]); // exceeded (120%)

        // Current month expenses
        Transaction::create([
            'user_id' => $user->id,
            'wallet_id' => $walletA->id,
            'title' => 'Bensin',
            'amount' => 500000,
            'type' => 'expense',
            'category' => 'Transportasi',
            'transaction_date' => $now->toDateString(),
        ]);

        Transaction::create([
            'user_id' => $user->id,
            'wallet_id' => $walletA->id,
            'title' => 'Makan Sebulan',
            'amount' => 850000,
            'type' => 'expense',
            'category' => 'Makanan & Minuman',
            'transaction_date' => $now->toDateString(),
        ]);

        Transaction::create([
            'user_id' => $user->id,
            'wallet_id' => $walletA->id,
            'title' => 'Sepatu',
            'amount' => 600000,
            'type' => 'expense',
            'category' => 'Belanja',
            'transaction_date' => $now->toDateString(),
        ]);

        // Income, transfer, and previous-month expense should NOT count toward current month Transportasi budget
        Transaction::create([
            'user_id' => $user->id,
            'wallet_id' => $walletA->id,
            'title' => 'Reimburse Transport',
            'amount' => 400000,
            'type' => 'income',
            'category' => 'Transportasi',
            'transaction_date' => $now->toDateString(),
        ]);

        Transaction::create([
            'user_id' => $user->id,
            'wallet_id' => $walletA->id,
            'to_wallet_id' => $walletB->id,
            'title' => 'Top Up Transport',
            'amount' => 900000,
            'type' => 'transfer',
            'category' => 'Transportasi',
            'transaction_date' => $now->toDateString(),
        ]);

        Transaction::create([
            'user_id' => $user->id,
            'wallet_id' => $walletA->id,
            'title' => 'Bensin Bulan Lalu',
            'amount' => 900000,
            'type' => 'expense',
            'category' => 'Transportasi',
            'transaction_date' => $now->copy()->subMonth()->toDateString(),
        ]);

        $progress = collect(Budget::progressForUser($user, $now))->keyBy('category');

        $this->assertEquals('safe', $progress['Transportasi']['status']);
        $this->assertEquals(500000.0, (float) $progress['Transportasi']['spent_amount']);
        $this->assertEquals(500000.0, (float) $progress['Transportasi']['remaining_amount']);

        $this->assertEquals('warning', $progress['Makanan & Minuman']['status']);
        $this->assertEquals(85.0, (float) $progress['Makanan & Minuman']['percentage']);

        $this->assertEquals('exceeded', $progress['Belanja']['status']);
        $this->assertEquals(-100000.0, (float) $progress['Belanja']['remaining_amount']);
    }

    public function test_budget_progress_matches_categories_case_insensitively_and_trimmed(): void
    {
        $user = User::factory()->create();
        $wallet = $this->makeWallet($user, 'Cash', 1000000);
        $now = Carbon::now();

        Budget::create([
            'user_id' => $user->id,
            'category' => 'Makanan',
            'limit_amount' => 500000,
        ]);

        Transaction::create([
            'user_id' => $user->id,
            'wallet_id' => $wallet->id,
            'title' => 'Makan Malam',
            'amount' => 400000,
            'type' => 'expense',
            'category' => ' makanan ',
            'transaction_date' => $now->toDateString(),
        ]);

        $progress = collect(Budget::progressForUser($user, $now))->keyBy('category');

        $this->assertEquals(400000.0, (float) $progress['Makanan']['spent_amount']);
        $this->assertEquals(80.0, (float) $progress['Makanan']['percentage']);
        $this->assertEquals('warning', $progress['Makanan']['status']);
    }

    public function test_user_cannot_modify_or_delete_other_users_budget(): void
    {
        $owner = User::factory()->create();
        $intruder = User::factory()->create();

        $budget = Budget::create([
            'user_id' => $owner->id,
            'category' => 'Hiburan',
            'limit_amount' => 400000,
        ]);

        $this->actingAs($intruder)
            ->put(route('budgets.update', $budget), [
                'category' => 'Hiburan',
                'limit_amount' => 999999,
            ])
            ->assertForbidden();

        $this->actingAs($intruder)
            ->delete(route('budgets.destroy', $budget))
            ->assertForbidden();

        $this->assertDatabaseHas('budgets', [
            'id' => $budget->id,
            'limit_amount' => 400000,
        ]);
    }
}


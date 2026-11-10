<?php

namespace Tests\Feature;

use App\Models\Transaction;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReportTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_cannot_access_reports(): void
    {
        $response = $this->get('/reports');
        $response->assertRedirect('/login');
    }

    public function test_authenticated_user_can_access_reports_with_all_timeframes(): void
    {
        $user = User::factory()->create();

        // Seed sample transactions
        $user->transactions()->create([
            'title' => 'Gaji Pokok',
            'type' => 'income',
            'wallet' => 'saldo',
            'amount' => 10000000,
            'category' => 'Gaji',
            'transaction_date' => now()->toDateString(),
        ]);

        $user->transactions()->create([
            'title' => 'Makan Siang Tunai',
            'type' => 'expense',
            'wallet' => 'cash',
            'amount' => 50000,
            'category' => 'Makanan',
            'transaction_date' => now()->subDays(2)->toDateString(),
        ]);

        foreach (['1w', '1m', '6m', '1y'] as $timeframe) {
            $response = $this->actingAs($user)->get("/reports?timeframe={$timeframe}");
            $response->assertStatus(200);
            $response->assertInertia(fn ($page) => $page
                ->component('Report')
                ->has('chartData')
                ->has('metrics')
                ->has('categoryBreakdown')
                ->where('timeframe', $timeframe)
            );
        }
    }

    public function test_reports_enforce_multi_tenant_isolation(): void
    {
        $userA = User::factory()->create();
        $userB = User::factory()->create();

        $userA->transactions()->create([
            'title' => 'Pemasukan Rahasia User A',
            'type' => 'income',
            'wallet' => 'saldo',
            'amount' => 99000000,
            'category' => 'Investasi',
            'transaction_date' => now()->toDateString(),
        ]);

        $userB->transactions()->create([
            'title' => 'Gaji Biasa User B',
            'type' => 'income',
            'wallet' => 'saldo',
            'amount' => 5000000,
            'category' => 'Gaji',
            'transaction_date' => now()->toDateString(),
        ]);

        // User B views reports
        $response = $this->actingAs($userB)->get('/reports');
        $response->assertStatus(200);

        // User B's metrics should only reflect User B's 5.000.000, NOT User A's 99.000.000
        $response->assertInertia(fn ($page) => $page
            ->where('metrics.total_income', 5000000)
            ->where('metrics.total_expense', 0)
        );
    }

    public function test_user_can_export_csv_report(): void
    {
        $user = User::factory()->create();

        $user->transactions()->create([
            'title' => 'Tagihan WiFi Rumah',
            'type' => 'expense',
            'wallet' => 'saldo',
            'amount' => 350000,
            'category' => 'Tagihan',
            'transaction_date' => now()->toDateString(),
        ]);

        $response = $this->actingAs($user)->get('/reports/export?timeframe=1m');

        $response->assertStatus(200);
        $this->assertTrue($response->headers->contains('content-type', 'text/csv; charset=UTF-8'));
    }
}

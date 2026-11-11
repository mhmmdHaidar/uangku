<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TutorialTest extends TestCase
{
    use RefreshDatabase;

    public function test_registered_user_starts_with_uncompleted_tutorial(): void
    {
        $response = $this->post('/register', [
            'name' => 'Tupi Tester',
            'email' => 'tupi@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertRedirect('/dashboard');
        $this->assertDatabaseHas('users', [
            'email' => 'tupi@example.com',
            'has_completed_tutorial' => false,
            'has_created_wallet' => false,
        ]);

        $user = User::where('email', 'tupi@example.com')->firstOrFail();
        $this->assertEquals(1, $user->wallets()->count());
        $this->assertDatabaseHas('wallets', [
            'user_id' => $user->id,
            'name' => 'Uang Tunai (Cash)',
            'type' => 'cash',
        ]);
        $this->assertDatabaseMissing('wallets', [
            'user_id' => $user->id,
            'name' => 'Rekening Utama',
        ]);
    }

    public function test_user_can_complete_tutorial(): void
    {
        $user = User::factory()->create([
            'has_completed_tutorial' => false,
        ]);

        $response = $this->actingAs($user)->post('/tutorial/complete', [
            'redirect_to' => '/dashboard?open_tx=1',
        ]);

        $response->assertRedirect('/dashboard?open_tx=1');
        $this->assertTrue($user->fresh()->has_completed_tutorial);
    }

    public function test_user_can_reset_tutorial_to_replay(): void
    {
        $user = User::factory()->create([
            'has_completed_tutorial' => true,
        ]);

        $response = $this->actingAs($user)->post('/tutorial/reset');

        $response->assertRedirect('/dashboard');
        $this->assertFalse($user->fresh()->has_completed_tutorial);
    }

    public function test_guests_cannot_call_tutorial_endpoints(): void
    {
        $this->post('/tutorial/complete')->assertRedirect('/login');
        $this->post('/tutorial/reset')->assertRedirect('/login');
    }
}


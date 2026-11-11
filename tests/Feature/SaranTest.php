<?php

namespace Tests\Feature;

use App\Models\Saran;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SaranTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_cannot_access_saran_endpoints(): void
    {
        $this->getJson('/saran')->assertStatus(401);
        $this->postJson('/saran', [
            'no_telp' => '083877392831',
            'whatsapp_confirmed' => true,
            'isi_saran' => 'Tambahkan fitur ekspor PDF',
        ])->assertStatus(401);
    }

    public function test_saran_requires_valid_indonesian_whatsapp_number_and_confirmation(): void
    {
        $user = User::factory()->create();

        // Missing phone number
        $this->actingAs($user)
            ->postJson('/saran', [
                'no_telp' => '',
                'whatsapp_confirmed' => true,
                'isi_saran' => 'Tambahkan widget target tabungan',
            ])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['no_telp']);

        // Unconfirmed WhatsApp checkbox
        $this->actingAs($user)
            ->postJson('/saran', [
                'no_telp' => '083877392831',
                'whatsapp_confirmed' => false,
                'isi_saran' => 'Tambahkan widget target tabungan',
            ])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['whatsapp_confirmed']);

        // Invalid prefix / landline number
        $this->actingAs($user)
            ->postJson('/saran', [
                'no_telp' => '0215551234',
                'whatsapp_confirmed' => true,
                'isi_saran' => 'Tambahkan widget target tabungan',
            ])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['no_telp']);

        // Unassigned Indonesian prefix 084x
        $this->actingAs($user)
            ->postJson('/saran', [
                'no_telp' => '08401234567',
                'whatsapp_confirmed' => true,
                'isi_saran' => 'Tambahkan widget target tabungan',
            ])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['no_telp']);
    }

    public function test_user_can_submit_saran_and_receives_automatic_thank_you_reply(): void
    {
        $user = User::factory()->create([
            'name' => 'Vina Putri',
            'email' => 'vina@example.com',
            'no_telp' => null,
        ]);

        $response = $this->actingAs($user)->postJson('/saran', [
            'no_telp' => '+62 812-3456-7890',
            'whatsapp_confirmed' => true,
            'isi_saran' => 'Tolong tambahkan pengingat tagihan bulanan ya min!',
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('no_telp', '6281234567890')
            ->assertJsonPath('saran.user_id', $user->id)
            ->assertJsonPath('saran.username', 'Vina Putri')
            ->assertJsonPath('saran.email', 'vina@example.com')
            ->assertJsonPath('saran.no_telp', '6281234567890')
            ->assertJsonPath('saran.isi_saran', 'Tolong tambahkan pengingat tagihan bulanan ya min!');

        $this->assertStringContainsString('Terima kasih banyak, Vina!', $response->json('reply'));

        $this->assertDatabaseHas('saran', [
            'user_id' => $user->id,
            'username' => 'Vina Putri',
            'email' => 'vina@example.com',
            'no_telp' => '6281234567890',
            'isi_saran' => 'Tolong tambahkan pengingat tagihan bulanan ya min!',
        ]);

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'no_telp' => '6281234567890',
        ]);
    }

    public function test_saran_index_enforces_multi_tenant_isolation(): void
    {
        $userA = User::factory()->create(['no_telp' => '6281211112222']);
        $userB = User::factory()->create(['no_telp' => '6281399998888']);

        Saran::create([
            'user_id' => $userA->id,
            'username' => $userA->name,
            'email' => $userA->email,
            'no_telp' => '6281211112222',
            'isi_saran' => 'Saran rahasia user A',
            'balasan_otomatis' => 'Terima kasih A!',
        ]);

        Saran::create([
            'user_id' => $userB->id,
            'username' => $userB->name,
            'email' => $userB->email,
            'no_telp' => '6281399998888',
            'isi_saran' => 'Saran rahasia user B',
            'balasan_otomatis' => 'Terima kasih B!',
        ]);

        $response = $this->actingAs($userA)->getJson('/saran');

        $response->assertStatus(200)
            ->assertJsonCount(1, 'items')
            ->assertJsonPath('items.0.isi_saran', 'Saran rahasia user A')
            ->assertJsonPath('no_telp', '6281211112222');
    }
}

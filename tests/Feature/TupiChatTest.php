<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class TupiChatTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_cannot_access_tanya_tupi_endpoint(): void
    {
        $this->postJson('/tanya-tupi', [
            'message' => 'Cara tambah kategori bagaimana?',
        ])->assertStatus(401);
    }

    public function test_validation_requires_non_empty_message(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->postJson('/tanya-tupi', ['message' => ''])
            ->assertStatus(422);
    }

    public function test_tanya_tupi_calls_gemini_api_when_key_configured(): void
    {
        Config::set('services.gemini.api_key', 'test-gemini-key');
        Config::set('services.gemini.model', 'gemini-2.5-flash');

        Http::fake([
            'https://generativelanguage.googleapis.com/*' => Http::response([
                'candidates' => [
                    [
                        'content' => [
                            'parts' => [
                                ['text' => 'Hai! Klik tombol Tambah Transaksi Baru lalu pilih + Kategori Baru ya.'],
                            ],
                        ],
                    ],
                ],
            ], 200),
        ]);

        $user = User::factory()->create(['name' => 'Budi Santoso']);

        $response = $this->actingAs($user)->postJson('/tanya-tupi', [
            'message' => 'Bagaimana cara menambah kategori?',
            'history' => [
                ['role' => 'model', 'text' => 'Hai Budi!'],
                ['role' => 'user', 'text' => 'Halo Tupi'],
                ['role' => 'model', 'text' => 'Halo Budi, ada yang bisa dibantu?'],
            ],
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'reply' => 'Hai! Klik tombol Tambah Transaksi Baru lalu pilih + Kategori Baru ya.',
                'source' => 'gemini',
            ]);

        Http::assertSent(function ($request) {
            return str_contains($request->url(), 'key=test-gemini-key')
                && $request['contents'][0]['role'] === 'user'
                && str_contains($request['systemInstruction']['parts'][0]['text'], 'Haidar');
        });
    }

    public function test_tanya_tupi_uses_smart_fallback_when_api_key_missing(): void
    {
        Config::set('services.gemini.api_key', null);
        $user = User::factory()->create();

        $response = $this->actingAs($user)->postJson('/tanya-tupi', [
            'message' => 'Bagaimana cara tambah kategori?',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'source' => 'fallback',
            ]);
        $this->assertStringContainsString('Tambah Transaksi Baru', $response->json('reply'));
    }
}

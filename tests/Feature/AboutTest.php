<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class AboutTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_can_view_about_page(): void
    {
        $response = $this->get('/tentang');

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('About')
            ->where('auth.user', null)
        );
    }

    public function test_authenticated_user_can_view_about_page(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get('/tentang');

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('About')
            ->where('auth.user.id', $user->id)
        );
    }
}

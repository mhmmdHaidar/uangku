<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Tests\TestCase;

class ProfileTest extends TestCase
{
    use RefreshDatabase;

    public function test_profile_page_is_displayed(): void
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->get('/profile');

        $response->assertOk();
    }

    public function test_profile_information_can_be_updated(): void
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->patch('/profile', [
                'name' => 'Test User',
                'email' => 'test@example.com',
            ]);

        $response
            ->assertSessionHasNoErrors()
            ->assertRedirect('/profile');

        $user->refresh();

        $this->assertSame('Test User', $user->name);
        $this->assertSame('test@example.com', $user->email);
        $this->assertNull($user->email_verified_at);
    }

    public function test_email_verification_status_is_unchanged_when_the_email_address_is_unchanged(): void
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->patch('/profile', [
                'name' => 'Test User',
                'email' => $user->email,
            ]);

        $response
            ->assertSessionHasNoErrors()
            ->assertRedirect('/profile');

        $this->assertNotNull($user->refresh()->email_verified_at);
    }

    public function test_user_can_delete_their_account(): void
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->delete('/profile', [
                'password' => 'password',
            ]);

        $response
            ->assertSessionHasNoErrors()
            ->assertRedirect('/');

        $this->assertGuest();
        $this->assertNull($user->fresh());
    }

    public function test_correct_password_must_be_provided_to_delete_account(): void
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->from('/profile')
            ->delete('/profile', [
                'password' => 'wrong-password',
            ]);

        $response
            ->assertSessionHasErrors('password')
            ->assertRedirect('/profile');

        $this->assertNotNull($user->fresh());
    }

    public function test_user_can_upload_profile_avatar_and_view_it(): void
    {
        $user = User::factory()->create();
        $file = UploadedFile::fake()->image('avatar.jpg', 500, 400);

        $response = $this
            ->actingAs($user)
            ->from('/profile')
            ->post('/profile/avatar', [
                'avatar' => $file,
            ]);

        $response
            ->assertSessionHasNoErrors()
            ->assertRedirect('/profile');

        $fresh = $user->fresh();
        $this->assertNotNull($fresh->avatar);
        $this->assertStringStartsWith('data:image/jpeg;base64,', $fresh->avatar);
        $this->assertNotNull($fresh->avatar_url);
        $this->assertStringContainsString('/profile/avatar/' . $fresh->id, $fresh->avatar_url);
        $this->assertArrayNotHasKey('avatar', $fresh->toArray());

        $avatarResponse = $this->actingAs($fresh)->get($fresh->avatar_url);
        $avatarResponse->assertOk();
        $avatarResponse->assertHeader('Content-Type', 'image/jpeg');
    }

    public function test_user_can_upload_png_avatar_preserving_png_format(): void
    {
        $user = User::factory()->create();
        $file = UploadedFile::fake()->image('avatar.png', 200, 200);

        $response = $this
            ->actingAs($user)
            ->from('/profile')
            ->post('/profile/avatar', [
                'avatar' => $file,
            ]);

        $response
            ->assertSessionHasNoErrors()
            ->assertRedirect('/profile');

        $fresh = $user->fresh();
        $this->assertStringStartsWith('data:image/png;base64,', $fresh->avatar);

        $avatarResponse = $this->actingAs($fresh)->get($fresh->avatar_url);
        $avatarResponse->assertOk();
        $avatarResponse->assertHeader('Content-Type', 'image/png');
    }

    public function test_avatar_upload_rejects_non_image_files(): void
    {
        $user = User::factory()->create();
        $file = UploadedFile::fake()->create('document.pdf', 100, 'application/pdf');

        $response = $this
            ->actingAs($user)
            ->from('/profile')
            ->post('/profile/avatar', [
                'avatar' => $file,
            ]);

        $response
            ->assertSessionHasErrors('avatar')
            ->assertRedirect('/profile');

        $this->assertNull($user->fresh()->avatar);
    }

    public function test_user_can_delete_profile_avatar(): void
    {
        $user = User::factory()->create();
        $file = UploadedFile::fake()->image('avatar.jpg', 200, 200);

        $this->actingAs($user)->post('/profile/avatar', [
            'avatar' => $file,
        ]);

        $this->assertNotNull($user->fresh()->avatar);

        $response = $this
            ->actingAs($user)
            ->from('/profile')
            ->delete('/profile/avatar');

        $response
            ->assertSessionHasNoErrors()
            ->assertRedirect('/profile');

        $fresh = $user->fresh();
        $this->assertNull($fresh->avatar);
        $this->assertNull($fresh->avatar_url);

        $this->actingAs($fresh)
            ->get('/profile/avatar/' . $fresh->id)
            ->assertNotFound();
    }

    public function test_user_cannot_view_another_users_avatar(): void
    {
        $owner = User::factory()->create();
        $otherUser = User::factory()->create();
        $file = UploadedFile::fake()->image('avatar.jpg', 200, 200);

        $this->actingAs($owner)->post('/profile/avatar', [
            'avatar' => $file,
        ]);

        $this->actingAs($otherUser)
            ->get($owner->fresh()->avatar_url)
            ->assertForbidden();
    }
}

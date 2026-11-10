<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CategoryTest extends TestCase
{
    use RefreshDatabase;

    public function test_new_user_gets_seeded_default_categories(): void
    {
        $user = User::factory()->create();
        $user->seedDefaultCategories();

        $this->assertDatabaseHas('categories', [
            'user_id' => $user->id,
            'name' => 'Makanan & Minuman',
            'type' => 'expense',
        ]);
        $this->assertDatabaseHas('categories', [
            'user_id' => $user->id,
            'name' => 'Transportasi',
            'type' => 'expense',
        ]);
        $this->assertDatabaseHas('categories', [
            'user_id' => $user->id,
            'name' => 'Belanja',
            'type' => 'expense',
        ]);
        $this->assertDatabaseHas('categories', [
            'user_id' => $user->id,
            'name' => 'Tagihan',
            'type' => 'expense',
        ]);
        $this->assertDatabaseHas('categories', [
            'user_id' => $user->id,
            'name' => 'Kesehatan',
            'type' => 'expense',
        ]);
    }

    public function test_user_can_create_custom_category(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post('/categories', [
            'name' => 'Hobi & Mainan',
            'type' => 'expense',
        ]);

        $response->assertStatus(302);
        $this->assertDatabaseHas('categories', [
            'user_id' => $user->id,
            'name' => 'Hobi & Mainan',
            'type' => 'expense',
        ]);
    }

    public function test_user_can_delete_own_category(): void
    {
        $user = User::factory()->create();
        $category = Category::create([
            'user_id' => $user->id,
            'name' => 'Kopi Kafe',
            'type' => 'expense',
        ]);

        $response = $this->actingAs($user)->delete("/categories/{$category->id}");

        $response->assertStatus(302);
        $this->assertDatabaseMissing('categories', [
            'id' => $category->id,
        ]);
    }

    public function test_user_cannot_delete_another_users_category(): void
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();

        $category = Category::create([
            'user_id' => $user1->id,
            'name' => 'Kategori Rahasia',
            'type' => 'expense',
        ]);

        $response = $this->actingAs($user2)->delete("/categories/{$category->id}");

        $response->assertStatus(403);
        $this->assertDatabaseHas('categories', [
            'id' => $category->id,
        ]);
    }
}

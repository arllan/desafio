<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_register(): void
    {
        $response = $this->postJson('/api/register', [
            'name' => 'João Silva',
            'email' => 'joao@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure(['user', 'token']);

        $this->assertDatabaseHas('users', ['email' => 'joao@example.com']);
        $this->assertDatabaseHas('wallets', ['balance_brl' => '10000.00', 'balance_btc' => '0.00000000']);
    }

    public function test_register_requires_all_fields(): void
    {
        $this->postJson('/api/register', [])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['name', 'email', 'password']);
    }

    public function test_register_requires_unique_email(): void
    {
        User::factory()->create(['email' => 'joao@example.com']);

        $this->postJson('/api/register', [
            'name' => 'João',
            'email' => 'joao@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ])->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    public function test_user_can_login(): void
    {
        User::factory()->create([
            'email' => 'joao@example.com',
            'password' => bcrypt('password123'),
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'joao@example.com',
            'password' => 'password123',
        ]);

        $response->assertOk()->assertJsonStructure(['user', 'token']);
    }

    public function test_login_fails_with_wrong_password(): void
    {
        User::factory()->create([
            'email' => 'joao@example.com',
            'password' => bcrypt('password123'),
        ]);

        $this->postJson('/api/login', [
            'email' => 'joao@example.com',
            'password' => 'wrong',
        ])->assertStatus(401);
    }

    public function test_me_returns_authenticated_user(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->getJson('/api/me')
            ->assertOk()
            ->assertJsonFragment(['email' => $user->email]);
    }

    public function test_me_requires_authentication(): void
    {
        $this->getJson('/api/me')->assertStatus(401);
    }

    public function test_user_can_logout(): void
    {
        $user = User::factory()->create();
        $token = $user->createToken('api')->plainTextToken;

        $this->withToken($token)->postJson('/api/logout')
            ->assertOk();
    }
}

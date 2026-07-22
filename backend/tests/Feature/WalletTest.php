<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class WalletTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_see_wallet(): void
    {
        $user = User::factory()->create();
        $user->wallet()->create();

        $this->actingAs($user)->getJson('/api/wallet')
            ->assertOk()
            ->assertJsonStructure(['balance_brl', 'balance_btc']);
    }

    public function test_wallet_starts_with_correct_balances(): void
    {
        $user = User::factory()->create();
        $user->wallet()->create();

        $this->actingAs($user)->getJson('/api/wallet')
            ->assertOk()
            ->assertJsonFragment([
                'balance_brl' => '10000.00',
                'balance_btc' => '0.00000000',
            ]);
    }

    public function test_wallet_requires_authentication(): void
    {
        $this->getJson('/api/wallet')->assertStatus(401);
    }
}

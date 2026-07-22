<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MarketTest extends TestCase
{
    use RefreshDatabase;

    public function test_returns_btc_price(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->getJson('/api/market/btc');

        $response->assertOk()->assertJsonStructure(['price']);
    }

    public function test_btc_price_is_within_range(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->getJson('/api/market/btc');

        $price = (float) $response->json('price');

        $this->assertGreaterThanOrEqual(200000.00, $price);
        $this->assertLessThanOrEqual(300000.00, $price);
    }

    public function test_market_requires_authentication(): void
    {
        $this->getJson('/api/market/btc')->assertStatus(401);
    }
}

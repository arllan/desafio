<?php

namespace Tests\Feature;

use App\Models\User;
use App\Services\MarketService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TradeTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();
        $this->user->wallet()->create();

        $this->mock(MarketService::class, function ($mock) {
            $mock->shouldReceive('getBtcPrice')->andReturn('250000.00');
        });
    }

    // --- Compra ---

    public function test_user_can_buy_btc(): void
    {
        $response = $this->actingAs($this->user)->postJson('/api/trade/buy', [
            'amount_brl' => '1000.00',
        ]);

        $response->assertStatus(201)
            ->assertJsonFragment(['type' => 'buy']);

        $wallet = $this->user->wallet->fresh();
        $this->assertEquals('9000.00', $wallet->balance_brl);
        $this->assertEquals('0.00400000', $wallet->balance_btc);
    }

    public function test_buy_fails_with_insufficient_brl_balance(): void
    {
        $this->actingAs($this->user)->postJson('/api/trade/buy', [
            'amount_brl' => '99999.00',
        ])->assertStatus(422);
    }

    public function test_buy_requires_amount(): void
    {
        $this->actingAs($this->user)->postJson('/api/trade/buy', [])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['amount_brl']);
    }

    public function test_buy_requires_positive_amount(): void
    {
        $this->actingAs($this->user)->postJson('/api/trade/buy', [
            'amount_brl' => '-100',
        ])->assertStatus(422);
    }

    // --- Venda ---

    public function test_user_can_sell_btc(): void
    {
        $this->user->wallet->update([
            'balance_brl' => '0.00',
            'balance_btc' => '0.00400000',
        ]);

        $response = $this->actingAs($this->user)->postJson('/api/trade/sell', [
            'amount_btc' => '0.00400000',
        ]);

        $response->assertStatus(201)
            ->assertJsonFragment(['type' => 'sell']);

        $wallet = $this->user->wallet->fresh();
        $this->assertEquals('0.00000000', $wallet->balance_btc);
        $this->assertEquals('1000.00', $wallet->balance_brl);
    }

    public function test_sell_fails_with_insufficient_btc_balance(): void
    {
        $this->actingAs($this->user)->postJson('/api/trade/sell', [
            'amount_btc' => '99.00000000',
        ])->assertStatus(422);
    }

    public function test_sell_requires_amount(): void
    {
        $this->actingAs($this->user)->postJson('/api/trade/sell', [])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['amount_btc']);
    }

    public function test_trade_requires_authentication(): void
    {
        $this->postJson('/api/trade/buy', ['amount_brl' => '100'])
            ->assertStatus(401);
    }
}

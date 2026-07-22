<?php

namespace Tests\Feature;

use App\Models\Transaction;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TransactionTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();
        $this->user->wallet()->create();
    }

    public function test_returns_empty_list_when_no_transactions(): void
    {
        $this->actingAs($this->user)->getJson('/api/transactions')
            ->assertOk()
            ->assertExactJson([]);
    }

    public function test_returns_user_transactions(): void
    {
        Transaction::factory()->count(3)->create(['user_id' => $this->user->id]);

        $this->actingAs($this->user)->getJson('/api/transactions')
            ->assertOk()
            ->assertJsonCount(3);
    }

    public function test_does_not_return_other_users_transactions(): void
    {
        $otherUser = User::factory()->create();
        Transaction::factory()->count(2)->create(['user_id' => $otherUser->id]);

        $this->actingAs($this->user)->getJson('/api/transactions')
            ->assertOk()
            ->assertExactJson([]);
    }

    public function test_filter_by_type_buy(): void
    {
        Transaction::factory()->create(['user_id' => $this->user->id, 'type' => 'buy']);
        Transaction::factory()->create(['user_id' => $this->user->id, 'type' => 'sell']);

        $this->actingAs($this->user)->getJson('/api/transactions?type=buy')
            ->assertOk()
            ->assertJsonCount(1)
            ->assertJsonFragment(['type' => 'buy']);
    }

    public function test_filter_by_type_sell(): void
    {
        Transaction::factory()->create(['user_id' => $this->user->id, 'type' => 'buy']);
        Transaction::factory()->create(['user_id' => $this->user->id, 'type' => 'sell']);

        $this->actingAs($this->user)->getJson('/api/transactions?type=sell')
            ->assertOk()
            ->assertJsonCount(1)
            ->assertJsonFragment(['type' => 'sell']);
    }

    public function test_filter_by_min_amount(): void
    {
        Transaction::factory()->create(['user_id' => $this->user->id, 'amount_brl' => '500.00']);
        Transaction::factory()->create(['user_id' => $this->user->id, 'amount_brl' => '1500.00']);

        $this->actingAs($this->user)->getJson('/api/transactions?min_amount=1000')
            ->assertOk()
            ->assertJsonCount(1);
    }

    public function test_transaction_has_required_fields(): void
    {
        Transaction::factory()->create(['user_id' => $this->user->id]);

        $this->actingAs($this->user)->getJson('/api/transactions')
            ->assertOk()
            ->assertJsonStructure([['id', 'type', 'amount_brl', 'amount_btc', 'btc_price', 'created_at']]);
    }

    public function test_transactions_requires_authentication(): void
    {
        $this->getJson('/api/transactions')->assertStatus(401);
    }
}

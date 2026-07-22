<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class TransactionFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'type' => $this->faker->randomElement(['buy', 'sell']),
            'amount_brl' => $this->faker->randomFloat(2, 100, 5000),
            'amount_btc' => $this->faker->randomFloat(8, 0.0001, 0.1),
            'btc_price' => $this->faker->randomFloat(2, 200000, 300000),
        ];
    }
}

<?php

namespace Database\Factories;

use App\Models\Drink;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Sales>
 */
class SalesFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'drink_id' => function () {
                // Assuming you have a Drink model, get a random drink ID
                return Drink::inRandomOrder()->first()->id;
            },
            'quantity_sold' => $this->faker->numberBetween(1, 10),
            'total_sales' => $this->faker->randomFloat(2, 5, 50),
        ];
    }
}

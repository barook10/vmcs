<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Drink;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Drink>
 */
class DrinkFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->word,
            'price' => $this->faker->randomFloat(2, 0.5, 5.0), // Generates a random float with 2 decimal places between 0.5 and 5.0
            'quantity' => $this->faker->numberBetween(1, 10),
            'image' => $this->faker->url,
        ];
    }
}

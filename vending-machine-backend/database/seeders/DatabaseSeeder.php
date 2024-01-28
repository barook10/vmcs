<?php
// DatabaseSeeder.php

namespace Database\Seeders;

use App\Models\Sales;
use App\Models\Drink;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Seed drinks
        Drink::factory(4)->create();

        // Seed sales for each drink
        $drinks = Drink::all();

        foreach ($drinks as $drink) {
            Sales::factory()->create([
                'drink_id' => $drink->id,
                // You can customize other attributes as needed
            ]);
        }
    }
}

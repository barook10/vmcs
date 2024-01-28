<?php

namespace App\Http\Controllers;

use App\Models\Drink;
use App\Models\Sales;
use Illuminate\Http\Request;

class DrinkController extends Controller
{
    public function index()
    {
        $drinks = Drink::all();
        return response()->json($drinks);
    }

    public function store(Request $request)
    {
        // Validate the incoming request data
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'quantity' => 'required|integer|min:0',
            'image' => 'nullable|string',
        ]);

        // Create a new drink
        $drink = Drink::create($validatedData);

        return response()->json($drink, 201);
    }

    public function addQuantity($id)
    {
        $drink = Drink::findOrFail($id);

        // Increment the quantity
        $drink->quantity += 1;
        $drink->save();

        return response()->json($drink);
    }

    public function deleteDrink($id)
    {
        $drink = Drink::findOrFail($id);

        // Delete associated sales records
        Sales::where('drink_id', $drink->id)->delete();

        // Delete the drink
        $drink->delete();

        return response()->json(null, 204);
    }

    public function getNewPrice(Request $request, $id)
    {
        // Validate the incoming request data
        $validatedData = $request->validate([
            'price' => 'required|numeric|min:0',
        ]);

        $drink = Drink::findOrFail($id);

        // Change the price
        $drink->price = $validatedData['price'];
        $drink->save();

        return response()->json($drink);
    }
    public function decreaseQuantity($id)
    {
        $drink = Drink::findOrFail($id);

        if ($drink->quantity > 0) {
            // Decrease the quantity
            $drink->quantity -= 1;
            $drink->save();
        }

        return response()->json($drink);
    }

    public function buyDrink($id)
    {
        $drink = Drink::findOrFail($id);

        if ($drink->quantity > 0) {
            // Decrease the quantity
            $drink->quantity -= 1;
            $drink->save();

            // Record the sale
            Sales::create([
                'drink_id' => $drink->id,
                'quantity_sold' => 1,
                'total_sales' => $drink->price,
            ]);
        }

        return response()->json($drink);
    }

}

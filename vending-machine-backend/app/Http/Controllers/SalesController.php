<?php

namespace App\Http\Controllers;

use App\Models\Sales;
use Illuminate\Http\Request;

class SalesController extends Controller
{
    public function recordSale(Request $request, $id)
    {
        $validatedData = $request->validate([
            'quantity_sold' => 'required|integer|min:1',
            'total_sales' => 'required|numeric',
        ]);

        Sales::create([
            'drink_id' => $id,
            'quantity_sold' => $validatedData['quantity_sold'],
            'total_sales' => $validatedData['total_sales'],
        ]);

        return response()->json(null, 204);
    }

    public function getSalesData()
    {
        
        $salesData = Sales::with('drink')->get();

        return response()->json($salesData);
    }
}

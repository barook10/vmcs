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

    // Record the sale
    $sale = Sales::create([
        'drink_id' => $id,
        'quantity_sold' => $validatedData['quantity_sold'],
        'total_sales' => $validatedData['total_sales'],
    ]);

    // Retrieve the newly recorded sale with associated drink
    $newSale = Sales::with('drink')->find($sale->id);

    return response()->json($newSale, 201); // 201 Created status code
}


    public function getSalesData()
    {
        
        $salesData = Sales::with('drink')->get();

        return response()->json($salesData);
    }
}

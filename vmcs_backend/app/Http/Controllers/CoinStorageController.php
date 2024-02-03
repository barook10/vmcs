<?php

namespace App\Http\Controllers;
use App\Models\CoinStorage;
use Illuminate\Http\Request;

class CoinStorageController extends Controller
{
    public function updateCoinStorage(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'coins' => 'required|array',
                'coins.*.coin_value' => 'required|integer|min:0',
                'coins.*.coin_count' => 'required|integer|min:0',
            ]);

            // Loop through each coin in the 'coins' array
            foreach ($validatedData['coins'] as $coin) {
                $coinValue = $coin['coin_value'];
                $coinCount = $coin['coin_count'];

                // Find or create a record in the coin storage table
                $coinStorage = CoinStorage::updateOrCreate(
                    ['coin_value' => $coinValue],
                    ['coin_count' => $coinCount]
                );

                // If the coin storage record is updated or created, return the updated data
                if (!$coinStorage) {
                    return response()->json(['error' => 'Unable to update coin storage'], 500);
                }
            }

            return response()->json(['coins' => $validatedData['coins']]);
        } catch (\Exception $e) {
            // Log the exception
            \Log::error('Error updating coin storage: ' . $e->getMessage());

            return response()->json(['error' => 'Internal Server Error'], 500);
        }
    }

    public function getCoinStorage()
    {
        // Retrieve all records from the coin storage table
        $coinStorage = CoinStorage::all();

        // Format the data as an associative array
        $formattedCoinStorage = $coinStorage->pluck('coin_count', 'coin_value')->toArray();

        return response()->json(['coins' => $formattedCoinStorage]);
    }
}

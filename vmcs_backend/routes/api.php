<?php

use App\Http\Controllers\DrinkController;
use App\Http\Controllers\SalesController;
use App\Http\Controllers\CoinStorageController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/drinks', [DrinkController::class, 'index']);

Route::post('/drinks', [DrinkController::class, 'store']);

Route::post('/drinks/{id}/add-quantity', [DrinkController::class, 'addQuantity']);

Route::delete('/drinks/{id}', [DrinkController::class, 'deleteDrink']);

Route::put('/drinks/{id}', [DrinkController::class, 'getNewPrice']);

Route::patch('/drinks/{id}/decrease-quantity', [DrinkController::class, 'decreaseQuantity']);

Route::post('/sales/{id}', [SalesController::class, 'recordSale']);


Route::get('/sales', [SalesController::class, 'getSalesData']);

Route::post('/coin-storage', [CoinStorageController::class, 'updateCoinStorage']);

Route::get('/get-coin-storage', [CoinStorageController::class, 'getCoinStorage']);


<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SalesAndCoinStorage extends Model
{
    use HasFactory;

    protected $fillable = [
        'sales',
        'total_drinks_sold',
        'coins_100',
        'coins_50',
        'coins_20',
        'coins_10',
    ];

    public function drinks()
    {
        return $this->hasMany(Drink::class);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CoinStorage extends Model
{
    use HasFactory;

    protected $fillable = ['coin_value', 'coin_count', ];
}

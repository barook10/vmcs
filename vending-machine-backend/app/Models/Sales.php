<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Drink;

class Sales extends Model
{
    use HasFactory;

    protected $fillable = ['drink_id', 'quantity_sold', 'total_sales'];
    public function drink()
    {
        return $this->belongsTo(Drink::class);
    }
}

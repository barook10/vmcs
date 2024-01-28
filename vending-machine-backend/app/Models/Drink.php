<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Sales;

class Drink extends Model
{
    use HasFactory;
    protected $fillable = ['name', 'price', 'quantity', 'image'];

    public function sales()
    {
        return $this->hasMany(Sales::class);
    }
}

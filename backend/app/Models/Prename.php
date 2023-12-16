<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Prename extends Model
{
    use HasFactory;

    protected $primaryKey = "id";
    protected $table = "tbPrename";
    
    protected $fillable = [
        'name' , 
        'gendar', 
        'abname', 
        'order', 
    ];
}

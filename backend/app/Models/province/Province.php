<?php

namespace App\Models\province;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Province extends Model
{
    use HasFactory;

    protected $primaryKey = "province_id";
    protected $table = "province";

    // protected $fillable = [];
    
    public $timestamps = false;
}

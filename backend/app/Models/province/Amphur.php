<?php

namespace App\Models\province;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Amphur extends Model
{
    use HasFactory;

    protected $primaryKey = "amphur_id";
    protected $table = "amphur";
    
    // protected $fillable = [];

    public $timestamps = false;
}

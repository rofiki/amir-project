<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Company extends Model
{
    use HasFactory;

    protected $primaryKey = "id";
    protected $table = "companies";
    
    protected $fillable = [
        'id',
        'name'
    ];

    public function department(){
        return $this->hasMany(Department::class);
    }
}

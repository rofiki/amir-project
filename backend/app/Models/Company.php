<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Company extends Model
{
    use HasFactory;

    protected $primaryKey = "id";
    protected $table = "tbCompanies";
    
    protected $fillable = [
        'name'
    ];

    protected $hidden = [
        'updated_at'
    ];

    public function department(){
        return $this->hasMany(Department::class);
    }
}

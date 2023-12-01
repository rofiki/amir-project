<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Department extends Model
{
    use HasFactory;

    protected $primaryKey = "id";
    protected $table = "departments";
    
    protected $fillable = [
        'company_id' , 'name', 'description'
    ];

    protected $hidden = [
        'updated_at'
    ];

    public function company(){
        return $this->belongsTo(Company::class);
    }

    public function jobPosition(){
        return $this->hasMany(JobPosition::class);
    }

}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DepartmentSub extends Model
{
    use HasFactory;

    protected $primaryKey = "id";
    protected $table = "department_sub";
    
    protected $fillable = [
        'department_main_id' , 
        'department_sub_id', 
    ];

    public $timestamps = false;
}

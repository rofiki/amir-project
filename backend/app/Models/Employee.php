<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Employee extends Model
{
    // use HasFactory;
    use SoftDeletes;

    protected $primaryKey = "id";
    protected $table = "tbEmployee";
    
    protected $fillable = [
        'user_id' , 
        'employee_code', 
        'prefix_id', 
        'firstname', 
        'lastname', 
        'nickname', 
        'gender', 
        'date_of_birth', 
        'idcard', 
        'date_of_sign', 
        'date_of_resign', 
        'active', 
    ];

    protected $hidden = [
        'idcard',
        'user_id'
    ];

}

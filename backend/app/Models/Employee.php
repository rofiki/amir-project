<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    use HasFactory;

    protected $primaryKey = "id";
    protected $table = "employee";
    
    protected $fillable = [
        'users_login_id' , 
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

    // protected $hidden = [];
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class tbPersonnel extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $primaryKey = "id";
    protected $table = "tbPersonnel";
    
    protected $fillable = [
        'user_id' , 
        'jobPosition_id',
        'personnel_code',  // รหัสผ่านงาน
        'prename_id', 
        'firstname', 
        'lastname', 
        'nickname', 
        'gendar', 
        'email',
        'date_of_birth', 
        'idcard', 
        'date_of_sign', 
        'date_of_resign', 
        
        'active', 
    ];

    protected $hidden = [
        'idcard',
        'user_id',
        'deleted_at',
    ];

}

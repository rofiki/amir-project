<?php

namespace App\Models\HomeMaker;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class tbHomemaker extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $primaryKey = "id";
    protected $table = "homemaker_tbHomemaker";
    
    protected $fillable = [
        'user_id' , 
        'homemaker_code', 
        'prefix_id', 
        'firstname', 
        'lastname', 
        'nickname', 
        'address',
        'gendar', 
        'idcard', 
        'lineId',
        'phoneNumber',
        'email',
        'date_of_sign', 
        'date_of_resign', 
        'active', 
    ];

    protected $hidden = [
        'user_id',
        'idcard',
        'deleted_at'
    ];
}

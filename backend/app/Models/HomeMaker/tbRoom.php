<?php

namespace App\Models\HomeMaker;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class tbRoom extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $primaryKey = "roomId";
    protected $table = "homemaker_tbRoom";
    
    protected $fillable = [
        'type_id' , 
        'roomName', 
        'roomBuilder', 
        'roomFloor', 
        'roomLocation', 
        'roomDescription', 
    ];

    protected $hidden = [
        'deleted_at'
    ];
}

<?php

namespace App\Models\Homemaker;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class tbRoomAddHomemaker extends Model
{
    use HasFactory;
    use SoftDeletes;


    protected $primaryKey = "roomAddHomemaker_id";
    protected $table = "homemaker_tbRoomAddHomemaker";

    protected $fillable = [
        'room_id',
        'homemaker_id'
    ];

    protected $hidden = [];
}

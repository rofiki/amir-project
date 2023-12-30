<?php

namespace App\Models\HomeMaker;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class tbRoomAddPersonnel extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $primaryKey = "roomAddPersonnel_id";
    protected $table = "homemaker_tbRoomAddPersonnel";

    protected $fillable = [
        'room_id',
        'personnel_id'
    ];

    protected $hidden = [
        'deleted_at'
    ];
}

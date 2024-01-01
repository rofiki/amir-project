<?php

namespace App\Models\HomeMaker;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
class tbRoomAddChecklist extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $primaryKey = "roomAddChecklist_id";
    protected $table = "homemaker_tbRoomAddChecklist";

    protected $fillable = [
        'room_id',
        'checklist_id'
    ];

    protected $hidden = [
        'deleted_at'
    ];
}

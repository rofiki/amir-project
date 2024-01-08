<?php

namespace App\Models\HomeMaker;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class tbChecklistSub extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $primaryKey = "checklistSub_id";
    protected $table = "homemaker_tbChecklistSub";
    
    protected $fillable = [
        'checklist_id' , 
        'checklistSubName' , 
    ];

    protected $hidden = [
        'deleted_at'
    ];
}

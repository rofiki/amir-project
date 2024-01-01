<?php

namespace App\Models\HomeMaker;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class tbChecklist extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $primaryKey = "checklist_id";
    protected $table = "homemaker_tbChecklist";
    
    protected $fillable = [
        'checklistName' , 
    ];

    protected $hidden = [
        'deleted_at'
    ];
}

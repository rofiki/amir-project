<?php

namespace App\Models\HomeMaker;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class tbRoomType extends Model
{
    use HasFactory;
    use SoftDeletes;


    protected $primaryKey = "id";
    protected $table = "homemaker_tbRoomType";

    protected $fillable = [
        'type_text',
        'description'
    ];

    protected $hidden = [];
}

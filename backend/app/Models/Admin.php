<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Admin extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $primaryKey = "id";
    protected $table = "tbAdmin";

    protected $fillable = [
        'user_id',
        'firstname',
        'lastname',
        'email',
        'password',
        'admin_role',
        'active'

    ];

    protected $hidden = [];
}

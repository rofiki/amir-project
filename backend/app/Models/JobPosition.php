<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JobPosition extends Model
{
    use HasFactory;

    protected $primaryKey = "id";
    protected $table = "tbJobPosition";
    
    protected $fillable = [
        'department_id' , 'name', 'description'
    ];

    protected $hidden = [
        'updated_at'
    ];

    public function department(){
        return $this->belongsTo(Department::class,'department_id');
    }
}
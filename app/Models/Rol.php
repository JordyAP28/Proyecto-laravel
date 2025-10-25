<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Rol extends Model
{
    use HasFactory;

    protected $table = 'roles';

    protected $primaryKey = 'id_rol';



    protected $fillable = [
        'rol'
    ];
  
    protected $casts = [
        'rol' => 'string'
    ];

    public function users()
    {
        return $this->hasMany(User::class, 'id_rol');
    }
}
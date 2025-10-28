<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $table = 'usuarios'; // ← Apunta a tabla usuarios
    protected $primaryKey = 'id_usuario';

    protected $fillable = [
        'nombre_usuario',
        'clave',
        'id_rol',
        'id_estado',
    ];

    protected $hidden = [
        'clave',
        'remember_token',
    ];

    protected $casts = [
        'clave' => 'hashed', // Laravel 12 auto-hash
    ];

    // IMPORTANTE: Laravel busca 'password', así que redirigimos a 'clave'
    public function getAuthPassword()
    {
        return $this->clave;
    }

    // Laravel busca por 'email', pero usamos 'nombre_usuario'
    public function getAuthIdentifierName()
    {
        return 'nombre_usuario';
    }

    // Mutator para encriptar
    public function setClaveAttribute($value)
    {
        $this->attributes['clave'] = bcrypt($value);
    }

    // Relaciones
    public function rol()
    {
        return $this->belongsTo(Rol::class, 'id_rol', 'id_rol');
    }

    public function estado()
    {
        return $this->belongsTo(Estado::class, 'id_estado', 'id_estado');
    }
}
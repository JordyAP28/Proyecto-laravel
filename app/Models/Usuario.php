<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Usuario extends Model
{
    use HasFactory;

    protected $table = 'usuarios';
    protected $primaryKey = 'id_usuario';

    protected $fillable = [
        'nombre_usuario',
        'clave',
        'id_rol',
        'id_estado'
    ];

    public function rol()
    {
        return $this->belongsTo(Rol::class, 'id_rol', 'id_rol');
    }

    public function estado()
    {
        return $this->belongsTo(Estado::class, 'id_estado', 'id_estado');
    }

    public function logs()
    {
        return $this->hasMany(LogSistema::class, 'id_usuario', 'id_usuario');
    }

    public function setClaveAttribute($value)
    {
        $this->attributes['clave'] = bcrypt($value);
    }
}
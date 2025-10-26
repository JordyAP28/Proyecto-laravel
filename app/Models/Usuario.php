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

    //usuario pertenece a un  rol.
    public function rol()
    {
        return $this->belongsTo(Rol::class, 'id_rol');
    }

    //Relacion con estado
    public function estado()
    {
        return $this->belongsTo(Estado::class, 'id_estado');
    }

    //usuario puede tener muchos logs
    public function logs()
    {
        return $this->hasMany(LogSistema::class, 'id_usuario');
    }

    //Encripta la contraseña del usuario
    public function setClaveAttribute($value)
    {
        $this->attributes['clave'] = bcrypt($value);
    }
}

    

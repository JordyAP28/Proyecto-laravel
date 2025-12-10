<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Usuario extends Model
{
    use HasFactory;

    protected $table = 'usuarios';
    protected $primaryKey = 'id_usuario';
    public $timestamps = false;

    protected $fillable = [
        'nombre_usuario',
        'primer_nombre',
        'apellido',
        'cedula',
        'telefono',
        'email',
        'clave',
        'id_rol',
        'id_estado'
    ];

    protected $hidden = ['clave'];

    // <CHANGE> Removed el mutador setClaveAttribute porque hasheamos explícitamente en los controladores

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
}
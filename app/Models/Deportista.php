<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Deportista extends Model
{
    //Creacion de datos modelos.
    use HasFactory;

    protected $table = 'deportistas';
    protected $primaryKey = 'id_deportista';
    public $timestamps = false;

    protected $fillable = [
        'fecha_nacimiento',
        'fecha_registro',
        'cedula',
        'nombre',
        'apellido',
        'correo',
        'direccion',
        'telefono'
    ];

    // Relación con InscripcionCurso: un deportista puede tener muchas inscripciones
    public function inscripciones()
    {
        return $this->hasMany(InscripcionCurso::class, 'id_deportista');
    }

    // Un deportista puede estar en muchos clubes
    public function jugadorClubs()
    {
        return $this->hasMany(JugadorClub::class, 'id_deportista');
    }
}


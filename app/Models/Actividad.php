<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;


class Actividad extends Model
{
    //Creacion de datos modelos.
    use HasFactory;
    protected $table = 'actividades';
    protected $primaryKey = 'id_actividad';

    protected $fillable = [
      'fecha',
      'hora_inicio',
      'hora_fin',
      'descripcion',
      'nombre_actividad'
    ];

    // Relacion de actividad y programa actividad
    public function programaActividades()
    {
      return $this->hasMany(ProgramaActividad::class, 'id_actividad');
    }
}

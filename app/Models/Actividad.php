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

    protected $fillable = ['fecha', 'hora_inicio', 'hora_fin', 'descripcion', 'nombre_actividad'];

    //Una actividad puede estar en muchos programas
    public function programaActividades()
    {
      turn $this->hasMany(ProgramaActividad::class, 'id_actividad');
    }
}

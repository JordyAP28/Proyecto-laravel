<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;


class ProgramaActividad extends Model
{
    //creacion de datos modelo.
    use HasFactory;

    protected $table = 'programa_actividades';
    protected $primaryKey = 'id_programa_actividad';

    protected $fillable = [
        'id_escenario',
        'id_actividad'
    ];

    // Relación con escenario
    public function escenario()
    {
        return $this->belongsTo(Escenario::class, 'id_escenario');
    }

    // Relación con Actividad
    public function actividad()
    {
        return $this->belongsTo(Actividad::class, 'id_actividad');
    }
}

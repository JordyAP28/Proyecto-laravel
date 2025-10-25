<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InscripcionCurso extends Model
{
    //Creacion de datos modelos
    use HasFactory;
    protected $table='inscripcion_cursos';
    protected $primaryKey = 'id_inscripcion';

    protected $fillable = ['id_curso', 'id_deportista', 'fecha_inscripcion'];

    // Relación con Curso: cada inscripción pertenece a un curso
    public function curso()
    {
        return $this->belongsTo(Curso::class, 'id_curso');
    }

    // Cada inscripción pertenece a un deportista
    public function deportista()
    {
        return $this->belongsTo(Deportista::class, 'id_deportista');
    }
}

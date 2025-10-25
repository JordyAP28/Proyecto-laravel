<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Curso extends Model
{
    //Creacion de datos modelos.
    use HasFactory;
    
    protected $table = 'cursos';
    protected $primaryKey = 'id_curso';

    protected $fillable = ['id_estado', 'nombre_curso', 'tipo', 'descripcion', 'fecha_inicio', 'fecha_fin'];

    // Relación con Estado: un curso pertenece a un estado
    public function estado()
    {
         return $this->belongsTo(Estado::class, 'id_estado');
    }

    //un curso puede tener muchas incripciones
    public function inscripciones()
    {
        return $this->hasMany(InscripcionCurso::class, 'id_curso');
    }
}

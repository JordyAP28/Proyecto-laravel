<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Estado extends Model
{
    // Creacion de datos modelos
    use HasFactory;

    protected $table = 'estados';
    protected $primaryKey = 'id_estado';

    protected $fillable = [
        'estado'
    ];
    
    // Puede tener muchos usuarios.
    public function usuarios()
    {
        return $this->hasMany(Usuario::class, 'id_estado');
    }

    // Relacion con cursos
    public function cursos()
    {
        return $this->hasMany(Curso::class, 'id_estado');
    }
    
    // Relacion con clubes
    public function clubes()
    {
        return $this->hasMany(Club::class, 'id_estado');
    }

}

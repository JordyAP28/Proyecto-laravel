<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Escenario extends Model
{
    //Creacion de datos modelos.
    use HasFactory;
    protected $table= 'escenarios';
    protected $primaryKey = 'id_escenario';
    protected $fillable = ['nombre', 'tipo', 'capacidad'];


    //un escenario puede tener muchas actividaes.
    public function programaActividades()
    {
          return $this->hasMany(ProgramaActividad::class, 'id_escenario');
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Campeonato extends Model
{
    use HasFactory;
    protected $table='campeonatos'; 
    protected $primarykey= 'id_campeonato';

    protected $fillable =[
        'nombre', 'fecha_inicio', 'fecha_fin', 'categoria' 
    ];

    //un campeonato tendra muchos club. 
    public function clubCampeonatos()
    {
        return $this->hasMany(ClubCampeonato::class, 'id_campeonato');
    }

}

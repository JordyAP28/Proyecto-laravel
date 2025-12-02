<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Campeonato extends Model
{
    use HasFactory;
    protected $table='campeonatos'; 
    protected $primaryKey = 'id_campeonato';
    public $timestamps = false;

    protected $fillable =[
        'nombre',
        'fecha_inicio',
        'fecha_fin',
        'categoria' 
    ];

    // Relacion con clubCampeonatos 
    public function clubCampeonatos()
    {
        return $this->hasMany(ClubCampeonato::class, 'id_campeonato');
    }

}

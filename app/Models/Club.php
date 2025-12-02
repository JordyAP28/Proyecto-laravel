<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;


class Club extends Model
{
    //creacion de datos modelos
    use HasFactory;

    protected $table = 'clubes';
    protected $primaryKey = 'id_club';
    public $timestamps = false;

    protected $fillable = [
        'fecha_creacion',
        'id_estado',
        'nombre',
        'representante',
        'telefono'
    ];

    // Relación con Estado
    public function estado()
    {
        return $this->belongsTo(Estado::class, 'id_estado');
    }

    // Relación con JugadorClub: un club tiene muchos jugadores
    public function jugadorClubs()
    {
        return $this->hasMany(JugadorClub::class, 'id_club');
    }

    // Relación con ClubCampeonato: un club puede participar en muchos campeonatos
    public function clubCampeonatos()
    {
        return $this->hasMany(ClubCampeonato::class, 'id_club');
    }
}

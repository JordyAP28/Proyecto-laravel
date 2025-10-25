<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JugadorClub extends Model
{
    //Creacion de datos modelos.
    use HasFactory;
    protected $table = 'jugador_clubes';
    protected $primaryKey = 'id_jugador';

    protected $fillable = ['id_deportista', 'id_club', 'fecha_ingreso', 'activo'];

    // Relación con Deportista: un jugador pertenece a un deportista
    public function deportista()
    {
        return $this->belongsTo(Deportista::class, 'id_deportista');
    }

    // Relación con Club: un jugador pertenece a un club
    public function club()
    {
        return $this->belongsTo(Club::class, 'id_club');
    }
}

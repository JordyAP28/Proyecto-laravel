<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ClubCampeonato extends Model
{
   //Su creacion de datos de modelos.
   use HasFactory;
     
   protected $table= 'club_campeonatos';
   protected $primaryKey = 'id_club_campeonato';
   public $timestamps = false;

   protected $fillable = [
      'id_club',
      'id_campeonato'
   ];

   // Relacion con club
   public function club()
   {
      return $this->belongsTo(Club::class, 'id_club');
   }

   //Relacion con campeonato
   public function campeonato()
   {
      return $this->belongsTo(Campeonato::class, 'id_campeonato');
   }

}

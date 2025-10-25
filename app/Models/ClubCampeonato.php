<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ClubCampeonato extends Model
{
    //Su creacion de datos de modelos.
     use HasFactory;
     protected $table= 'club_campeonato';
     protected $primaryKey = 'id_club_campeonato';

     protected $fillable = ['club_id', 'campeonato_id'];

     public function club()
     {
        return $this->belongsTo(Club::class, 'club_id');
     }
     
     public function campeonato()
     {
        return $this->belongsTo(Campeonato::class, 'campeonato_id');
     }

}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class LogSistema extends Model
{
    use HasFactory;

    protected $table = 'log_sistemas';
    protected $primaryKey = 'id_log';

    protected $fillable = [
        'id_usuario',
        'accion'
    ];

    // Relación con usuario
    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'id_usuario');
    }
}
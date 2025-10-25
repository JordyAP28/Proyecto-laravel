<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class LogSistema extends Model
{
    use HasFactory;

    protected $table = 'log_sistema';
    protected $primaryKey = 'id_log';

    protected $fillable = ['usuario_id', 'accion', 'descripcion'];

    // Relación
    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'usuario_id');
    }
}
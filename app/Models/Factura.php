<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Factura extends Model
{
    //Creacion de datos modelos.
    use HasFactory;
    
    protected $table='facturas';
    protected $primaryKey = 'id_factura';

    protected $fillable = ['id_deportista', 'fecha_emision', 'total', 'estado'];

    // Relación con Deportista
    public function deportista()
    {
        return $this->belongsTo(Deportista::class, 'id_deportista');
    }

    public function detalles()
    {
        return $this->hasMany(DetalleFactura::class, 'id_factura');
    }
}

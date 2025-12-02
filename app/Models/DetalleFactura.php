<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DetalleFactura extends Model
{
    //Creacion de datos modelos.
    use HasFactory;

    protected $table = 'detalle_factura';
    protected $primaryKey = 'id_detalle_factura';
    
    protected $fillable = [
        'id_factura',
        'concepto',
        'monto'
    ];

    //relacion con factura.
    public function factura()
    {
        return $this->belongsTo(Factura::class, 'id_factura');
    }
}


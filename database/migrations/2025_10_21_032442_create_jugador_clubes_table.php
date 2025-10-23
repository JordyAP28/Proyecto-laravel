<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('jugador_clubes', function (Blueprint $table) {
            $table->id();
            $table->foreingId('id_jugador')->constrained('jugadores','id_jugador');
            $table->foreingId('id_club')->constrained('clubes','id_club');
            $table->date('fecha_ingreso');
            $table->booleam('activo')->defaul();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('jugador_clubes');
    }
};

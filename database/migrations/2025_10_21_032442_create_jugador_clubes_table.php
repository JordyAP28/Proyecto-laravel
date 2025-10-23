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
            $table->id('id_jugador');
            $table->foreingId('id_deportista')->constrained('deportistas','id_deportista');
            $table->foreingId('id_club')->constrained('clubes','id_club');
            $table->date('fecha_ingreso');
            $table->booleam('activo')->defaul(true);
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

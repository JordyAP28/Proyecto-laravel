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
            $table->foreignId('id_deportista')->constrained('deportistas','id_deportista');
            $table->foreignId('id_club')->constrained('clubes','id_club');
            $table->date('fecha_ingreso');
            $table->boolean('activo')->default(true);
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

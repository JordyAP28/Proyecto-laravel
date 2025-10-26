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
        Schema::create('programa_actividades', function (Blueprint $table) {
            $table->id('id_programa_actividad');
            $table->foreignId('id_escenario')->constrained('escenarios','id_escenario');
            $table->foreignId('id_actividad')->constrained('actividades','id_actividad');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('programa_actividades');
    }
};

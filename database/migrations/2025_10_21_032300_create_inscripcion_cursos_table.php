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
        Schema::create('inscripcion_cursos', function (Blueprint $table) {
            $table->id('id_inscripcion');
            $table->foreignId('id_curso')->constrained('cursos','id_curso');
            $table->foreignId('id_deportista')->constrained('deportistas','id_deportista');
            $table->timestamp('fecha_inscripcion')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inscripcion_cursos');
    }
};

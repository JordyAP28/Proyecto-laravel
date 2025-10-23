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
        Schema::create('cursos', function (Blueprint $table) {
            $table->id('id_curso');
            $table->foreingId('id_estado')->constrained('estados','id_estado');
            $table->string('nombre_curso');
            $table->enum('tipo',['Vacacional','Permanete','Temporal']);
            $table->text('descripcion');
            $table->date('fecha_inicio');
            $table->date('facha_fin');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cursos');
    }
};

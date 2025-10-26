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
        Schema::create('deportistas', function (Blueprint $table) {
            $table->id('id_deportista');
            $table->date('fecha_nacimiento');
            $table->timestamp('fecha_registro')->useCurrent();
            $table->string('cedula')->unique();
            $table->string('nombre');
            $table->string('apellido');
            $table->string('correo')->unique();
            $table->string('direccion');
            $table->string('telefono');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('deportistas');
    }
};

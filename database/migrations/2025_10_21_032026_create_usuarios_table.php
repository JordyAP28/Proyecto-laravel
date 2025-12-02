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
        Schema::create('usuarios', function (Blueprint $table) {
            $table->id('id_usuario');
            $table->foreignId('id_rol')->constrained('roles','id_rol');
            $table->foreignId('id_estado')->constrained('estados','id_estado');

            // Credenciales básicas
            $table->string('nombre_usuario');
            $table->string('clave');

            // Datos de estudiante/usuario
            $table->string('primer_nombre')->nullable();
            $table->string('apellido')->nullable();
            $table->string('cedula')->nullable()->unique();
            $table->string('telefono')->nullable();
            $table->string('email')->nullable()->unique();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('usuarios');
    }
};

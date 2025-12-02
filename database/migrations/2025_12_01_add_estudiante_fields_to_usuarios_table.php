<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('usuarios', function (Blueprint $table) {
            $table->string('primer_nombre')->nullable()->after('nombre_usuario');
            $table->string('apellido')->nullable()->after('primer_nombre');
            $table->string('cedula')->nullable()->unique()->after('apellido');
            $table->string('telefono')->nullable()->after('cedula');
            $table->string('email')->nullable()->unique()->after('telefono');
        });
    }

    public function down(): void
    {
        Schema::table('usuarios', function (Blueprint $table) {
            $table->dropColumn(['primer_nombre', 'apellido', 'cedula', 'telefono', 'email']);
        });
    }
};
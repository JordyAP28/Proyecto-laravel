<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash; // ← Agregar esto

class UsuarioSeeder extends Seeder // ← Cambiar nombre
{
    public function run(): void
    {
        DB::table('usuarios')->insert([
            [
                'id_rol' => 1, // Administrador
                'id_estado' => 1, // Activo
                'nombre_usuario' => 'admin', // ← Cambiar campo
                'clave' => Hash::make('admin123'), // ← Cambiar campo
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id_rol' => 2, // Secretaria
                'id_estado' => 1,
                'nombre_usuario' => 'secretaria',
                'clave' => Hash::make('secretaria123'),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id_rol' => 3, // Deportista
                'id_estado' => 1,
                'nombre_usuario' => 'deportista',
                'clave' => Hash::make('deportista123'),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id_rol' => 4, // Entrenador
                'id_estado' => 1,
                'nombre_usuario' => 'entrenador',
                'clave' => Hash::make('entrenador123'),
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
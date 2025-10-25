<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;


class NombreDelSeeder extends Seeder
{
    
    public function run(): void
    {
        DB::table('usuarios')->insert([
            [
                'id_rol' => 1, // Administrador
                'id_estado' => 1, // Activo
                'nombre' => 'Administrador',
                'apellido' => 'Principal',
                'email' => 'admin@example.com',
                'password' => Hash::make('password123')
            ],
            [
                'id_rol' => 2, // Entrenador
                'id_estado' => 1,
                'nombre' => 'Carlos',
                'apellido' => 'Gomez',
                'email' => 'entrenador@example.com',
                'password' => Hash::make('password123')
            ]
        ]);
    }
}

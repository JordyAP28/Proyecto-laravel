<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RolSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('roles')->insert([
            ['id_rol' => 1, 'rol' => 'Administrador'],
            ['id_rol' => 2, 'rol' => 'Secretaria'],
            ['id_rol' => 3, 'rol' => 'Deportista'],
            ['id_rol' => 4, 'rol' => 'Entrenador'],
        ]);
    }
}
<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EstadoSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('estados')->insert([
            ['id_estado' => 1, 'estado' => 'Activo'],
            ['id_estado' => 2, 'estado' => 'Inactivo'],
            ['id_estado' => 3, 'estado' => 'Suspendido'],
            ['id_estado' => 4, 'estado' => 'Anulado'],
            ['id_estado' => 5, 'estado' => 'Observacion'],
        ]);
    }
}
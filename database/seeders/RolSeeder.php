<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB; 

class RolSeeder extends Seeder
{
    
    public function run(): void
    {
         DB::table('roles')->insert([
            ['rol' => 'Administrador'],
            ['rol' => 'Entrenador'],
            ['rol' => 'Deportista'],
            ['rol' => 'Secretaria'],
        ]);
    }
}

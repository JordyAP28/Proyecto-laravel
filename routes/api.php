<?php

use Illuminate\Support\Facades\Route;

// Importar todos los controladores
use App\Http\Controllers\UsuarioController;
use App\Http\Controllers\RolController;
use App\Http\Controllers\EstadoController;
use App\Http\Controllers\LogSistemaController;
use App\Http\Controllers\CursoController;
use App\Http\Controllers\InscripcionCursoController;
use App\Http\Controllers\DeportistaController;
use App\Http\Controllers\ClubController;
use App\Http\Controllers\JugadorClubController;
use App\Http\Controllers\CampeonatoController;
use App\Http\Controllers\ClubCampeonatoController;
use App\Http\Controllers\EscenarioController;
use App\Http\Controllers\ActividadController;
use App\Http\Controllers\ProgramaActividadController;
use App\Http\Controllers\FacturaController;
use App\Http\Controllers\DetalleFacturaController;

// Ruta de prueba para verificar que la API funciona
Route::get('/test', function () {
    return response()->json(['message' => 'API funcionando correctamente']);
});

// Rutas tipo recurso (CRUD automático)
Route::apiResource('usuarios', UsuarioController::class);
Route::apiResource('roles', RolController::class);
Route::apiResource('estados', EstadoController::class);
Route::apiResource('logs', LogSistemaController::class);
Route::apiResource('cursos', CursoController::class);
Route::apiResource('inscripciones', InscripcionCursoController::class);
Route::apiResource('deportistas', DeportistaController::class);
Route::apiResource('clubes', ClubController::class);
Route::apiResource('jugador_clubes', JugadorClubController::class);
Route::apiResource('campeonatos', CampeonatoController::class);
Route::apiResource('club_campeonatos', ClubCampeonatoController::class);
Route::apiResource('escenarios', EscenarioController::class);
Route::apiResource('actividades', ActividadController::class);
Route::apiResource('programa_actividades', ProgramaActividadController::class);
Route::apiResource('facturas', FacturaController::class);
Route::apiResource('detalle_facturas', DetalleFacturaController::class);

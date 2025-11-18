<?php

use Illuminate\Support\Facades\Route;

// Importar todos los controladores
use App\Http\Controllers\Api\UsuarioController;
use App\Http\Controllers\Api\RolController;
use App\Http\Controllers\Api\EstadoController;
use App\Http\Controllers\Api\LogSistemaController;
use App\Http\Controllers\Api\CursoController;
use App\Http\Controllers\Api\InscripcionCursoController;
use App\Http\Controllers\Api\DeportistaController;
use App\Http\Controllers\Api\ClubController;
use App\Http\Controllers\Api\JugadorClubController;
use App\Http\Controllers\Api\CampeonatoController;
use App\Http\Controllers\Api\ClubCampeonatoController;
use App\Http\Controllers\Api\EscenarioController;
use App\Http\Controllers\Api\ActividadController;
use App\Http\Controllers\Api\ProgramaActividadController;
use App\Http\Controllers\Api\FacturaController;
use App\Http\Controllers\Api\DetalleFacturaController;

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

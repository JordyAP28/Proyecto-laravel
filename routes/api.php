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
use App\Http\Controllers\Api\PasswordResetController;
// Ruta de prueba para verificar que la API funciona
Route::get('/test', function () {
    return response()->json(['message' => 'API funcionando correctamente']);
});


Route::get('/ping', function () {
    return response()->json(['message' => 'API está viva']);
});



// Rutas tipo recurso (CRUD automático)
Route::apiResource('actividades', ActividadController::class);
Route::apiResource('campeonatos', CampeonatoController::class);
Route::apiResource('club-campeonatos', ClubCampeonatoController::class);
Route::apiResource('clubes', ClubController::class);
Route::apiResource('cursos', CursoController::class);
Route::apiResource('deportistas', DeportistaController::class);
Route::apiResource('detalle-facturas', DetalleFacturaController::class);
Route::apiResource('escenarios', EscenarioController::class);
Route::apiResource('estados', EstadoController::class);
Route::apiResource('facturas', FacturaController::class);
Route::apiResource('inscripcion-cursos', InscripcionCursoController::class);
Route::apiResource('jugador-clubes', JugadorClubController::class);
Route::apiResource('log-sistemas', LogSistemaController::class);
Route::apiResource('programa-actividades', ProgramaActividadController::class);
Route::apiResource('roles', RolController::class);
Route::apiResource('usuarios', UsuarioController::class);
Route::post('/register', [\App\Http\Controllers\Api\AuthController::class, 'register']);
Route::post('/forgot-password', [PasswordResetController::class, 'sendResetLink']);
Route::post('/reset-password',  [PasswordResetController::class, 'resetPassword']);

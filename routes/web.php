<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CursoController;

Route::get('/', function () {
    return view('auth/login');
});

// Rutas para invitados (sin iniciar sesión)
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'login'])->name('login');
    Route::post('/login', [AuthController::class, 'loginForm']);
    
    Route::get('/register', [AuthController::class, 'register'])->name('register');
    Route::post('/register', [AuthController::class, 'registerStore'])->name('register.store');

    // Recuperar contraseña
    Route::get('/recuperar-contrasena', [AuthController::class, 'recuperarContrasena'])->name('recuperar.contrasena');
    Route::post('/recuperar-contrasena', [AuthController::class, 'recuperarContrasena']);

    // Reestablecer contraseña
    Route::get('/reestablecer-contrasena', [AuthController::class, 'reestablecerContrasena'])->name('reestablecer.contrasena');
    Route::post('/reestablecer-contrasena', [AuthController::class, 'reestablecerContrasena']);
    Route::post('/actualizar-contrasena', [AuthController::class, 'actualizarContrasena'])->name('actualizar.contrasena');
});

// Rutas protegidas (solo con sesión iniciada)
Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [CursoController::class, 'index'])->name('dashboard.estudiante');
    Route::post('/inscribirse/{curso_id}', [CursoController::class, 'inscribirse'])->name('curso.inscribirse');
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
});

// Redirección si se accede a una ruta no definida
Route::get('/{slug}', function () {
    return redirect()->route('login');
})->where('slug', '.*');

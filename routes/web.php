<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

Route::get('/', function () {
    return view('auth/login');
});

//Rutas para acceder a las vistas de inicio de sesion
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'login'])->name('login');
    Route::post('/login', [AuthController::class, 'loginForm']);
    
    Route::get('/register', [AuthController::class, 'register'])->name('register');
    Route::post('/register', [AuthController::class, 'registerStore']);

    // Recuperar contraseña
    Route::get('/recuperar-contrasena', [AuthController::class, 'recuperarContrasena'])
        ->name('recuperar.contrasena');
    Route::post('/recuperar-contrasena', [AuthController::class, 'recuperarContrasena']);

    // Reestablecer contraseña
    Route::get('/reestablecer-contrasena', [AuthController::class, 'reestablecerContrasena'])
        ->name('reestablecer.contrasena');
    Route::post('/reestablecer-contrasena', [AuthController::class, 'reestablecerContrasena']);
    Route::post('/actualizar-contrasena', [AuthController::class, 'actualizarContrasena'])->name('actualizar.contrasena');


});

Route::post('/logout', [AuthController::class, 'logout'])
    ->middleware('auth')
    ->name('logout');



//Si se accede a una ruta no definida se redirecciona al apartado de login
Route::get('/{slug}', function () {

    return redirect()->route('login');

})->where('slug', '.*');

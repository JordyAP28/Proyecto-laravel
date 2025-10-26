<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

Route::get('/', function () {
    return view('auth/login');
});

//Rutas para acceder a las vistas de inicio de sesion
Route::get('register', [AuthController::class, 'register'])->name('register');
Route::post('register', [AuthController::class, 'registerStore']);
Route::get('login', [AuthController::class, 'login'])->name('login');
Route::post('login', [AuthController::class, 'loginForm']);
Route::post('logout', [AuthController::class, 'logout'])->name('logout');




//Si se accede a una ruta no definida se redirecciona al apartado de login
Route::get('/{slug}', function () {

    return redirect()->route('login');

})->where('slug', '.*');

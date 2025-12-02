<?php

use Illuminate\Support\Facades\Route;

// 1) Ruta que Laravel usa desde el correo
Route::get('/reset-password/{token}', function (string $token) {
    $email = request('email');

    // Redirige a la ruta de React donde está tu formulario
    return redirect('/reestablecer-contrasena?token=' . $token . '&email=' . $email);
})->name('password.reset');

// 2) Catch-all para tu SPA (SIEMPRE AL FINAL)
Route::get('/{any}', function () {
    return view('app'); // app.blade.php donde se monta React
})->where('any', '.*');

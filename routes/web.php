<?php

use Illuminate\Support\Facades\Route;

// Ruta única: todas las peticiones devuelven la vista base de React
Route::get('/{any}', function () {
    return view('app'); // app.blade.php será la base donde React se monta
})->where('any', '.*');

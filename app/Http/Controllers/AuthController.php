<?php

namespace App\Http\Controllers;

use App\Http\Requests\RegisterRequest;
use App\Http\Requests\LoginRequest;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Redirect;

class AuthController extends Controller {
    // Mostrar formulario de registro
    public function register()
    {
        return view('auth.register');
    }

    // Guardar registro de usuario
    public function registerStore(RegisterRequest $formRequest)
    {
        $user = User::create([
            'username' => $formRequest->username,
            'email'    => $formRequest->email,
            'password' => Hash::make($formRequest->password),
        ]);

        return redirect()
            ->route('login')
            ->with('success', 'Registro exitoso. Puedes iniciar sesión.');
    }

    // Mostrar formulario de login
    public function login()
    {
        return view('auth.login');
    }

    // Procesar login
    public function loginForm(LoginRequest $formRequest)
    {
        if (Auth::attempt([
            'email'    => $formRequest->email, 
            'password' => $formRequest->password
        ])) {
            return Redirect::to('ventas/venta');
        }

        return redirect()
            ->route('login')
            ->withErrors(['email' => 'Credenciales incorrectas.']);
    }

    // Cerrar sesión
    public function logout()
    {
        Auth::logout();
        return redirect()->route('login');
    }
}

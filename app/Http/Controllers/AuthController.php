<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\RegisterRequest;
use App\Http\Requests\LoginRequest;
use App\Models\User;
use App\Models\Rol;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class AuthController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('guest', except: ['logout']),
            new Middleware('auth', only: ['logout']),
        ];
    }

    public function register()
    {
        $roles = Rol::whereIn('id_rol', [3, 4])->get();
        
        if ($roles->isEmpty()) {
            $roles = collect([
                (object)['id_rol' => 3, 'rol' => 'Deportista'],
                (object)['id_rol' => 4, 'rol' => 'Entrenador']
            ]);
        }
        
        return view('auth.register', ['roles' => $roles]);
    }

    public function registerStore(RegisterRequest $request)
    {
        User::create([ // ← Cambia esto
            'username' => $request->username,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        return redirect()->route('login')
            ->with('success', 'Registro exitoso. Puedes iniciar sesión.');
    }

    public function login()
    {
        return view('auth.login');
    }
    
    public function loginForm(LoginRequest $request)
    {
        $credentials = [
            'email' => $request->email,
            'password' => $request->password
        ];

        if (Auth::attempt($credentials, $request->boolean('remember'))) {
            $request->session()->regenerate();
            
            return redirect()->intended('ventas/venta')
                ->with('success', '¡Bienvenido de nuevo!');
        }

        return back()
            ->withErrors(['email' => 'Credenciales incorrectas.'])
            ->onlyInput('email');
    }

    public function logout(Request $request)
    {
        Auth::logout();
        
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login')
            ->with('success', 'Sesión cerrada exitosamente.');
    }
}
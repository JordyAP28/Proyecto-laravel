<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Rol;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    // ==============================
    // VISTA LOGIN
    // ==============================
    public function login()
    {
        return view('auth.login');
    }

    // ==============================
    // PROCESAR LOGIN
    // ==============================
    public function loginForm(Request $request)
    {
        $request->validate([
            'nombre_usuario' => 'required|string',
            'password' => 'required|string'
        ]);

        // Laravel usará "clave" gracias al método getAuthPassword() en el modelo User
        $credentials = [
            'nombre_usuario' => $request->nombre_usuario,
            'password'       => $request->password
        ];

        if (Auth::attempt($credentials, $request->boolean('remember'))) {
            $request->session()->regenerate();

            return redirect()
                ->route('dashboard.estudiante')
                ->with('success', '¡Bienvenido!');
        }

        return back()
            ->withErrors(['nombre_usuario' => 'Credenciales incorrectas.'])
            ->withInput();
    }

    // ==============================
    // VISTA REGISTRO
    // ==============================
    public function register()
    {
        // Ajusta roles según tus necesidades
        $roles = Rol::whereIn('id_rol', [3, 4])->get();

        if ($roles->isEmpty()) {
            $roles = collect([
                (object)['id_rol' => 3, 'rol' => 'Estudiante'],
                (object)['id_rol' => 4, 'rol' => 'Profesor']
            ]);
        }

        return view('auth.register', ['roles' => $roles]);
    }

    // ==============================
    // PROCESAR REGISTRO
    // ==============================
    public function registerStore(Request $request)
    {
        $request->validate([
            'username' => 'required|string|max:255',
            'email'    => 'nullable|email|max:255',
            'password' => 'required|confirmed|min:6',
        ]);

        $user = User::create([
            'nombre_usuario' => $request->username,
            'clave'          => Hash::make($request->password),
            'id_rol'         => 3, // Rol por defecto
            'id_estado'      => 1, // Estado activo
        ]);

        Auth::login($user);

        return redirect()
            ->route('dashboard.estudiante')
            ->with('success', 'Registro exitoso. ¡Bienvenido!');
    }

    // ==============================
    // RECUPERAR CONTRASEÑA – VISTA
    // ==============================
    public function recuperarContrasena()
    {
        return view('auth.recuperarcontrasena');
    }

    // ==============================
    // REESTABLECER CONTRASEÑA – VISTA
    // ==============================
    public function reestablecerContrasena()
    {
        return view('auth.reestablecercontrasena');
    }

    // ==============================
    // ACTUALIZAR CONTRASEÑA
    // ==============================
    public function actualizarContrasena(Request $request)
    {
        $request->validate([
            'token'    => 'required',
            'password' => 'required|confirmed|min:8',
        ]);

        // Aquí iría la lógica real para cambiar contraseña mediante token

        return redirect()
            ->route('login')
            ->with('success', 'Contraseña actualizada correctamente.');
    }
}

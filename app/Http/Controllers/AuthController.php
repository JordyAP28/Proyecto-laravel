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
    // Login
    // ==============================
    public function login() {
        return view('auth.login');
    }

    public function loginForm(Request $request) {
        $credentials = [
            'nombre_usuario' => $request->nombre_usuario,
            'password' => $request->password
        ];

        if (Auth::attempt($credentials, $request->boolean('remember'))) {
            $request->session()->regenerate();
            return redirect()->route('dashboard.estudiante')->with('success', '¡Bienvenido de nuevo!');
        }

        return back()->withErrors(['nombre_usuario' => 'Credenciales incorrectas.'])->onlyInput('nombre_usuario');
    }

    // ==============================
    // Recuperar / Reestablecer Contraseña
    // ==============================
    public function recuperarContrasena()
    {
        return view('auth.recuperarcontrasena');
    }

    public function reestablecerContrasena()
    {
        return view('auth.reestablecercontrasena');
    }

    public function actualizarContrasena(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'password' => 'required|confirmed|min:8',
        ]);

        return redirect()->route('login')->with('success', 'Contraseña actualizada correctamente.');
    }

    // ==============================
    // Registro
    // ==============================
    public function register()
    {
        // Solo por si usas roles en la tabla
        $roles = Rol::whereIn('id_rol', [3, 4])->get();

        if ($roles->isEmpty()) {
            $roles = collect([
                (object)['id_rol' => 3, 'rol' => 'Estudiante'],
                (object)['id_rol' => 4, 'rol' => 'Profesor']
            ]);
        }

        return view('auth.register', ['roles' => $roles]);
    }

    public function registerStore(Request $request)
    {
        // Validación simple, basada en tu formulario
        $request->validate([
            'username' => 'required|string|max:255',
            'email' => 'nullable|email|max:255', // opcional si tu tabla no lo usa
            'password' => 'required|confirmed|min:6',
        ]);

        // Crear usuario
        $user = User::create([
            'nombre_usuario' => $request->username,
            'clave' => Hash::make($request->password),
            'id_rol' => 3, // puedes ajustar según el tipo de usuario
            'id_estado' => 1,
        ]);

        // Iniciar sesión automáticamente
        Auth::login($user);

        return redirect()->route('dashboard.estudiante')
            ->with('success', 'Registro exitoso. ¡Bienvenido!');
    }

    // ==============================
    // Inicio de Sesión
    // ==============================
    public function login()
    {
        return view('auth.login');
    }

    public function registrarEstudiante(Request $request) {
        $request->validate([
            'nombre' => 'required|string|max:255',
            'correo' => 'required|email|unique:estudiantes,correo',
            'curso' => 'required|string',
            'password' => 'required|confirmed|min:6',
            'pago' => 'required',
            'comprobante' => 'nullable|image|max:2048'
        ]);

        $estudiante = new \App\Models\Estudiante();
        $estudiante->nombre = $request->nombre;
        $estudiante->correo = $request->correo;
        $estudiante->curso = $request->curso;
        $estudiante->password = bcrypt($request->password);
        $estudiante->pago = $request->pago;

        if ($request->hasFile('comprobante')) {
            $file = $request->file('comprobante');
            $filename = time().'_'.$file->getClientOriginalName();
            $file->storeAs('public/comprobantes', $filename);
            $estudiante->comprobante = $filename;
        }

        $estudiante->save();

        return redirect()->route('login')->with('success', 'Registro exitoso');
    }

    // ==============================
    // Recuperar / Reestablecer contraseña
    // ==============================
    public function recuperarContrasena() {
        return view('auth.recuperarcontrasena');
    }

    public function reestablecerContrasena() {
        return view('auth.reestablecercontrasena');
    }

    public function actualizarContrasena(Request $request) {
        $request->validate([
            'token' => 'required',
            'password' => 'required|confirmed|min:8',
        ]);

        return redirect()->route('login')->with('success', 'Contraseña actualizada correctamente.');
    }
}

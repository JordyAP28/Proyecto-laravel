<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Usuario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class LoginController extends Controller
{
    public function login(Request $request)
    {
        try {
            $email = $request->input('email');
            $password = $request->input('password');

            if (!$email || !$password) {
                return response()->json([
                    'success' => false,
                    'message' => 'Email y contraseña son requeridos'
                ], 422);
            }

            // Buscar usuario por email
            $usuario = Usuario::where('email', $email)->first();

            if (!$usuario) {
                return response()->json([
                    'success' => false,
                    'message' => 'El email o la contraseña son incorrectos'
                ], 401);
            }

            // Verificar contraseña
            if (!Hash::check($password, $usuario->clave)) {
                return response()->json([
                    'success' => false,
                    'message' => 'El email o la contraseña son incorrectos'
                ], 401);
            }

            // Login exitoso
            Log::info('Login exitoso', ['usuario_id' => $usuario->id_usuario, 'email' => $email]);

            return response()->json([
                'success' => true,
                'message' => 'Login exitoso',
                'token' => 'user_token_' . $usuario->id_usuario . '_' . time(),
                'usuario' => [
                    'id_usuario' => $usuario->id_usuario,
                    'nombre_usuario' => $usuario->nombre_usuario,
                    'email' => $usuario->email,
                    'id_rol' => $usuario->id_rol,
                ]
            ], 200);

        } catch (\Exception $e) {
            Log::error('Error en login: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al iniciar sesión'
            ], 500);
        }
    }
}
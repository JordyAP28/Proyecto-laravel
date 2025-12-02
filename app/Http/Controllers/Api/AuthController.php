<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Usuario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        try {
            Log::info('Petición de registro recibida', $request->all());

            $validator = Validator::make($request->all(), [
                'primer_nombre' => 'required|string|max:255',
                'apellido' => 'required|string|max:255',
                'cedula' => 'required|string|unique:usuarios,cedula',
                'telefono' => 'required|string|max:20',
                'email' => 'required|email|unique:usuarios,email',
                'password' => 'required|string|min:6',
                'password_confirmation' => 'required|string|same:password',
            ], [
                'primer_nombre.required' => 'El primer nombre es obligatorio',
                'apellido.required' => 'El apellido es obligatorio',
                'cedula.required' => 'La cédula es obligatoria',
                'cedula.unique' => 'Esta cédula ya está registrada',
                'telefono.required' => 'El teléfono es obligatorio',
                'email.required' => 'El email es obligatorio',
                'email.email' => 'El email no es válido',
                'email.unique' => 'Este email ya está registrado',
                'password.required' => 'La contraseña es obligatoria',
                'password.min' => 'La contraseña debe tener al menos 6 caracteres',
                'password_confirmation.required' => 'Debes confirmar la contraseña',
                'password_confirmation.same' => 'Las contraseñas no coinciden',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Error en la validación',
                    'errors' => $validator->errors()
                ], 422);
            }

            $usuario = Usuario::create([
                'primer_nombre' => $request->primer_nombre,
                'apellido' => $request->apellido,
                'cedula' => $request->cedula,
                'telefono' => $request->telefono,
                'email' => $request->email,
                'clave' => $request->password,
                'nombre_usuario' => $request->email,
                'id_rol' => 3, // Deportista (estudiante)
                'id_estado' => 1, // Estado activo
            ]);

            Log::info('Usuario registrado exitosamente', ['usuario_id' => $usuario->id_usuario]);

            return response()->json([
                'success' => true,
                'message' => 'Usuario registrado exitosamente',
                'data' => [
                    'id_usuario' => $usuario->id_usuario,
                    'nombre_usuario' => $usuario->nombre_usuario,
                    'email' => $usuario->email,
                ]
            ], 201);

        } catch (\Exception $e) {
            Log::error('Error en registro: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al registrar usuario: ' . $e->getMessage(),
            ], 500);
        }
    }
}

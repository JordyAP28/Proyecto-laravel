<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Usuario;
use Illuminate\Container\Attributes\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        try {
            Log::info('Petición de login recibida', ['email' => $request->email]);

            $validator = Validator::make($request->all(), [
                'email' => 'required|email',
                'password' => 'required|string|min:6',
            ], [
                'email.required' => 'El email es obligatorio',
                'email.email' => 'El email no es válido',
                'password.required' => 'La contraseña es obligatoria',
                'password.min' => 'La contraseña debe tener al menos 6 caracteres',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Error en la validación',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Buscar usuario por email
            $usuario = Usuario::where('email', $request->email)->first();

            if (!$usuario) {
                Log::warning('Usuario no encontrado', ['email' => $request->email]);
                return response()->json([
                    'success' => false,
                    'message' => 'Credenciales incorrectas',
                ], 401);
            }

            Log::info('Usuario encontrado', [
                'id_usuario' => $usuario->id_usuario,
                'email' => $usuario->email,
                'hash_length' => strlen($usuario->clave),
                'hash_prefix' => substr($usuario->clave, 0, 10),
            ]);

            // Verificar contraseña
            $passwordCorrecta = Hash::check($request->password, $usuario->clave);
            
            Log::info('Verificación de contraseña', [
                'resultado' => $passwordCorrecta ? 'CORRECTA' : 'INCORRECTA',
                'password_length' => strlen($request->password),
            ]);

            if (!$passwordCorrecta) {
                return response()->json([
                    'success' => false,
                    'message' => 'Credenciales incorrectas',
                ], 401);
            }

            // Verificar si el usuario está activo
            if ($usuario->id_estado != 1) {
                return response()->json([
                    'success' => false,
                    'message' => 'Usuario inactivo. Contacta al administrador.',
                ], 403);
            }

            // Crear token de autenticación (si usas Sanctum)
            // $token = $usuario->createToken('auth_token')->plainTextToken;

            Log::info('Login exitoso', ['usuario_id' => $usuario->id_usuario]);

            return response()->json([
                'success' => true,
                'message' => 'Login exitoso',
                'data' => [
                    'id_usuario' => $usuario->id_usuario,
                    'nombre_usuario' => $usuario->nombre_usuario,
                    'primer_nombre' => $usuario->primer_nombre,
                    'apellido' => $usuario->apellido,
                    'email' => $usuario->email,
                    'id_rol' => $usuario->id_rol,
                    // 'token' => $token, // Descomenta si usas Sanctum
                ]
            ], 200);

        } catch (\Exception $e) {
            Log::error('Error en login: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al iniciar sesión',
            ], 500);
        }
    }

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

            // Hashear contraseña explícitamente
            $usuario = Usuario::create([
                'primer_nombre' => $request->primer_nombre,
                'apellido' => $request->apellido,
                'cedula' => $request->cedula,
                'telefono' => $request->telefono,
                'email' => $request->email,
                'clave' => Hash::make($request->password),
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

    public function logout(Request $request)
{
    try {
        // Si usas sesiones (aunque normalmente API no usa)
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        Log::info('Logout exitoso');

        return redirect('http://localhost:8000'); 
        // O simplemente return redirect('/');
        
    } catch (\Exception $e) {
        Log::error('Error en logout: ' . $e->getMessage());

        return response()->json([
            'success' => false,
            'message' => 'Error al cerrar sesión',
        ], 500);
    }
}

}
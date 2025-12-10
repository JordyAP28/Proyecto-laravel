<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Usuario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class AdminController extends Controller
{
    // Verificar credenciales de admin
    public function loginAdmin(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'usuario' => 'required|string',
                'password' => 'required|string',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Credenciales inválidas'
                ], 422);
            }

            // Buscar usuario por email/nombre_usuario que sea Secretario (id_rol = 2)
            $usuario = Usuario::where(function ($query) {
                $query->where('nombre_usuario', request('usuario'))
                    ->orWhere('email', request('usuario'));
            })
            ->where('id_rol', 2) // Solo secretarios pueden ser admins
            ->first();

            // Si existe, verificar contraseña
            if ($usuario && Hash::check($request->password, $usuario->clave)) {
                return response()->json([
                    'success' => true,
                    'message' => 'Autenticación exitosa',
                    'token' => 'admin_token_' . $usuario->id_usuario . '_' . time(),
                    'usuario' => [
                        'id_usuario' => $usuario->id_usuario,
                        'email' => $usuario->email,
                        'id_rol' => $usuario->id_rol,
                    ]
                ], 200);
            } 
            // También permitir las credenciales hardcodeadas de admin
            elseif ($request->usuario === 'admin' && $request->password === 'admin123') {
                return response()->json([
                    'success' => true,
                    'message' => 'Autenticación exitosa',
                    'token' => 'admin_token_' . time()
                ], 200);
            } 
            else {
                return response()->json([
                    'success' => false,
                    'message' => 'Usuario o contraseña incorrectos'
                ], 401);
            }
        } catch (\Exception $e) {
            Log::error('Error en login admin: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al autenticar'
            ], 500);
        }
    }

    // Obtener todos los usuarios
    public function obtenerUsuarios(Request $request)
    {
        try {
            $usuarios = Usuario::select('id_usuario', 'nombre_usuario', 'primer_nombre', 'apellido', 'cedula', 'email', 'telefono', 'id_rol', 'id_estado')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $usuarios
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error al obtener usuarios: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener usuarios'
            ], 500);
        }
    }

    // Contar usuarios
    public function contarUsuarios()
    {
        try {
            $total = Usuario::count();

            return response()->json([
                'success' => true,
                'total' => $total
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al contar usuarios'
            ], 500);
        }
    }

    // Crear usuario desde admin
    public function crearUsuarioAdmin(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'primer_nombre' => 'required|string|max:255',
                'apellido' => 'required|string|max:255',
                'cedula' => 'required|string|unique:usuarios,cedula',
                'telefono' => 'required|string|max:20',
                'email' => 'required|email|unique:usuarios,email',
                'password' => 'required|string|min:6',
                'id_rol' => 'required|integer|in:2,3',
            ], [
                'id_rol.in' => 'El rol debe ser 2 (Secretaria) o 3 (Deportista)',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Error en la validación',
                    'errors' => $validator->errors()
                ], 422);
            }

            // <CHANGE> Hashear la contraseña antes de guardar
            $usuario = Usuario::create([
                'primer_nombre' => $request->primer_nombre,
                'apellido' => $request->apellido,
                'cedula' => $request->cedula,
                'telefono' => $request->telefono,
                'email' => $request->email,
                'clave' => Hash::make($request->password), // Hashear contraseña
                'nombre_usuario' => $request->email,
                'id_rol' => $request->id_rol,
                'id_estado' => 1,
            ]);

            Log::info('Usuario creado por admin', ['usuario_id' => $usuario->id_usuario]);

            return response()->json([
                'success' => true,
                'message' => 'Usuario creado exitosamente',
                'data' => $usuario
            ], 201);

        } catch (\Exception $e) {
            Log::error('Error al crear usuario: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al crear usuario: ' . $e->getMessage()
            ], 500);
        }
    }

    // Eliminar usuario
    public function eliminarUsuario($id)
    {
        try {
            $usuario = Usuario::find($id);

            if (!$usuario) {
                return response()->json([
                    'success' => false,
                    'message' => 'Usuario no encontrado'
                ], 404);
            }

            $usuario->delete();

            Log::info('Usuario eliminado', ['usuario_id' => $id]);

            return response()->json([
                'success' => true,
                'message' => 'Usuario eliminado exitosamente'
            ], 200);

        } catch (\Exception $e) {
            Log::error('Error al eliminar usuario: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar usuario'
            ], 500);
        }
    }
}
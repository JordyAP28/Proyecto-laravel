<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Usuario;
use App\Models\Rol;
use App\Models\Estado;
use Illuminate\Support\Facades\Validator;

class UsuarioController extends Controller
{
    // Lista todos los usuarios con búsqueda y filtros
    public function index(Request $request)
    {
        $query = trim($request->get('searchText', ''));
        $id_rol = $request->get('id_rol');
        $id_estado = $request->get('id_estado');
        
        $usuarios = Usuario::with(['rol', 'estado'])
            ->when($query, function($q) use ($query) {
                $q->where('nombre_usuario', 'LIKE', '%' . $query . '%');
            })
            ->when($id_rol, function($q) use ($id_rol) {
                $q->where('id_rol', $id_rol);
            })
            ->when($id_estado, function($q) use ($id_estado) {
                $q->where('id_estado', $id_estado);
            })
            ->orderBy('id_usuario', 'desc')
            ->paginate(10);

        return response()->json([
            'success' => true,
            'data' => $usuarios
        ]);
    }

    // Obtiene datos para crear usuario
    public function create()
    {
        $roles = Rol::all();
        $estados = Estado::all();

        return response()->json([
            'success' => true,
            'data' => [
                'roles' => $roles,
                'estados' => $estados
            ]
        ]);
    }

    // Crea un nuevo usuario
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nombre_usuario' => 'required|string|max:255|unique:usuarios,nombre_usuario',
            'clave' => 'required|string|min:6',
            'id_rol' => 'required|exists:roles,id_rol',
            'id_estado' => 'nullable|exists:estados,id_estado',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $validator->errors()
            ], 422);
        }

        $usuario = Usuario::create([
            'nombre_usuario' => $request->nombre_usuario,
            'clave' => $request->clave, // Se encripta automáticamente en el mutator
            'id_rol' => $request->id_rol,
            'id_estado' => $request->id_estado ?? 1,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Usuario creado exitosamente',
            'data' => $usuario->load(['rol', 'estado'])
        ], 201);
    }

    // Muestra detalles de un usuario
    public function show($id)
    {
        $usuario = Usuario::with(['rol', 'estado', 'logs'])->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $usuario
        ]);
    }

    // Obtiene datos para editar usuario
    public function edit($id)
    {
        $usuario = Usuario::with(['rol', 'estado'])->findOrFail($id);
        $roles = Rol::all();
        $estados = Estado::all();

        return response()->json([
            'success' => true,
            'data' => [
                'usuario' => $usuario,
                'roles' => $roles,
                'estados' => $estados
            ]
        ]);
    }

    // Actualiza un usuario
    public function update(Request $request, $id)
    {
        $usuario = Usuario::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'nombre_usuario' => 'required|string|max:255|unique:usuarios,nombre_usuario,' . $id . ',id_usuario',
            'clave' => 'nullable|string|min:6',
            'id_rol' => 'required|exists:roles,id_rol',
            'id_estado' => 'required|exists:estados,id_estado',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $validator->errors()
            ], 422);
        }
        
        $data = [
            'nombre_usuario' => $request->nombre_usuario,
            'id_rol' => $request->id_rol,
            'id_estado' => $request->id_estado,
        ];

        // Solo actualizar contraseña si se proporciona
        if ($request->filled('clave')) {
            $data['clave'] = $request->clave; // Se encripta automáticamente
        }

        $usuario->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Usuario actualizado exitosamente',
            'data' => $usuario->load(['rol', 'estado'])
        ]);
    }

    // Desactiva un usuario (soft delete)
    public function destroy($id)
    {
        $usuario = Usuario::findOrFail($id);
        
        // Cambiar a estado inactivo (id_estado = 2)
        $usuario->update(['id_estado' => 2]);

        return response()->json([
            'success' => true,
            'message' => 'Usuario desactivado exitosamente',
            'data' => $usuario
        ]);
    }

    // Activar usuario
    public function activar($id)
    {
        $usuario = Usuario::findOrFail($id);
        $usuario->update(['id_estado' => 1]);

        return response()->json([
            'success' => true,
            'message' => 'Usuario activado exitosamente',
            'data' => $usuario->load(['rol', 'estado'])
        ]);
    }

    // Cambiar rol de un usuario
    public function cambiarRol(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'id_rol' => 'required|exists:roles,id_rol',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $validator->errors()
            ], 422);
        }

        $usuario = Usuario::findOrFail($id);
        $usuario->update(['id_rol' => $request->id_rol]);

        return response()->json([
            'success' => true,
            'message' => 'Rol actualizado exitosamente',
            'data' => $usuario->load(['rol', 'estado'])
        ]);
    }

    // Cambiar contraseña
    public function cambiarClave(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'clave_actual' => 'required|string',
            'clave_nueva' => 'required|string|min:6|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $validator->errors()
            ], 422);
        }

        $usuario = Usuario::findOrFail($id);

        // Verificar contraseña actual
        if (!password_verify($request->clave_actual, $usuario->clave)) {
            return response()->json([
                'success' => false,
                'message' => 'La contraseña actual es incorrecta'
            ], 400);
        }

        $usuario->update(['clave' => $request->clave_nueva]);

        return response()->json([
            'success' => true,
            'message' => 'Contraseña actualizada exitosamente'
        ]);
    }

    // Resetear contraseña (para administradores)
    public function resetearClave(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'clave_nueva' => 'required|string|min:6',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $validator->errors()
            ], 422);
        }

        $usuario = Usuario::findOrFail($id);
        $usuario->update(['clave' => $request->clave_nueva]);

        return response()->json([
            'success' => true,
            'message' => 'Contraseña reseteada exitosamente'
        ]);
    }
}
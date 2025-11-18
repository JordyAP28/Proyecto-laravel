<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Rol;
use Illuminate\Support\Facades\Validator;

class RolController extends Controller
{
    // Lista todos los roles disponibles
    public function index()
    {
        $roles = Rol::withCount('users')->get();

        return response()->json([
            'success' => true,
            'data' => $roles
        ]);
    }

    // Crear un nuevo rol
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'rol' => 'required|in:Administrador,Entrenador,Deportista,Secretaria|unique:roles,rol',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $validator->errors()
            ], 422);
        }

        $rol = Rol::create([
            'rol' => $request->rol
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Rol creado exitosamente',
            'data' => $rol
        ], 201);
    }

    // Muestra un rol específico
    public function show($id)
    {
        $rol = Rol::withCount('users')->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $rol
        ]);
    }

    // Actualizar un rol
    public function update(Request $request, $id)
    {
        $rol = Rol::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'rol' => 'required|in:Administrador,Entrenador,Deportista,Secretaria|unique:roles,rol,' . $id . ',id_rol',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $validator->errors()
            ], 422);
        }

        $rol->update([
            'rol' => $request->rol
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Rol actualizado exitosamente',
            'data' => $rol
        ]);
    }

    // Eliminar un rol
    public function destroy($id)
    {
        $rol = Rol::findOrFail($id);

        // Verificar si hay usuarios con este rol
        if ($rol->users()->count() > 0) {
            return response()->json([
                'success' => false,
                'message' => 'No se puede eliminar: existen usuarios asignados a este rol'
            ], 400);
        }

        $rol->delete();

        return response()->json([
            'success' => true,
            'message' => 'Rol eliminado exitosamente'
        ]);
    }

    // Obtener usuarios por rol
    public function usuarios($id)
    {
        $rol = Rol::with('users.estado')->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => [
                'rol' => $rol,
                'total_usuarios' => $rol->users->count(),
                'usuarios' => $rol->users
            ]
        ]);
    }
}
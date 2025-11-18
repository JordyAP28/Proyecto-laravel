<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Usuario;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UsuarioController extends Controller
{
    /**
     * Lista todos los usuarios
     */
    public function index(): JsonResponse
    {
        $usuarios = Usuario::with(['rol', 'estado'])
            ->orderBy('id_usuario', 'desc')
            ->paginate(10);

        return response()->json([
            'success' => true,
            'data' => $usuarios
        ]);
    }

    /**
     * Crear un nuevo usuario
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'nombre_usuario' => 'required|string|max:255|unique:usuarios,nombre_usuario',
            'clave' => 'required|string|min:6',
            'id_rol' => 'required|exists:roles,id_rol',
            'id_estado' => 'nullable|exists:estados,id_estado',
        ]);

        // Encriptar contraseña
        $validated['clave'] = Hash::make($validated['clave']);
        
        // Asignar estado activo por defecto
        $validated['id_estado'] = $validated['id_estado'] ?? 1;

        $usuario = Usuario::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Usuario creado exitosamente',
            'data' => $usuario->load(['rol', 'estado'])
        ], 201);
    }

    /**
     * Muestra un usuario específico
     */
    public function show(Usuario $usuario): JsonResponse
    {
        $usuario->load(['rol', 'estado']);

        return response()->json([
            'success' => true,
            'data' => $usuario
        ]);
    }

    /**
     * Actualizar un usuario
     */
    public function update(Request $request, Usuario $usuario): JsonResponse
    {
        $validated = $request->validate([
            'nombre_usuario' => 'required|string|max:255|unique:usuarios,nombre_usuario,' . $usuario->id_usuario . ',id_usuario',
            'clave' => 'nullable|string|min:6',
            'id_rol' => 'required|exists:roles,id_rol',
            'id_estado' => 'required|exists:estados,id_estado',
        ]);

        // Solo actualizar contraseña si se proporciona
        if ($request->filled('clave')) {
            $validated['clave'] = Hash::make($validated['clave']);
        } else {
            unset($validated['clave']);
        }

        $usuario->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Usuario actualizado exitosamente',
            'data' => $usuario->fresh(['rol', 'estado'])
        ]);
    }

    /**
     * Eliminar un usuario
     */
    public function destroy(Usuario $usuario): JsonResponse
    {
        $usuario->delete();

        return response()->json([
            'success' => true,
            'message' => 'Usuario eliminado exitosamente'
        ]);
    }
}
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Rol;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RolController extends Controller
{
    /**
     * Lista todos los roles
     */
    public function index(): JsonResponse
    {
        $roles = Rol::all();

        return response()->json([
            'success' => true,
            'data' => $roles
        ]);
    }

    /**
     * Crear un nuevo rol
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'rol' => 'required|string|in:Administrador,Entrenador,Deportista,Secretaria|unique:roles,rol',
        ]);

        $rol = Rol::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Rol creado exitosamente',
            'data' => $rol
        ], 201);
    }

    /**
     * Muestra un rol específico
     */
    public function show(Rol $rol): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $rol
        ]);
    }

    /**
     * Actualizar un rol
     */
    public function update(Request $request, Rol $rol): JsonResponse
    {
        $validated = $request->validate([
            'rol' => 'required|string|in:Administrador,Entrenador,Deportista,Secretaria|unique:roles,rol,' . $rol->id_rol . ',id_rol',
        ]);

        $rol->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Rol actualizado exitosamente',
            'data' => $rol->fresh()
        ]);
    }

    /**
     * Eliminar un rol
     */
    public function destroy(Rol $rol): JsonResponse
    {
        $rol->delete();

        return response()->json([
            'success' => true,
            'message' => 'Rol eliminado exitosamente'
        ]);
    }
}
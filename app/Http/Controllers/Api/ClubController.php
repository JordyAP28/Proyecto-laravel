<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Club;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ClubController extends Controller
{
    /**
     * Lista todos los clubes
     */
    public function index(): JsonResponse
    {
        $clubes = Club::with(['estado'])
            ->orderBy('nombre', 'asc')
            ->paginate(10);

        return response()->json([
            'success' => true,
            'data' => $clubes
        ]);
    }

    /**
     * Crear un nuevo club
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'representante' => 'required|string|max:255',
            'telefono' => 'required|string|max:20',
            'fecha_creacion' => 'required|date',
            'id_estado' => 'nullable|exists:estados,id_estado',
        ]);

        // Asignar estado activo por defecto si no se proporciona
        $validated['id_estado'] = $validated['id_estado'] ?? 1;

        $club = Club::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Club creado exitosamente',
            'data' => $club->load('estado')
        ], 201);
    }

    /**
     * Muestra un club específico
     */
    public function show(Club $club): JsonResponse
    {
        $club->load(['estado']);

        return response()->json([
            'success' => true,
            'data' => $club
        ]);
    }

    /**
     * Actualizar un club
     */
    public function update(Request $request, Club $club): JsonResponse
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'representante' => 'required|string|max:255',
            'telefono' => 'required|string|max:20',
            'fecha_creacion' => 'required|date',
            'id_estado' => 'required|exists:estados,id_estado',
        ]);

        $club->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Club actualizado exitosamente',
            'data' => $club->fresh(['estado'])
        ]);
    }

    /**
     * Eliminar un club
     */
    public function destroy(Club $club): JsonResponse
    {
        $club->delete();

        return response()->json([
            'success' => true,
            'message' => 'Club eliminado exitosamente'
        ]);
    }
}
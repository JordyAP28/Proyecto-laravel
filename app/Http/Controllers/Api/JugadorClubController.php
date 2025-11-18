<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\JugadorClub;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class JugadorClubController extends Controller
{
    /**
     * Lista todos los jugadores asignados a clubes
     */
    public function index(): JsonResponse
    {
        $jugadores = JugadorClub::with(['deportista', 'club'])
            ->orderBy('fecha_ingreso', 'desc')
            ->paginate(10);

        return response()->json([
            'success' => true,
            'data' => $jugadores
        ]);
    }

    /**
     * Asignar un deportista a un club
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'id_deportista' => 'required|exists:deportistas,id_deportista',
            'id_club' => 'required|exists:clubes,id_club',
            'fecha_ingreso' => 'required|date',
            'activo' => 'nullable|boolean',
        ]);

        // Asignar activo como true por defecto
        $validated['activo'] = $validated['activo'] ?? true;

        $jugador = JugadorClub::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Deportista asignado al club exitosamente',
            'data' => $jugador->load(['deportista', 'club'])
        ], 201);
    }

    /**
     * Muestra una asignación específica
     */
    public function show(JugadorClub $jugadorClub): JsonResponse
    {
        $jugadorClub->load(['deportista', 'club']);

        return response()->json([
            'success' => true,
            'data' => $jugadorClub
        ]);
    }

    /**
     * Actualizar una asignación
     */
    public function update(Request $request, JugadorClub $jugadorClub): JsonResponse
    {
        $validated = $request->validate([
            'id_deportista' => 'required|exists:deportistas,id_deportista',
            'id_club' => 'required|exists:clubes,id_club',
            'fecha_ingreso' => 'required|date',
            'activo' => 'required|boolean',
        ]);

        $jugadorClub->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Asignación actualizada exitosamente',
            'data' => $jugadorClub->fresh(['deportista', 'club'])
        ]);
    }

    /**
     * Eliminar una asignación
     */
    public function destroy(JugadorClub $jugadorClub): JsonResponse
    {
        $jugadorClub->delete();

        return response()->json([
            'success' => true,
            'message' => 'Asignación eliminada exitosamente'
        ]);
    }
}
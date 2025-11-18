<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ClubCampeonato;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ClubCampeonatoController extends Controller
{
    /**
     * Lista todas las inscripciones
     */
    public function index(): JsonResponse
    {
        $inscripciones = ClubCampeonato::with(['club', 'campeonato'])
            ->orderBy('id_club_campeonato', 'desc')
            ->paginate(15);

        return response()->json([
            'success' => true,
            'data' => $inscripciones
        ]);
    }

    /**
     * Inscribir club a campeonato
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'id_club' => 'required|exists:clubes,id_club',
            'id_campeonato' => 'required|exists:campeonatos,id_campeonato',
        ]);

        $inscripcion = ClubCampeonato::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Club inscrito al campeonato exitosamente',
            'data' => $inscripcion->load(['club', 'campeonato'])
        ], 201);
    }

    /**
     * Muestra una inscripción específica
     */
    public function show(ClubCampeonato $clubCampeonato): JsonResponse
    {
        $clubCampeonato->load(['club', 'campeonato']);

        return response()->json([
            'success' => true,
            'data' => $clubCampeonato
        ]);
    }

    /**
     * Actualizar una inscripción
     */
    public function update(Request $request, ClubCampeonato $clubCampeonato): JsonResponse
    {
        $validated = $request->validate([
            'id_club' => 'required|exists:clubes,id_club',
            'id_campeonato' => 'required|exists:campeonatos,id_campeonato',
        ]);

        $clubCampeonato->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Inscripción actualizada exitosamente',
            'data' => $clubCampeonato->fresh(['club', 'campeonato'])
        ]);
    }

    /**
     * Eliminar una inscripción
     */
    public function destroy(ClubCampeonato $clubCampeonato): JsonResponse
    {
        $clubCampeonato->delete();

        return response()->json([
            'success' => true,
            'message' => 'Club retirado del campeonato exitosamente'
        ]);
    }
}
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Campeonato;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CampeonatoController extends Controller
{
    /**
     * Lista todos los campeonatos
     */
    public function index(): JsonResponse
    {
        $campeonatos = Campeonato::orderBy('fecha_inicio', 'desc')
            ->paginate(10);

        return response()->json([
            'success' => true,
            'data' => $campeonatos
        ]);
    }

    /**
     * Crear un nuevo campeonato
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'categoria' => 'required|string|max:255',
            'fecha_inicio' => 'required|date',
            'fecha_fin' => 'required|date|after_or_equal:fecha_inicio',
        ]);

        $campeonato = Campeonato::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Campeonato creado exitosamente',
            'data' => $campeonato
        ], 201);
    }

    /**
     * Muestra un campeonato específico
     */
    public function show(Campeonato $campeonato): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $campeonato
        ]);
    }

    /**
     * Actualizar un campeonato
     */
    public function update(Request $request, Campeonato $campeonato): JsonResponse
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'categoria' => 'required|string|max:255',
            'fecha_inicio' => 'required|date',
            'fecha_fin' => 'required|date|after_or_equal:fecha_inicio',
        ]);

        $campeonato->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Campeonato actualizado exitosamente',
            'data' => $campeonato->fresh()
        ]);
    }

    /**
     * Eliminar un campeonato
     */
    public function destroy(Campeonato $campeonato): JsonResponse
    {
        $campeonato->delete();

        return response()->json([
            'success' => true,
            'message' => 'Campeonato eliminado exitosamente'
        ]);
    }
}
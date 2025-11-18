<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Escenario;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EscenarioController extends Controller
{
    /**
     * Lista todos los escenarios
     */
    public function index(): JsonResponse
    {
        $escenarios = Escenario::orderBy('nombre', 'asc')
            ->paginate(10);

        return response()->json([
            'success' => true,
            'data' => $escenarios
        ]);
    }

    /**
     * Crear un nuevo escenario
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'tipo' => 'required|string|max:255',
            'capacidad' => 'required|integer|min:1',
        ]);

        $escenario = Escenario::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Escenario creado exitosamente',
            'data' => $escenario
        ], 201);
    }

    /**
     * Muestra un escenario específico
     */
    public function show(Escenario $escenario): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $escenario
        ]);
    }

    /**
     * Actualizar un escenario
     */
    public function update(Request $request, Escenario $escenario): JsonResponse
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'tipo' => 'required|string|max:255',
            'capacidad' => 'required|integer|min:1',
        ]);

        $escenario->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Escenario actualizado exitosamente',
            'data' => $escenario->fresh()
        ]);
    }

    /**
     * Eliminar un escenario
     */
    public function destroy(Escenario $escenario): JsonResponse
    {
        $escenario->delete();

        return response()->json([
            'success' => true,
            'message' => 'Escenario eliminado exitosamente'
        ]);
    }
}
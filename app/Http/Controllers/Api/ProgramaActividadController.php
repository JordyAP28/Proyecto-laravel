<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ProgramaActividad;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProgramaActividadController extends Controller
{
    /**
     * Lista todas las programaciones
     */
    public function index(): JsonResponse
    {
        $programaciones = ProgramaActividad::with(['escenario', 'actividad'])
            ->orderBy('id_programa_actividad', 'desc')
            ->paginate(15);

        return response()->json([
            'success' => true,
            'data' => $programaciones
        ]);
    }

    /**
     * Asignar actividad a escenario
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'id_escenario' => 'required|exists:escenarios,id_escenario',
            'id_actividad' => 'required|exists:actividades,id_actividad',
        ]);

        $programacion = ProgramaActividad::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Actividad asignada al escenario exitosamente',
            'data' => $programacion->load(['escenario', 'actividad'])
        ], 201);
    }

    /**
     * Muestra una programación específica
     */
    public function show(ProgramaActividad $programaActividad): JsonResponse
    {
        $programaActividad->load(['escenario', 'actividad']);

        return response()->json([
            'success' => true,
            'data' => $programaActividad
        ]);
    }

    /**
     * Actualizar una programación
     */
    public function update(Request $request, ProgramaActividad $programaActividad): JsonResponse
    {
        $validated = $request->validate([
            'id_escenario' => 'required|exists:escenarios,id_escenario',
            'id_actividad' => 'required|exists:actividades,id_actividad',
        ]);

        $programaActividad->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Programación actualizada exitosamente',
            'data' => $programaActividad->fresh(['escenario', 'actividad'])
        ]);
    }

    /**
     * Eliminar una programación
     */
    public function destroy(ProgramaActividad $programaActividad): JsonResponse
    {
        $programaActividad->delete();

        return response()->json([
            'success' => true,
            'message' => 'Programación eliminada exitosamente'
        ]);
    }
}
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Actividad;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ActividadController extends Controller
{
    /**
     * Lista todas las actividades
     */
    public function index(): JsonResponse
    {
        $actividades = Actividad::orderBy('fecha', 'desc')
            ->orderBy('hora_inicio', 'asc')
            ->paginate(10);

        return response()->json([
            'success' => true,
            'data' => $actividades
        ]);
    }

    /**
     * Crear una nueva actividad
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'nombre_actividad' => 'required|string|max:255',
            'descripcion' => 'required|string',
            'fecha' => 'required|date',
            'hora_inicio' => 'required|date_format:H:i',
            'hora_fin' => 'required|date_format:H:i|after:hora_inicio',
        ]);

        $actividad = Actividad::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Actividad creada exitosamente',
            'data' => $actividad
        ], 201);
    }

    /**
     * Muestra una actividad específica
     */
    public function show(Actividad $actividad): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $actividad
        ]);
    }

    /**
     * Actualizar una actividad
     */
    public function update(Request $request, Actividad $actividad): JsonResponse
    {
        $validated = $request->validate([
            'nombre_actividad' => 'required|string|max:255',
            'descripcion' => 'required|string',
            'fecha' => 'required|date',
            'hora_inicio' => 'required|date_format:H:i',
            'hora_fin' => 'required|date_format:H:i|after:hora_inicio',
        ]);

        $actividad->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Actividad actualizada exitosamente',
            'data' => $actividad->fresh()
        ]);
    }

    /**
     * Eliminar una actividad
     */
    public function destroy(Actividad $actividad): JsonResponse
    {
        $actividad->delete();

        return response()->json([
            'success' => true,
            'message' => 'Actividad eliminada exitosamente'
        ]);
    }
}
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\InscripcionCurso;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class InscripcionCursoController extends Controller
{
    /**
     * Lista todas las inscripciones
     */
    public function index(): JsonResponse
    {
        $inscripciones = InscripcionCurso::with(['curso', 'deportista'])
            ->orderBy('fecha_inscripcion', 'desc')
            ->paginate(10);

        return response()->json([
            'success' => true,
            'data' => $inscripciones
        ]);
    }

    /**
     * Inscribir deportista a curso
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'id_curso' => 'required|exists:cursos,id_curso',
            'id_deportista' => 'required|exists:deportistas,id_deportista',
            'fecha_inscripcion' => 'nullable|date',
        ]);

        // Asignar fecha actual si no se proporciona
        $validated['fecha_inscripcion'] = $validated['fecha_inscripcion'] ?? now();

        $inscripcion = InscripcionCurso::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Inscripción realizada exitosamente',
            'data' => $inscripcion->load(['curso', 'deportista'])
        ], 201);
    }

    /**
     * Muestra una inscripción específica
     */
    public function show(InscripcionCurso $inscripcionCurso): JsonResponse
    {
        $inscripcionCurso->load(['curso', 'deportista']);

        return response()->json([
            'success' => true,
            'data' => $inscripcionCurso
        ]);
    }

    /**
     * Actualizar una inscripción
     */
    public function update(Request $request, InscripcionCurso $inscripcionCurso): JsonResponse
    {
        $validated = $request->validate([
            'id_curso' => 'required|exists:cursos,id_curso',
            'id_deportista' => 'required|exists:deportistas,id_deportista',
            'fecha_inscripcion' => 'required|date',
        ]);

        $inscripcionCurso->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Inscripción actualizada exitosamente',
            'data' => $inscripcionCurso->fresh(['curso', 'deportista'])
        ]);
    }

    /**
     * Eliminar una inscripción
     */
    public function destroy(InscripcionCurso $inscripcionCurso): JsonResponse
    {
        $inscripcionCurso->delete();

        return response()->json([
            'success' => true,
            'message' => 'Inscripción eliminada exitosamente'
        ]);
    }
}
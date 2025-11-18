<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Curso;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CursoController extends Controller
{
    /**
     * Lista todos los cursos
     */
    public function index(): JsonResponse
    {
        $cursos = Curso::with(['estado'])
            ->orderBy('fecha_inicio', 'desc')
            ->paginate(10);

        return response()->json([
            'success' => true,
            'data' => $cursos
        ]);
    }

    /**
     * Crear un nuevo curso
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'nombre_curso' => 'required|string|max:255',
            'tipo' => 'required|in:Vacacional,Permanente,Temporal',
            'descripcion' => 'required|string',
            'fecha_inicio' => 'required|date',
            'fecha_fin' => 'required|date|after_or_equal:fecha_inicio',
            'id_estado' => 'nullable|exists:estados,id_estado',
        ]);

        // Asignar estado activo por defecto si no se proporciona
        $validated['id_estado'] = $validated['id_estado'] ?? 1;

        $curso = Curso::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Curso creado exitosamente',
            'data' => $curso->load('estado')
        ], 201);
    }

    /**
     * Muestra un curso específico
     */
    public function show(Curso $curso): JsonResponse
    {
        $curso->load(['estado']);

        return response()->json([
            'success' => true,
            'data' => $curso
        ]);
    }

    /**
     * Actualizar un curso
     */
    public function update(Request $request, Curso $curso): JsonResponse
    {
        $validated = $request->validate([
            'nombre_curso' => 'required|string|max:255',
            'tipo' => 'required|in:Vacacional,Permanente,Temporal',
            'descripcion' => 'required|string',
            'fecha_inicio' => 'required|date',
            'fecha_fin' => 'required|date|after_or_equal:fecha_inicio',
            'id_estado' => 'required|exists:estados,id_estado',
        ]);

        $curso->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Curso actualizado exitosamente',
            'data' => $curso->fresh(['estado'])
        ]);
    }

    /**
     * Eliminar un curso
     */
    public function destroy(Curso $curso): JsonResponse
    {
        $curso->delete();

        return response()->json([
            'success' => true,
            'message' => 'Curso eliminado exitosamente'
        ]);
    }
}
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Estado;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EstadoController extends Controller
{
    /**
     * Lista todos los estados
     */
    public function index(): JsonResponse
    {
        $estados = Estado::all();

        return response()->json([
            'success' => true,
            'data' => $estados
        ]);
    }

    /**
     * Crear un nuevo estado
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'estado' => 'required|string|in:Activo,Inactivo,Suspendido,Anulado,Observacion|unique:estados,estado',
        ]);

        $estado = Estado::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Estado creado exitosamente',
            'data' => $estado
        ], 201);
    }

    /**
     * Muestra un estado específico
     */
    public function show(Estado $estado): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $estado
        ]);
    }

    /**
     * Actualizar un estado
     */
    public function update(Request $request, Estado $estado): JsonResponse
    {
        $validated = $request->validate([
            'estado' => 'required|string|in:Activo,Inactivo,Suspendido,Anulado,Observacion|unique:estados,estado,' . $estado->id_estado . ',id_estado',
        ]);

        $estado->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Estado actualizado exitosamente',
            'data' => $estado->fresh()
        ]);
    }

    /**
     * Eliminar un estado
     */
    public function destroy(Estado $estado): JsonResponse
    {
        $estado->delete();

        return response()->json([
            'success' => true,
            'message' => 'Estado eliminado exitosamente'
        ]);
    }
}
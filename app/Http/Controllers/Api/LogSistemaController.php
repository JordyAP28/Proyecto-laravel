<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LogSistema;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LogSistemaController extends Controller
{
    /**
     * Lista todos los logs
     */
    public function index(): JsonResponse
    {
        $logs = LogSistema::with(['usuario'])
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json([
            'success' => true,
            'data' => $logs
        ]);
    }

    /**
     * Crear un nuevo log
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'id_usuario' => 'required|exists:usuarios,id_usuario',
            'accion' => 'required|string|max:500',
        ]);

        $log = LogSistema::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Log registrado exitosamente',
            'data' => $log->load('usuario')
        ], 201);
    }

    /**
     * Muestra un log específico
     */
    public function show(LogSistema $logSistema): JsonResponse
    {
        $logSistema->load(['usuario']);

        return response()->json([
            'success' => true,
            'data' => $logSistema
        ]);
    }

    /**
     * Actualizar un log
     */
    public function update(Request $request, LogSistema $logSistema): JsonResponse
    {
        $validated = $request->validate([
            'id_usuario' => 'required|exists:usuarios,id_usuario',
            'accion' => 'required|string|max:500',
        ]);

        $logSistema->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Log actualizado exitosamente',
            'data' => $logSistema->fresh(['usuario'])
        ]);
    }

    /**
     * Eliminar un log
     */
    public function destroy(LogSistema $logSistema): JsonResponse
    {
        $logSistema->delete();

        return response()->json([
            'success' => true,
            'message' => 'Log eliminado exitosamente'
        ]);
    }
}
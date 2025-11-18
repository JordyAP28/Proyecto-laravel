<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Factura;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FacturaController extends Controller
{
    /**
     * Lista todas las facturas
     */
    public function index(): JsonResponse
    {
        $facturas = Factura::with(['deportista', 'detalles'])
            ->orderBy('fecha_emision', 'desc')
            ->paginate(15);

        return response()->json([
            'success' => true,
            'data' => $facturas
        ]);
    }

    /**
     * Crear una nueva factura
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'id_deportista' => 'required|exists:deportistas,id_deportista',
            'fecha_emision' => 'required|date',
            'total' => 'required|numeric|min:0',
            'estado' => 'required|in:Pagado,Pendiente,Cancelado',
        ]);

        $factura = Factura::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Factura creada exitosamente',
            'data' => $factura->load(['deportista', 'detalles'])
        ], 201);
    }

    /**
     * Muestra una factura específica
     */
    public function show(Factura $factura): JsonResponse
    {
        $factura->load(['deportista', 'detalles']);

        return response()->json([
            'success' => true,
            'data' => $factura
        ]);
    }

    /**
     * Actualizar una factura
     */
    public function update(Request $request, Factura $factura): JsonResponse
    {
        $validated = $request->validate([
            'id_deportista' => 'required|exists:deportistas,id_deportista',
            'fecha_emision' => 'required|date',
            'total' => 'required|numeric|min:0',
            'estado' => 'required|in:Pagado,Pendiente,Cancelado',
        ]);

        $factura->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Factura actualizada exitosamente',
            'data' => $factura->fresh(['deportista', 'detalles'])
        ]);
    }

    /**
     * Eliminar una factura
     */
    public function destroy(Factura $factura): JsonResponse
    {
        $factura->delete();

        return response()->json([
            'success' => true,
            'message' => 'Factura eliminada exitosamente'
        ]);
    }
}
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DetalleFactura;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DetalleFacturaController extends Controller
{
    /**
     * Lista todos los detalles
     */
    public function index(): JsonResponse
    {
        $detalles = DetalleFactura::with('factura')
            ->orderBy('id_detalle', 'desc')
            ->paginate(20);

        return response()->json([
            'success' => true,
            'data' => $detalles
        ]);
    }

    /**
     * Crear un nuevo detalle
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'id_factura' => 'required|exists:facturas,id_factura',
            'concepto' => 'required|string|max:255',
            'monto' => 'required|numeric|min:0',
        ]);

        $detalle = DetalleFactura::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Detalle agregado exitosamente',
            'data' => $detalle->load('factura')
        ], 201);
    }

    /**
     * Muestra un detalle específico
     */
    public function show(DetalleFactura $detalleFactura): JsonResponse
    {
        $detalleFactura->load('factura');

        return response()->json([
            'success' => true,
            'data' => $detalleFactura
        ]);
    }

    /**
     * Actualizar un detalle
     */
    public function update(Request $request, DetalleFactura $detalleFactura): JsonResponse
    {
        $validated = $request->validate([
            'concepto' => 'required|string|max:255',
            'monto' => 'required|numeric|min:0',
        ]);

        $detalleFactura->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Detalle actualizado exitosamente',
            'data' => $detalleFactura->fresh(['factura'])
        ]);
    }

    /**
     * Eliminar un detalle
     */
    public function destroy(DetalleFactura $detalleFactura): JsonResponse
    {
        $detalleFactura->delete();

        return response()->json([
            'success' => true,
            'message' => 'Detalle eliminado exitosamente'
        ]);
    }
}
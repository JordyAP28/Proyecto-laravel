<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\DetalleFactura;
use App\Models\Factura;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class DetalleFacturaController extends Controller
{
    // Lista todos los detalles
    public function index(Request $request)
    {
        $id_factura = $request->get('id_factura');

        $detalles = DetalleFactura::with('factura.deportista')
            ->when($id_factura, function($q) use ($id_factura) {
                $q->where('id_factura', $id_factura);
            })
            ->orderBy('id_detalle', 'desc')
            ->paginate(20);

        return response()->json([
            'success' => true,
            'data' => $detalles
        ]);
    }

    // Crear un detalle (y recalcular total de factura)
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id_factura' => 'required|exists:facturas,id_factura',
            'concepto' => 'required|string',
            'monto' => 'required|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $validator->errors()
            ], 422);
        }

        DB::beginTransaction();
        try {
            // Crear detalle
            $detalle = DetalleFactura::create([
                'id_factura' => $request->id_factura,
                'concepto' => $request->concepto,
                'monto' => $request->monto,
            ]);

            // Recalcular total de factura
            $factura = Factura::findOrFail($request->id_factura);
            $nuevoTotal = $factura->detalles()->sum('monto');
            $factura->update(['total' => $nuevoTotal]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Detalle agregado exitosamente',
                'data' => $detalle->load('factura')
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error al crear el detalle',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Muestra un detalle específico
    public function show($id)
    {
        $detalle = DetalleFactura::with('factura.deportista')
            ->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $detalle
        ]);
    }

    // Actualizar un detalle (y recalcular total de factura)
    public function update(Request $request, $id)
    {
        $detalle = DetalleFactura::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'concepto' => 'required|string',
            'monto' => 'required|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $validator->errors()
            ], 422);
        }

        DB::beginTransaction();
        try {
            // Actualizar detalle
            $detalle->update([
                'concepto' => $request->concepto,
                'monto' => $request->monto,
            ]);

            // Recalcular total de factura
            $factura = $detalle->factura;
            $nuevoTotal = $factura->detalles()->sum('monto');
            $factura->update(['total' => $nuevoTotal]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Detalle actualizado exitosamente',
                'data' => $detalle->load('factura')
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar el detalle',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Eliminar un detalle (y recalcular total de factura)
    public function destroy($id)
    {
        $detalle = DetalleFactura::findOrFail($id);
        $factura = $detalle->factura;

        DB::beginTransaction();
        try {
            $detalle->delete();

            // Recalcular total de factura
            $nuevoTotal = $factura->detalles()->sum('monto');
            $factura->update(['total' => $nuevoTotal]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Detalle eliminado exitosamente'
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar el detalle',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Detalles de una factura específica
    public function detallesPorFactura($id_factura)
    {
        $factura = Factura::with('deportista')->findOrFail($id_factura);
        
        $detalles = DetalleFactura::where('id_factura', $id_factura)
            ->orderBy('id_detalle')
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'factura' => $factura,
                'total_detalles' => $detalles->count(),
                'suma_detalles' => $detalles->sum('monto'),
                'detalles' => $detalles
            ]
        ]);
    }
}
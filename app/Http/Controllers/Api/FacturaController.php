<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Factura;
use App\Models\DetalleFactura;
use App\Models\Deportista;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class FacturaController extends Controller
{
    // Lista todas las facturas con búsqueda y filtros
    public function index(Request $request)
    {
        $id_deportista = $request->get('id_deportista');
        $estado = $request->get('estado');
        $fecha_desde = $request->get('fecha_desde');
        $fecha_hasta = $request->get('fecha_hasta');

        $facturas = Factura::with(['deportista', 'detalles'])
            ->when($id_deportista, function($q) use ($id_deportista) {
                $q->where('id_deportista', $id_deportista);
            })
            ->when($estado, function($q) use ($estado) {
                $q->where('estado', $estado);
            })
            ->when($fecha_desde, function($q) use ($fecha_desde) {
                $q->whereDate('fecha_emision', '>=', $fecha_desde);
            })
            ->when($fecha_hasta, function($q) use ($fecha_hasta) {
                $q->whereDate('fecha_emision', '<=', $fecha_hasta);
            })
            ->orderBy('fecha_emision', 'desc')
            ->paginate(15);

        return response()->json([
            'success' => true,
            'data' => $facturas
        ]);
    }

    // Obtiene datos para crear factura
    public function create()
    {
        $deportistas = Deportista::orderBy('apellido')
            ->orderBy('nombre')
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'deportistas' => $deportistas,
                'estados' => ['Pagado', 'Pendiente', 'Cancelado']
            ]
        ]);
    }

    // Crear una nueva factura con sus detalles
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id_deportista' => 'required|exists:deportistas,id_deportista',
            'fecha_emision' => 'required|date',
            'estado' => 'required|in:Pagado,Pendiente,Cancelado',
            'detalles' => 'required|array|min:1',
            'detalles.*.concepto' => 'required|string',
            'detalles.*.monto' => 'required|numeric|min:0',
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
            // Calcular total
            $total = collect($request->detalles)->sum('monto');

            // Crear factura
            $factura = Factura::create([
                'id_deportista' => $request->id_deportista,
                'fecha_emision' => $request->fecha_emision,
                'total' => $total,
                'estado' => $request->estado,
            ]);

            // Crear detalles
            foreach ($request->detalles as $detalle) {
                DetalleFactura::create([
                    'id_factura' => $factura->id_factura,
                    'concepto' => $detalle['concepto'],
                    'monto' => $detalle['monto'],
                ]);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Factura creada exitosamente',
                'data' => $factura->load(['deportista', 'detalles'])
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error al crear la factura',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Muestra detalles de una factura
    public function show($id)
    {
        $factura = Factura::with(['deportista', 'detalles'])
            ->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $factura
        ]);
    }

    // Actualizar una factura
    public function update(Request $request, $id)
    {
        $factura = Factura::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'id_deportista' => 'required|exists:deportistas,id_deportista',
            'fecha_emision' => 'required|date',
            'estado' => 'required|in:Pagado,Pendiente,Cancelado',
            'detalles' => 'required|array|min:1',
            'detalles.*.concepto' => 'required|string',
            'detalles.*.monto' => 'required|numeric|min:0',
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
            // Calcular nuevo total
            $total = collect($request->detalles)->sum('monto');

            // Actualizar factura
            $factura->update([
                'id_deportista' => $request->id_deportista,
                'fecha_emision' => $request->fecha_emision,
                'total' => $total,
                'estado' => $request->estado,
            ]);

            // Eliminar detalles anteriores
            $factura->detalles()->delete();

            // Crear nuevos detalles
            foreach ($request->detalles as $detalle) {
                DetalleFactura::create([
                    'id_factura' => $factura->id_factura,
                    'concepto' => $detalle['concepto'],
                    'monto' => $detalle['monto'],
                ]);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Factura actualizada exitosamente',
                'data' => $factura->load(['deportista', 'detalles'])
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar la factura',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Eliminar una factura
    public function destroy($id)
    {
        $factura = Factura::findOrFail($id);

        DB::beginTransaction();
        try {
            // Eliminar detalles primero
            $factura->detalles()->delete();
            
            // Eliminar factura
            $factura->delete();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Factura eliminada exitosamente'
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar la factura',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Cambiar estado de factura
    public function cambiarEstado(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'estado' => 'required|in:Pagado,Pendiente,Cancelado',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $validator->errors()
            ], 422);
        }

        $factura = Factura::findOrFail($id);
        $factura->update(['estado' => $request->estado]);

        return response()->json([
            'success' => true,
            'message' => 'Estado de factura actualizado',
            'data' => $factura->load(['deportista', 'detalles'])
        ]);
    }

    // Facturas de un deportista
    public function facturasPorDeportista($id_deportista)
    {
        $deportista = Deportista::findOrFail($id_deportista);
        
        $facturas = Factura::with('detalles')
            ->where('id_deportista', $id_deportista)
            ->orderBy('fecha_emision', 'desc')
            ->get();

        $totalPagado = $facturas->where('estado', 'Pagado')->sum('total');
        $totalPendiente = $facturas->where('estado', 'Pendiente')->sum('total');

        return response()->json([
            'success' => true,
            'data' => [
                'deportista' => $deportista,
                'total_facturas' => $facturas->count(),
                'total_pagado' => $totalPagado,
                'total_pendiente' => $totalPendiente,
                'facturas' => $facturas
            ]
        ]);
    }

    // Facturas pendientes
    public function pendientes()
    {
        $facturas = Factura::with(['deportista', 'detalles'])
            ->where('estado', 'Pendiente')
            ->orderBy('fecha_emision', 'desc')
            ->get();

        $totalPendiente = $facturas->sum('total');

        return response()->json([
            'success' => true,
            'data' => [
                'total_facturas' => $facturas->count(),
                'monto_total_pendiente' => $totalPendiente,
                'facturas' => $facturas
            ]
        ]);
    }

    // Facturas pagadas
    public function pagadas()
    {
        $facturas = Factura::with(['deportista', 'detalles'])
            ->where('estado', 'Pagado')
            ->orderBy('fecha_emision', 'desc')
            ->paginate(15);

        return response()->json([
            'success' => true,
            'data' => $facturas
        ]);
    }

    // Reporte de facturación
    public function reporte(Request $request)
    {
        $fecha_desde = $request->get('fecha_desde', now()->startOfMonth()->format('Y-m-d'));
        $fecha_hasta = $request->get('fecha_hasta', now()->endOfMonth()->format('Y-m-d'));

        $facturas = Factura::with(['deportista', 'detalles'])
            ->whereDate('fecha_emision', '>=', $fecha_desde)
            ->whereDate('fecha_emision', '<=', $fecha_hasta)
            ->get();

        $totalPagado = $facturas->where('estado', 'Pagado')->sum('total');
        $totalPendiente = $facturas->where('estado', 'Pendiente')->sum('total');
        $totalCancelado = $facturas->where('estado', 'Cancelado')->sum('total');
        $totalGeneral = $facturas->sum('total');

        $porEstado = $facturas->groupBy('estado')->map(function($grupo) {
            return [
                'cantidad' => $grupo->count(),
                'total' => $grupo->sum('total')
            ];
        });

        return response()->json([
            'success' => true,
            'data' => [
                'periodo' => [
                    'desde' => $fecha_desde,
                    'hasta' => $fecha_hasta
                ],
                'resumen' => [
                    'total_facturas' => $facturas->count(),
                    'total_general' => $totalGeneral,
                    'total_pagado' => $totalPagado,
                    'total_pendiente' => $totalPendiente,
                    'total_cancelado' => $totalCancelado,
                ],
                'por_estado' => $porEstado,
                'facturas' => $facturas
            ]
        ]);
    }

    // Marcar como pagada
    public function marcarPagada($id)
    {
        $factura = Factura::findOrFail($id);
        $factura->update(['estado' => 'Pagado']);

        return response()->json([
            'success' => true,
            'message' => 'Factura marcada como pagada',
            'data' => $factura->load(['deportista', 'detalles'])
        ]);
    }

    // Cancelar factura
    public function cancelar($id)
    {
        $factura = Factura::findOrFail($id);
        $factura->update(['estado' => 'Cancelado']);

        return response()->json([
            'success' => true,
            'message' => 'Factura cancelada',
            'data' => $factura->load(['deportista', 'detalles'])
        ]);
    }
}
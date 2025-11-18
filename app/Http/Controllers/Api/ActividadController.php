<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Actividad;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class ActividadController extends Controller
{
    // Lista todas las actividades con búsqueda y filtros
    public function index(Request $request)
    {
        $query = trim($request->get('searchText', ''));
        $fecha = $request->get('fecha');

        $actividades = Actividad::withCount('programaActividades')
            ->when($query, function($q) use ($query) {
                $q->where('nombre_actividad', 'LIKE', '%' . $query . '%')
                  ->orWhere('descripcion', 'LIKE', '%' . $query . '%');
            })
            ->when($fecha, function($q) use ($fecha) {
                $q->whereDate('fecha', $fecha);
            })
            ->orderBy('fecha', 'desc')
            ->orderBy('hora_inicio', 'asc')
            ->paginate(10);

        return response()->json([
            'success' => true,
            'data' => $actividades
        ]);
    }

    // Crear una nueva actividad
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nombre_actividad' => 'required|string|max:255',
            'descripcion' => 'required|string',
            'fecha' => 'required|date',
            'hora_inicio' => 'required|date_format:H:i',
            'hora_fin' => 'required|date_format:H:i|after:hora_inicio',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $validator->errors()
            ], 422);
        }

        $actividad = Actividad::create([
            'nombre_actividad' => $request->nombre_actividad,
            'descripcion' => $request->descripcion,
            'fecha' => $request->fecha,
            'hora_inicio' => $request->hora_inicio,
            'hora_fin' => $request->hora_fin,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Actividad creada exitosamente',
            'data' => $actividad
        ], 201);
    }

    // Muestra detalles de una actividad
    public function show($id)
    {
        $actividad = Actividad::with(['programaActividades.escenario'])
            ->withCount('programaActividades')
            ->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $actividad
        ]);
    }

    // Actualizar una actividad
    public function update(Request $request, $id)
    {
        $actividad = Actividad::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'nombre_actividad' => 'required|string|max:255',
            'descripcion' => 'required|string',
            'fecha' => 'required|date',
            'hora_inicio' => 'required|date_format:H:i',
            'hora_fin' => 'required|date_format:H:i|after:hora_inicio',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $validator->errors()
            ], 422);
        }

        $actividad->update([
            'nombre_actividad' => $request->nombre_actividad,
            'descripcion' => $request->descripcion,
            'fecha' => $request->fecha,
            'hora_inicio' => $request->hora_inicio,
            'hora_fin' => $request->hora_fin,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Actividad actualizada exitosamente',
            'data' => $actividad
        ]);
    }

    // Eliminar una actividad
    public function destroy($id)
    {
        $actividad = Actividad::findOrFail($id);

        // Verificar si está asignada a escenarios
        if ($actividad->programaActividades()->count() > 0) {
            return response()->json([
                'success' => false,
                'message' => 'No se puede eliminar: la actividad está asignada a escenarios'
            ], 400);
        }

        $actividad->delete();

        return response()->json([
            'success' => true,
            'message' => 'Actividad eliminada exitosamente'
        ]);
    }

    // Actividades de hoy
    public function hoy()
    {
        $actividades = Actividad::with(['programaActividades.escenario'])
            ->whereDate('fecha', Carbon::today())
            ->orderBy('hora_inicio')
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'fecha' => Carbon::today()->format('Y-m-d'),
                'total_actividades' => $actividades->count(),
                'actividades' => $actividades
            ]
        ]);
    }

    // Actividades por rango de fechas
    public function porFecha(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'fecha_desde' => 'required|date',
            'fecha_hasta' => 'required|date|after_or_equal:fecha_desde',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $validator->errors()
            ], 422);
        }

        $actividades = Actividad::with(['programaActividades.escenario'])
            ->whereDate('fecha', '>=', $request->fecha_desde)
            ->whereDate('fecha', '<=', $request->fecha_hasta)
            ->orderBy('fecha')
            ->orderBy('hora_inicio')
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'fecha_desde' => $request->fecha_desde,
                'fecha_hasta' => $request->fecha_hasta,
                'total_actividades' => $actividades->count(),
                'actividades' => $actividades
            ]
        ]);
    }

    // Actividades próximas
    public function proximas()
    {
        $actividades = Actividad::with(['programaActividades.escenario'])
            ->where('fecha', '>=', Carbon::today())
            ->orderBy('fecha')
            ->orderBy('hora_inicio')
            ->limit(20)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $actividades
        ]);
    }

    // Escenarios asignados a una actividad
    public function escenarios($id)
    {
        $actividad = Actividad::with(['programaActividades.escenario'])
            ->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => [
                'actividad' => $actividad->only(['id_actividad', 'nombre_actividad', 'fecha', 'hora_inicio', 'hora_fin']),
                'total_escenarios' => $actividad->programaActividades->count(),
                'escenarios_asignados' => $actividad->programaActividades
            ]
        ]);
    }
}
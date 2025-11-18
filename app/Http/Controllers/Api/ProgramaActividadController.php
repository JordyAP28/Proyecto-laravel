<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\ProgramaActividad;
use App\Models\Escenario;
use App\Models\Actividad;
use Illuminate\Support\Facades\Validator;

class ProgramaActividadController extends Controller
{
    // Lista todas las programaciones
    public function index(Request $request)
    {
        $id_escenario = $request->get('id_escenario');
        $id_actividad = $request->get('id_actividad');

        $programaciones = ProgramaActividad::with(['escenario', 'actividad'])
            ->when($id_escenario, function($q) use ($id_escenario) {
                $q->where('id_escenario', $id_escenario);
            })
            ->when($id_actividad, function($q) use ($id_actividad) {
                $q->where('id_actividad', $id_actividad);
            })
            ->orderBy('id_programa_actividad', 'desc')
            ->paginate(15);

        return response()->json([
            'success' => true,
            'data' => $programaciones
        ]);
    }

    // Obtiene datos para crear programación
    public function create()
    {
        $escenarios = Escenario::orderBy('nombre')->get();
        $actividades = Actividad::where('fecha', '>=', now()->format('Y-m-d'))
            ->orderBy('fecha')
            ->orderBy('hora_inicio')
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'escenarios' => $escenarios,
                'actividades' => $actividades
            ]
        ]);
    }

    // Asignar actividad a escenario
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id_escenario' => 'required|exists:escenarios,id_escenario',
            'id_actividad' => 'required|exists:actividades,id_actividad',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $validator->errors()
            ], 422);
        }

        // Verificar si ya existe la asignación
        $existe = ProgramaActividad::where('id_escenario', $request->id_escenario)
            ->where('id_actividad', $request->id_actividad)
            ->exists();

        if ($existe) {
            return response()->json([
                'success' => false,
                'message' => 'Esta actividad ya está asignada a este escenario'
            ], 400);
        }

        // Verificar conflicto de horarios en el escenario
        $actividad = Actividad::findOrFail($request->id_actividad);
        
        $conflicto = ProgramaActividad::where('id_escenario', $request->id_escenario)
            ->whereHas('actividad', function($q) use ($actividad) {
                $q->where('fecha', $actividad->fecha)
                  ->where(function($query) use ($actividad) {
                      $query->whereBetween('hora_inicio', [$actividad->hora_inicio, $actividad->hora_fin])
                            ->orWhereBetween('hora_fin', [$actividad->hora_inicio, $actividad->hora_fin])
                            ->orWhere(function($q) use ($actividad) {
                                $q->where('hora_inicio', '<=', $actividad->hora_inicio)
                                  ->where('hora_fin', '>=', $actividad->hora_fin);
                            });
                  });
            })
            ->exists();

        if ($conflicto) {
            return response()->json([
                'success' => false,
                'message' => 'Conflicto de horario: el escenario ya tiene una actividad programada en ese horario'
            ], 400);
        }

        $programacion = ProgramaActividad::create([
            'id_escenario' => $request->id_escenario,
            'id_actividad' => $request->id_actividad,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Actividad asignada al escenario exitosamente',
            'data' => $programacion->load(['escenario', 'actividad'])
        ], 201);
    }

    // Muestra detalles de una programación
    public function show($id)
    {
        $programacion = ProgramaActividad::with(['escenario', 'actividad'])
            ->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $programacion
        ]);
    }

    // Eliminar una programación
    public function destroy($id)
    {
        $programacion = ProgramaActividad::findOrFail($id);
        $programacion->delete();

        return response()->json([
            'success' => true,
            'message' => 'Programación eliminada exitosamente'
        ]);
    }

    // Calendario de actividades por escenario
    public function calendarioEscenario($id_escenario, Request $request)
    {
        $escenario = Escenario::findOrFail($id_escenario);
        
        $fecha = $request->get('fecha', now()->format('Y-m-d'));

        $programaciones = ProgramaActividad::with('actividad')
            ->where('id_escenario', $id_escenario)
            ->whereHas('actividad', function($q) use ($fecha) {
                $q->whereDate('fecha', $fecha);
            })
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'escenario' => $escenario,
                'fecha' => $fecha,
                'total_actividades' => $programaciones->count(),
                'actividades' => $programaciones
            ]
        ]);
    }

    // Programación general del día
    public function programacionDia(Request $request)
    {
        $fecha = $request->get('fecha', now()->format('Y-m-d'));

        $programaciones = ProgramaActividad::with(['escenario', 'actividad'])
            ->whereHas('actividad', function($q) use ($fecha) {
                $q->whereDate('fecha', $fecha);
            })
            ->get()
            ->groupBy('id_escenario');

        return response()->json([
            'success' => true,
            'data' => [
                'fecha' => $fecha,
                'programacion' => $programaciones
            ]
        ]);
    }
}
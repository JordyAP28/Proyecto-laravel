<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Escenario;
use Illuminate\Support\Facades\Validator;

class EscenarioController extends Controller
{
    // Lista todos los escenarios con búsqueda y filtros
    public function index(Request $request)
    {
        $query = trim($request->get('searchText', ''));
        $tipo = $request->get('tipo');

        $escenarios = Escenario::withCount('programaActividades')
            ->when($query, function($q) use ($query) {
                $q->where('nombre', 'LIKE', '%' . $query . '%')
                  ->orWhere('tipo', 'LIKE', '%' . $query . '%');
            })
            ->when($tipo, function($q) use ($tipo) {
                $q->where('tipo', $tipo);
            })
            ->orderBy('nombre', 'asc')
            ->paginate(10);

        return response()->json([
            'success' => true,
            'data' => $escenarios
        ]);
    }

    // Crear un nuevo escenario
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nombre' => 'required|string|max:255',
            'tipo' => 'required|string|max:255',
            'capacidad' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $validator->errors()
            ], 422);
        }

        $escenario = Escenario::create([
            'nombre' => $request->nombre,
            'tipo' => $request->tipo,
            'capacidad' => $request->capacidad,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Escenario creado exitosamente',
            'data' => $escenario
        ], 201);
    }

    // Muestra detalles de un escenario
    public function show($id)
    {
        $escenario = Escenario::with(['programaActividades.actividad'])
            ->withCount('programaActividades')
            ->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $escenario
        ]);
    }

    // Actualizar un escenario
    public function update(Request $request, $id)
    {
        $escenario = Escenario::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'nombre' => 'required|string|max:255',
            'tipo' => 'required|string|max:255',
            'capacidad' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $validator->errors()
            ], 422);
        }

        $escenario->update([
            'nombre' => $request->nombre,
            'tipo' => $request->tipo,
            'capacidad' => $request->capacidad,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Escenario actualizado exitosamente',
            'data' => $escenario
        ]);
    }

    // Eliminar un escenario
    public function destroy($id)
    {
        $escenario = Escenario::findOrFail($id);

        // Verificar si tiene actividades programadas
        if ($escenario->programaActividades()->count() > 0) {
            return response()->json([
                'success' => false,
                'message' => 'No se puede eliminar: existen actividades programadas en este escenario'
            ], 400);
        }

        $escenario->delete();

        return response()->json([
            'success' => true,
            'message' => 'Escenario eliminado exitosamente'
        ]);
    }

    // Actividades programadas en un escenario
    public function actividades($id)
    {
        $escenario = Escenario::with(['programaActividades.actividad'])
            ->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => [
                'escenario' => $escenario->only(['id_escenario', 'nombre', 'tipo', 'capacidad']),
                'total_actividades' => $escenario->programaActividades->count(),
                'actividades_programadas' => $escenario->programaActividades
            ]
        ]);
    }

    // Escenarios disponibles (sin actividades en una fecha/hora específica)
    public function disponibles(Request $request)
    {
        $validator = Validator::make($request->all(), [
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

        // Escenarios con actividades en la fecha solicitada
        $escenariosOcupados = Escenario::whereHas('programaActividades.actividad', function($q) use ($request) {
            $q->where('fecha', $request->fecha)
              ->where(function($query) use ($request) {
                  $query->whereBetween('hora_inicio', [$request->hora_inicio, $request->hora_fin])
                        ->orWhereBetween('hora_fin', [$request->hora_inicio, $request->hora_fin])
                        ->orWhere(function($q) use ($request) {
                            $q->where('hora_inicio', '<=', $request->hora_inicio)
                              ->where('hora_fin', '>=', $request->hora_fin);
                        });
              });
        })->pluck('id_escenario');

        // Escenarios disponibles
        $escenariosDisponibles = Escenario::whereNotIn('id_escenario', $escenariosOcupados)
            ->orderBy('nombre')
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'fecha' => $request->fecha,
                'hora_inicio' => $request->hora_inicio,
                'hora_fin' => $request->hora_fin,
                'total_disponibles' => $escenariosDisponibles->count(),
                'escenarios' => $escenariosDisponibles
            ]
        ]);
    }

    // Escenarios por tipo
    public function porTipo($tipo)
    {
        $escenarios = Escenario::withCount('programaActividades')
            ->where('tipo', $tipo)
            ->orderBy('nombre')
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'tipo' => $tipo,
                'total_escenarios' => $escenarios->count(),
                'escenarios' => $escenarios
            ]
        ]);
    }
}

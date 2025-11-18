<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Campeonato;
use Illuminate\Support\Facades\Validator;

class CampeonatoController extends Controller
{
    // Lista todos los campeonatos con búsqueda y filtros
    public function index(Request $request)
    {
        $query = trim($request->get('searchText', ''));
        $categoria = $request->get('categoria');

        $campeonatos = Campeonato::withCount('clubCampeonatos')
            ->when($query, function($q) use ($query) {
                $q->where('nombre', 'LIKE', '%' . $query . '%')
                  ->orWhere('categoria', 'LIKE', '%' . $query . '%');
            })
            ->when($categoria, function($q) use ($categoria) {
                $q->where('categoria', $categoria);
            })
            ->orderBy('fecha_inicio', 'desc')
            ->paginate(10);

        return response()->json([
            'success' => true,
            'data' => $campeonatos
        ]);
    }

    // Crear un nuevo campeonato
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nombre' => 'required|string|max:255',
            'categoria' => 'required|string|max:255',
            'fecha_inicio' => 'required|date',
            'fecha_fin' => 'required|date|after_or_equal:fecha_inicio',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $validator->errors()
            ], 422);
        }

        $campeonato = Campeonato::create([
            'nombre' => $request->nombre,
            'categoria' => $request->categoria,
            'fecha_inicio' => $request->fecha_inicio,
            'fecha_fin' => $request->fecha_fin,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Campeonato creado exitosamente',
            'data' => $campeonato
        ], 201);
    }

    // Muestra detalles de un campeonato
    public function show($id)
    {
        $campeonato = Campeonato::with(['clubCampeonatos.club.estado'])
            ->withCount('clubCampeonatos')
            ->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $campeonato
        ]);
    }

    // Actualizar un campeonato
    public function update(Request $request, $id)
    {
        $campeonato = Campeonato::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'nombre' => 'required|string|max:255',
            'categoria' => 'required|string|max:255',
            'fecha_inicio' => 'required|date',
            'fecha_fin' => 'required|date|after_or_equal:fecha_inicio',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $validator->errors()
            ], 422);
        }

        $campeonato->update([
            'nombre' => $request->nombre,
            'categoria' => $request->categoria,
            'fecha_inicio' => $request->fecha_inicio,
            'fecha_fin' => $request->fecha_fin,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Campeonato actualizado exitosamente',
            'data' => $campeonato
        ]);
    }

    // Eliminar un campeonato
    public function destroy($id)
    {
        $campeonato = Campeonato::findOrFail($id);

        // Verificar si tiene clubes inscritos
        if ($campeonato->clubCampeonatos()->count() > 0) {
            return response()->json([
                'success' => false,
                'message' => 'No se puede eliminar: existen clubes inscritos en este campeonato'
            ], 400);
        }

        $campeonato->delete();

        return response()->json([
            'success' => true,
            'message' => 'Campeonato eliminado exitosamente'
        ]);
    }

    // Clubes participantes en un campeonato
    public function clubes($id)
    {
        $campeonato = Campeonato::with(['clubCampeonatos.club.estado'])
            ->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => [
                'campeonato' => $campeonato->only(['id_campeonato', 'nombre', 'categoria', 'fecha_inicio', 'fecha_fin']),
                'total_clubes' => $campeonato->clubCampeonatos->count(),
                'clubes' => $campeonato->clubCampeonatos
            ]
        ]);
    }

    // Campeonatos activos (en curso)
    public function activos()
    {
        $hoy = now()->format('Y-m-d');

        $campeonatos = Campeonato::withCount('clubCampeonatos')
            ->where('fecha_inicio', '<=', $hoy)
            ->where('fecha_fin', '>=', $hoy)
            ->orderBy('fecha_inicio', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $campeonatos
        ]);
    }

    // Campeonatos próximos
    public function proximos()
    {
        $hoy = now()->format('Y-m-d');

        $campeonatos = Campeonato::withCount('clubCampeonatos')
            ->where('fecha_inicio', '>', $hoy)
            ->orderBy('fecha_inicio', 'asc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $campeonatos
        ]);
    }

    // Campeonatos finalizados
    public function finalizados()
    {
        $hoy = now()->format('Y-m-d');

        $campeonatos = Campeonato::withCount('clubCampeonatos')
            ->where('fecha_fin', '<', $hoy)
            ->orderBy('fecha_fin', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $campeonatos
        ]);
    }

    // Campeonatos por categoría
    public function porCategoria($categoria)
    {
        $campeonatos = Campeonato::withCount('clubCampeonatos')
            ->where('categoria', $categoria)
            ->orderBy('fecha_inicio', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'categoria' => $categoria,
                'total_campeonatos' => $campeonatos->count(),
                'campeonatos' => $campeonatos
            ]
        ]);
    }

    // Estadísticas de campeonatos
    public function estadisticas()
    {
        $hoy = now()->format('Y-m-d');

        $total = Campeonato::count();
        $activos = Campeonato::where('fecha_inicio', '<=', $hoy)
            ->where('fecha_fin', '>=', $hoy)
            ->count();
        $proximos = Campeonato::where('fecha_inicio', '>', $hoy)->count();
        $finalizados = Campeonato::where('fecha_fin', '<', $hoy)->count();

        $porCategoria = Campeonato::selectRaw('categoria, count(*) as total')
            ->groupBy('categoria')
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'total_campeonatos' => $total,
                'activos' => $activos,
                'proximos' => $proximos,
                'finalizados' => $finalizados,
                'por_categoria' => $porCategoria
            ]
        ]);
    }
}
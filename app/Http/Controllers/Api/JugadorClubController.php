<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\JugadorClub;
use App\Models\Deportista;
use App\Models\Club;
use App\Http\Requests\JugadorClubFormRequest;

class JugadorClubController extends Controller
{
    // Lista todos los jugadores asignados a clubes
    public function index(Request $request)
    {
        $query = trim($request->get('searchText', ''));

        $jugadores = JugadorClub::with(['deportista', 'club'])
            ->whereHas('deportista', function($q) use ($query) {
                $q->where('nombre', 'LIKE', '%' . $query . '%')
                  ->orWhere('apellido', 'LIKE', '%' . $query . '%')
                  ->orWhere('cedula', 'LIKE', '%' . $query . '%');
            })
            ->orWhereHas('club', function($q) use ($query) {
                $q->where('nombre', 'LIKE', '%' . $query . '%');
            })
            ->orderBy('fecha_ingreso', 'desc')
            ->paginate(10);

        return response()->json([
            'success' => true,
            'data' => $jugadores
        ]);
    }

    // Muestra formulario para asignar un deportista a un club
    public function create()
    {
        // Solo deportistas que NO tienen club activo
        $deportistas = Deportista::whereDoesntHave('jugadorClubs', function($q) {
            $q->where('activo', true);
        })->orderBy('nombre')->get();

        // Solo clubes activos
        $clubes = Club::where('id_estado', 1)
            ->orderBy('nombre')
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'deportistas' => $deportistas,
                'clubes' => $clubes
            ]
        ]);
    }

    // Asigna un deportista a un club
    public function store(JugadorClubFormRequest $request)
    {
        $jugador = JugadorClub::create([
            'id_deportista' => $request->id_deportista,
            'id_club' => $request->id_club,
            'fecha_ingreso' => $request->fecha_ingreso,
            'activo' => true,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Deportista asignado al club exitosamente',
            'data' => $jugador->load(['deportista', 'club'])
        ], 201);
    }

    // Muestra detalles de la asignación
    public function show($id)
    {
        $jugador = JugadorClub::with(['deportista', 'club.estado'])->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $jugador
        ]);
    }

    // Muestra formulario para cambiar de club
    public function edit($id)
    {
        $jugador = JugadorClub::with(['deportista', 'club'])->findOrFail($id);
        
        // Solo clubes activos diferentes al actual
        $clubes = Club::where('id_estado', 1)
            ->where('id_club', '!=', $jugador->id_club)
            ->orderBy('nombre')
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'jugador' => $jugador,
                'clubes' => $clubes
            ]
        ]);
    }

    // Cambia el club del deportista
    public function update(JugadorClubFormRequest $request, $id)
    {
        $jugador = JugadorClub::findOrFail($id);

        $jugador->update([
            'id_club' => $request->id_club,
            'fecha_ingreso' => $request->fecha_ingreso,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Club actualizado exitosamente',
            'data' => $jugador->load(['deportista', 'club'])
        ]);
    }

    // Desactiva la asignación (el deportista deja el club)
    public function destroy($id)
    {
        $jugador = JugadorClub::findOrFail($id);

        $jugador->update(['activo' => false]);

        return response()->json([
            'success' => true,
            'message' => 'Deportista retirado del club exitosamente',
            'data' => $jugador
        ]);
    }

    // Historial de clubes de un deportista específico
    public function historial($id_deportista)
    {
        $deportista = Deportista::findOrFail($id_deportista);
        
        $historial = JugadorClub::with(['club'])
            ->where('id_deportista', $id_deportista)
            ->orderBy('fecha_ingreso', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'deportista' => $deportista,
                'historial' => $historial
            ]
        ]);
    }

    // Lista de jugadores de un club específico
    public function jugadoresPorClub($id_club)
    {
        $club = Club::findOrFail($id_club);
        
        $jugadores = JugadorClub::with(['deportista'])
            ->where('id_club', $id_club)
            ->where('activo', true)
            ->orderBy('fecha_ingreso', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'club' => $club,
                'jugadores' => $jugadores
            ]
        ]);
    }
}
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use App\Models\JugadorClub;
use App\Models\Deportista;
use App\Models\Club;
use App\Http\Requests\JugadorClubFormRequest;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class JugadorClubController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return ['auth'];
    }

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

        return view('jugador-club.index', [
            'jugadores' => $jugadores,
            'searchText' => $query
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

        return view('jugador-club.create', [
            'deportistas' => $deportistas,
            'clubes' => $clubes
        ]);
    }

    // Asigna un deportista a un club
    public function store(JugadorClubFormRequest $request)
    {
        JugadorClub::create([
            'id_deportista' => $request->id_deportista,
            'id_club' => $request->id_club,
            'fecha_ingreso' => $request->fecha_ingreso,
            'activo' => true,
        ]);

        return Redirect::to('jugador-club')
            ->with('success', 'Deportista asignado al club exitosamente');
    }

    // Muestra detalles de la asignación
    public function show($id)
    {
        $jugador = JugadorClub::with(['deportista', 'club.estado'])->findOrFail($id);

        return view('jugador-club.show', ['jugador' => $jugador]);
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

        return view('jugador-club.edit', [
            'jugador' => $jugador,
            'clubes' => $clubes
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

        return Redirect::to('jugador-club')
            ->with('success', 'Club actualizado exitosamente');
    }

    // Desactiva la asignación (el deportista deja el club)
    public function destroy($id)
    {
        $jugador = JugadorClub::findOrFail($id);

        $jugador->update(['activo' => false]);

        return Redirect::to('jugador-club')
            ->with('success', 'Deportista retirado del club exitosamente');
    }

    // Historial de clubes de un deportista específico
    public function historial($id_deportista)
    {
        $deportista = Deportista::findOrFail($id_deportista);
        
        $historial = JugadorClub::with(['club'])
            ->where('id_deportista', $id_deportista)
            ->orderBy('fecha_ingreso', 'desc')
            ->get();

        return view('jugador-club.historial', [
            'deportista' => $deportista,
            'historial' => $historial
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

        return view('jugador-club.por-club', [
            'club' => $club,
            'jugadores' => $jugadores
        ]);
    }
}
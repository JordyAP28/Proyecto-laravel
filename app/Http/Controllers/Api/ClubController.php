<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use App\Http\Requests\ClubFormRequest;
use App\Models\Club;
use App\Models\Estado;

class ClubController extends Controller
{

    // Lista todos los clubes con búsqueda
    public function index(Request $request)
    {
        $query = trim($request->get('searchText', ''));

        $clubes = Club::with(['estado'])
            ->where(function($q) use ($query) {
                $q->where('nombre', 'LIKE', '%' . $query . '%')
                  ->orWhere('representante', 'LIKE', '%' . $query . '%')
                  ->orWhere('telefono', 'LIKE', '%' . $query . '%');
            })
            ->orderBy('nombre', 'asc')
            ->paginate(10);

        return view('clubes.index', [
            'clubes' => $clubes,
            'searchText' => $query
        ]);
    }

    // Muestra el formulario para crear un club
    public function create()
    {
        $estados = Estado::all();

        return view('clubes.create', ['estados' => $estados]);
    }

    // Guarda un nuevo club
    public function store(ClubFormRequest $request)
    {
        Club::create([
            'nombre' => $request->nombre,
            'representante' => $request->representante,
            'telefono' => $request->telefono,
            'fecha_creacion' => $request->fecha_creacion,
            'id_estado' => $request->id_estado ?? 1, // Activo por defecto
        ]);

        return Redirect::to('clubes')
            ->with('success', 'Club creado exitosamente');
    }

    // Muestra los detalles de un club
    public function show($id)
    {
        $club = Club::with(['estado', 'jugadorClubs.deportista', 'clubCampeonatos.campeonato'])
            ->findOrFail($id);

        // Obtener solo jugadores activos
        $jugadoresActivos = $club->jugadorClubs()->where('activo', true)->count();

        return view('clubes.show', [
            'club' => $club,
            'jugadoresActivos' => $jugadoresActivos
        ]);
    }

    // Muestra el formulario para editar un club
    public function edit($id)
    {
        $club = Club::with(['estado'])->findOrFail($id);
        $estados = Estado::all();

        return view('clubes.edit', [
            'club' => $club,
            'estados' => $estados
        ]);
    }

    // Actualiza un club
    public function update(ClubFormRequest $request, $id)
    {
        $club = Club::findOrFail($id);

        $club->update([
            'nombre' => $request->nombre,
            'representante' => $request->representante,
            'telefono' => $request->telefono,
            'fecha_creacion' => $request->fecha_creacion,
            'id_estado' => $request->id_estado,
        ]);

        return Redirect::to('clubes')
            ->with('success', 'Club actualizado exitosamente');
    }

    // Desactiva un club (cambia estado a inactivo)
    public function destroy($id)
    {
        $club = Club::findOrFail($id);

        // Cambiar a estado inactivo (id_estado = 2)
        $club->update(['id_estado' => 2]);

        return Redirect::to('clubes')
            ->with('success', 'Club desactivado exitosamente');
    }

    // Método adicional: Activar club
    public function activar($id)
    {
        $club = Club::findOrFail($id);

        $club->update(['id_estado' => 1]);

        return Redirect::to('clubes')
            ->with('success', 'Club activado exitosamente');
    }

    // Método adicional: Ver jugadores del club
    public function jugadores($id)
    {
        $club = Club::with(['jugadorClubs.deportista'])
            ->findOrFail($id);

        $jugadoresActivos = $club->jugadorClubs()
            ->where('activo', true)
            ->with('deportista')
            ->orderBy('fecha_ingreso', 'desc')
            ->get();

        return view('clubes.jugadores', [
            'club' => $club,
            'jugadores' => $jugadoresActivos
        ]);
    }
}
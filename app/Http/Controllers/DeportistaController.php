<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use App\Http\Requests\DeportistaFormRequest;
use App\Models\Deportista;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class DeportistaController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return ['auth'];
    }

    // Lista todos los deportistas con búsqueda
    public function index(Request $request)
    {
        $query = trim($request->get('searchText', ''));

        $deportistas = Deportista::where(function($q) use ($query) {
                $q->where('nombre', 'LIKE', '%' . $query . '%')
                  ->orWhere('apellido', 'LIKE', '%' . $query . '%')
                  ->orWhere('cedula', 'LIKE', '%' . $query . '%')
                  ->orWhere('correo', 'LIKE', '%' . $query . '%');
            })
            ->orderBy('apellido', 'asc')
            ->orderBy('nombre', 'asc')
            ->paginate(10);

        return view('deportistas.index', [
            'deportistas' => $deportistas,
            'searchText' => $query
        ]);
    }

    // Muestra el formulario para crear un deportista
    public function create()
    {
        return view('deportistas.create');
    }

    // Guarda un nuevo deportista
    public function store(DeportistaFormRequest $request)
    {
        Deportista::create([
            'cedula' => $request->cedula,
            'nombre' => $request->nombre,
            'apellido' => $request->apellido,
            'correo' => $request->correo,
            'telefono' => $request->telefono,
            'direccion' => $request->direccion,
            'fecha_nacimiento' => $request->fecha_nacimiento,
        ]);

        return Redirect::to('deportistas')
            ->with('success', 'Deportista registrado exitosamente');
    }

    // Muestra los detalles de un deportista
    public function show($id)
    {
        $deportista = Deportista::with(['jugadorClubs.club', 'inscripciones.curso'])
            ->findOrFail($id);

        return view('deportistas.show', ['deportista' => $deportista]);
    }

    // Muestra el formulario para editar un deportista
    public function edit($id)
    {
        $deportista = Deportista::findOrFail($id);

        return view('deportistas.edit', ['deportista' => $deportista]);
    }

    // Actualiza un deportista
    public function update(DeportistaFormRequest $request, $id)
    {
        $deportista = Deportista::findOrFail($id);

        $deportista->update([
            'cedula' => $request->cedula,
            'nombre' => $request->nombre,
            'apellido' => $request->apellido,
            'correo' => $request->correo,
            'telefono' => $request->telefono,
            'direccion' => $request->direccion,
            'fecha_nacimiento' => $request->fecha_nacimiento,
        ]);

        return Redirect::to('deportistas')
            ->with('success', 'Deportista actualizado exitosamente');
    }

    // Elimina un deportista
    public function destroy($id)
    {
        $deportista = Deportista::findOrFail($id);

        // Verificar si tiene relaciones activas
        $tieneClubActivo = $deportista->jugadorClubs()->where('activo', true)->exists();
        $tieneInscripciones = $deportista->inscripciones()->exists();

        if ($tieneClubActivo) {
            return back()
                ->withErrors(['error' => 'No se puede eliminar: el deportista está asignado a un club activo'])
                ->withInput();
        }

        if ($tieneInscripciones) {
            return back()
                ->withErrors(['error' => 'No se puede eliminar: el deportista tiene inscripciones registradas'])
                ->withInput();
        }

        $deportista->delete();

        return Redirect::to('deportistas')
            ->with('success', 'Deportista eliminado exitosamente');
    }
}
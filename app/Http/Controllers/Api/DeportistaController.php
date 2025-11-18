<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\DeportistaFormRequest;
use App\Models\Deportista;

class DeportistaController extends Controller
{
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

        return response()->json([
            'success' => true,
            'data' => $deportistas
        ]);
    }

    // Muestra el formulario para crear un deportista (devuelve estructura vacía)
    public function create()
    {
        return response()->json([
            'success' => true,
            'message' => 'Formulario para crear deportista',
            'data' => [
                'fields' => [
                    'cedula' => 'required|string',
                    'nombre' => 'required|string',
                    'apellido' => 'required|string',
                    'correo' => 'required|email',
                    'telefono' => 'nullable|string',
                    'direccion' => 'nullable|string',
                    'fecha_nacimiento' => 'required|date'
                ]
            ]
        ]);
    }

    // Guarda un nuevo deportista
    public function store(DeportistaFormRequest $request)
    {
        $deportista = Deportista::create([
            'cedula' => $request->cedula,
            'nombre' => $request->nombre,
            'apellido' => $request->apellido,
            'correo' => $request->correo,
            'telefono' => $request->telefono,
            'direccion' => $request->direccion,
            'fecha_nacimiento' => $request->fecha_nacimiento,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Deportista registrado exitosamente',
            'data' => $deportista
        ], 201);
    }

    // Muestra los detalles de un deportista
    public function show($id)
    {
        $deportista = Deportista::with(['jugadorClubs.club', 'inscripciones.curso'])
            ->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $deportista
        ]);
    }

    // Muestra el formulario para editar un deportista
    public function edit($id)
    {
        $deportista = Deportista::findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $deportista
        ]);
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

        return response()->json([
            'success' => true,
            'message' => 'Deportista actualizado exitosamente',
            'data' => $deportista
        ]);
    }

    // Elimina un deportista
    public function destroy($id)
    {
        $deportista = Deportista::findOrFail($id);

        // Verificar si tiene relaciones activas
        $tieneClubActivo = $deportista->jugadorClubs()->where('activo', true)->exists();
        $tieneInscripciones = $deportista->inscripciones()->exists();

        if ($tieneClubActivo) {
            return response()->json([
                'success' => false,
                'message' => 'No se puede eliminar: el deportista está asignado a un club activo'
            ], 400);
        }

        if ($tieneInscripciones) {
            return response()->json([
                'success' => false,
                'message' => 'No se puede eliminar: el deportista tiene inscripciones registradas'
            ], 400);
        }

        $deportista->delete();

        return response()->json([
            'success' => true,
            'message' => 'Deportista eliminado exitosamente'
        ]);
    }
}
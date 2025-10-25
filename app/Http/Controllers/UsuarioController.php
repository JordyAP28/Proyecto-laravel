<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Usuario;
use App\Models\Rol;
use App\Models\Estado;
use App\Models\LogSistema;


class UsuarioController extends Controller

{
    //se agrega todo los usuarios
    public function index()
    {
        //Se va a observar todos los usuarios con su rol y estado
        return Usuario::with(['rol', 'estado'])->get();
    }

    //formulacion de creacion.
    public function create()
    {
        // En APIs no es necesario, se puede dejar vacío o enviar info de apoyo
        return response()->json([
            'roles' => Rol::all(),
            'estados' => Estado::all()
        ]);
    }

    //se guardara. 
    public function store(Request $request)
    {
        //validacion.
        $validated = $request->validate([
            'nombre_usuario' => 'required|string|max:255',
            'clave' => 'required|string|max:255',
            'id_rol' => 'required|exists:roles,id_rol',
            'id_estado' => 'required|exists:estados,id_estado'
        ]);

        // Crear el usuario
        $usuario = Usuario::create($validated);

        // Retornar respuesta
        return response()->json($usuario, 201);
    }
    //un usuario en especifico se mostrara.
    public function show(string $id)
    {
        
        $usuario = Usuario::with(['rol', 'estado', 'logs'])->find($id);

        if (!$usuario) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }

        return response()->json($usuario);
    }

    //formula de edicion 
    public function edit(string $id)
    {
         $usuario = Usuario::find($id);

        if (!$usuario) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }

        return response()->json([
            'usuario' => $usuario,
            'roles' => Rol::all(),
            'estados' => Estado::all()
        ]);
    }

    //actualizar usuario
    public function update(Request $request, string $id)
    {
        $usuario = Usuario::find($id);

        if (!$usuario) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }

        $validated = $request->validate([
            'nombre_usuario' => 'sometimes|string|max:255',
            'clave' => 'sometimes|string|max:255',
            'id_rol' => 'sometimes|exists:roles,id_rol',
            'id_estado' => 'sometimes|exists:estados,id_estado'
        ]);

        $usuario->update($validated);

        return response()->json($usuario);
    }

    //eliminar usuario
    public function destroy(string $id)
    {
         $usuario = Usuario::find($id);

        if (!$usuario) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }

        $usuario->delete();

        return response()->json(['message' => 'Usuario eliminado']);
    }
    
}

<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use App\Http\Requests\UsuarioFormRequest;
use App\Models\Usuario;
use App\Models\Rol;
use App\Models\Estado;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class UsuarioController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return ['auth'];
    }

    public function index(Request $request)
    {
        $query = trim($request->get('searchText', ''));
        
        $usuarios = Usuario::with(['rol', 'estado'])
            ->where('username', 'LIKE', '%' . $query . '%')
            ->orWhere('email', 'LIKE', '%' . $query . '%')
            ->orderBy('id', 'desc')
            ->paginate(7);

        return view('seguridad.usuario.index', [
            'usuarios' => $usuarios,
            'searchText' => $query
        ]);
    }

    public function create()
    {
        $roles = Rol::all();
        $estados = Estado::all();

        return view('seguridad.usuario.create', [
            'roles' => $roles,
            'estados' => $estados
        ]);
    }

    public function store(UsuarioFormRequest $request)
    {
        Usuario::create([
            'username' => $request->username,
            'email' => $request->email,
            'password' => $request->password,
            'id_rol' => $request->id_rol,
            'id_estado' => $request->id_estado ?? 1,
        ]);

        return Redirect::to('seguridad/usuario')
            ->with('success', 'Usuario creado exitosamente');
    }

    public function edit($id)
    {
        $usuario = Usuario::with(['rol', 'estado'])->findOrFail($id);
        $roles = Rol::all();
        $estados = Estado::all();

        return view('seguridad.usuario.edit', [
            'usuario' => $usuario,
            'roles' => $roles,
            'estados' => $estados
        ]);
    }

    public function update(UsuarioFormRequest $request, $id)
    {
        $usuario = Usuario::findOrFail($id);
        
        $data = [
            'username' => $request->username,
            'email' => $request->email,
            'id_rol' => $request->id_rol,
            'id_estado' => $request->id_estado,
        ];

        if ($request->filled('password')) {
            $data['password'] = $request->password;
        }

        $usuario->update($data);

        return Redirect::to('seguridad/usuario')
            ->with('success', 'Usuario actualizado exitosamente');
    }

    public function destroy($id)
    {
        $usuario = Usuario::findOrFail($id);
        $usuario->update(['id_estado' => 2]); // Desactivar

        return Redirect::to('seguridad/usuario')
            ->with('success', 'Usuario desactivado exitosamente');
    }

    public function show($id)
    {
        $usuario = Usuario::with(['rol', 'estado', 'logs'])->findOrFail($id);

        return view('seguridad.usuario.show', ['usuario' => $usuario]);
    }


    public function recuperarContrasena()
{
    // Retorna la vista del formulario para recuperar contraseña
    return view('auth.recuperar_contrasena');
}

public function reestablecerContrasena()
{
    // Retorna la vista del formulario para reestablecer contraseña
    return view('auth.reestablecer_contrasena');
}

}
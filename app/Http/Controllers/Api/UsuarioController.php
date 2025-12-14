<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Usuario;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UsuarioController extends Controller
{
    /**
     * Lista todos los usuarios (paginado)
     */
    public function index(): JsonResponse
    {
        $usuarios = Usuario::with(['rol', 'estado'])
            ->orderBy('id_usuario', 'desc')
            ->paginate(10);

        return response()->json([
            'success' => true,
            'data'    => $usuarios
        ]);
    }

    /**
     * Crear un nuevo usuario (uso administrativo)
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'nombre_usuario' => 'required|string|max:255|unique:usuarios,nombre_usuario',
            'primer_nombre'  => 'required|string|max:255',
            'apellido'       => 'required|string|max:255',
            'cedula'         => 'required|string|max:10',
            'telefono'       => 'required|string|max:15',
            'email'          => 'required|email|max:255|unique:usuarios,email',
            'clave'          => 'required|string|min:6',
            'id_rol'         => 'required|exists:roles,id_rol',
            'id_estado'      => 'nullable|exists:estados,id_estado',
        ]);

        // Encriptar contraseña
        $validated['clave'] = Hash::make($validated['clave']);
        // Estado activo por defecto si no se envía
        $validated['id_estado'] = $validated['id_estado'] ?? 1;

        $usuario = Usuario::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Usuario creado exitosamente',
            'data'    => $usuario->load(['rol', 'estado'])
        ], 201);
    }

    /**
     * Mostrar un usuario específico
     * (Route model binding: {usuario})
     */
    public function show(Usuario $usuario): JsonResponse
    {
        $usuario->load(['rol', 'estado']);

        return response()->json([
            'success' => true,
            'data'    => $usuario
        ]);
    }

    /**
     * Actualizar un usuario (edición de perfil)
     * - Pensado para el propio usuario (estudiante) que edita sus datos básicos.
     * - 'id_rol' e 'id_estado' pasan a ser opcionales.
     * - 'clave' sólo se actualiza si se envía.
     */
    public function update(Request $request, Usuario $usuario): JsonResponse
    {
        $validated = $request->validate([
            // Si envías nombre_usuario, debe ser único (ignorando el propio registro)
            'nombre_usuario' => 'sometimes|string|max:255|unique:usuarios,nombre_usuario,' . $usuario->id_usuario . ',id_usuario',

            'primer_nombre'  => 'required|string|max:255',
            'apellido'       => 'required|string|max:255',
            'cedula'         => 'required|string|max:10',
            'telefono'       => 'required|string|max:15',

            // Email único (ignorando el propio registro)
            'email'          => 'required|email|max:255|unique:usuarios,email,' . $usuario->id_usuario . ',id_usuario',

            // Contraseña opcional, mínimo 6 si se envía
            'clave'          => 'nullable|string|min:6',

            // Para edición de perfil, opcional
            'id_rol'         => 'sometimes|exists:roles,id_rol',
            'id_estado'      => 'sometimes|exists:estados,id_estado',
        ]);

        // Si se envió 'clave', la encriptamos; si no, la quitamos del payload
        if ($request->filled('clave')) {
            $validated['clave'] = Hash::make($validated['clave']);
        } else {
            unset($validated['clave']);
        }

        // Si tu lógica establece email como nombre_usuario (común en tu app),
        // puedes sincronizarlos cuando se envía email:
        if (isset($validated['email'])) {
            $validated['nombre_usuario'] = $validated['nombre_usuario'] ?? $validated['email'];
        }

        // Actualizar
        $usuario->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Usuario actualizado exitosamente',
            'data'    => $usuario->fresh(['rol', 'estado'])
        ]);
    }

    /**
     * Eliminar un usuario (uso administrativo)
     */
    public function destroy(Usuario $usuario): JsonResponse
    {
        $usuario->delete();

        return response()->json([
            'success' => true,
            'message' => 'Usuario eliminado exitosamente'
        ]);
    }
}

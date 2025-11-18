<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Estado;
use Illuminate\Support\Facades\Validator;

class EstadoController extends Controller
{
    // Lista todos los estados disponibles
    public function index()
    {
        $estados = Estado::withCount(['usuarios', 'cursos', 'clubes'])->get();

        return response()->json([
            'success' => true,
            'data' => $estados
        ]);
    }

    // Crear un nuevo estado
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'estado' => 'required|in:Activo,Inactivo,Suspendido,Anulado,Observacion|unique:estados,estado',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $validator->errors()
            ], 422);
        }

        $estado = Estado::create([
            'estado' => $request->estado
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Estado creado exitosamente',
            'data' => $estado
        ], 201);
    }

    // Muestra un estado específico
    public function show($id)
    {
        $estado = Estado::withCount(['usuarios', 'cursos', 'clubes'])->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $estado
        ]);
    }

    // Actualizar un estado
    public function update(Request $request, $id)
    {
        $estado = Estado::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'estado' => 'required|in:Activo,Inactivo,Suspendido,Anulado,Observacion|unique:estados,estado,' . $id . ',id_estado',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $validator->errors()
            ], 422);
        }

        $estado->update([
            'estado' => $request->estado
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Estado actualizado exitosamente',
            'data' => $estado
        ]);
    }

    // Eliminar un estado
    public function destroy($id)
    {
        $estado = Estado::findOrFail($id);

        // Verificar si hay registros usando este estado
        $totalUsuarios = $estado->usuarios()->count();
        $totalCursos = $estado->cursos()->count();
        $totalClubes = $estado->clubes()->count();

        if ($totalUsuarios > 0 || $totalCursos > 0 || $totalClubes > 0) {
            return response()->json([
                'success' => false,
                'message' => 'No se puede eliminar: existen registros asociados a este estado',
                'detalles' => [
                    'usuarios' => $totalUsuarios,
                    'cursos' => $totalCursos,
                    'clubes' => $totalClubes
                ]
            ], 400);
        }

        $estado->delete();

        return response()->json([
            'success' => true,
            'message' => 'Estado eliminado exitosamente'
        ]);
    }

    // Obtener usuarios por estado
    public function usuarios($id)
    {
        $estado = Estado::with('usuarios.rol')->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => [
                'estado' => $estado->estado,
                'total_usuarios' => $estado->usuarios->count(),
                'usuarios' => $estado->usuarios
            ]
        ]);
    }

    // Obtener cursos por estado
    public function cursos($id)
    {
        $estado = Estado::with('cursos')->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => [
                'estado' => $estado->estado,
                'total_cursos' => $estado->cursos->count(),
                'cursos' => $estado->cursos
            ]
        ]);
    }

    // Obtener clubes por estado
    public function clubes($id)
    {
        $estado = Estado::with('clubes')->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => [
                'estado' => $estado->estado,
                'total_clubes' => $estado->clubes->count(),
                'clubes' => $estado->clubes
            ]
        ]);
    }

    // Estadísticas generales
    public function estadisticas()
    {
        $estadisticas = Estado::withCount(['usuarios', 'cursos', 'clubes'])->get();

        return response()->json([
            'success' => true,
            'data' => $estadisticas
        ]);
    }
}
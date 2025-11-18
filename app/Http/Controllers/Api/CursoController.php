<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Curso;
use App\Models\Estado;
use Illuminate\Support\Facades\Validator;

class CursoController extends Controller
{
    // Lista todos los cursos con búsqueda y filtros
    public function index(Request $request)
    {
        $query = trim($request->get('searchText', ''));
        $tipo = $request->get('tipo');
        $id_estado = $request->get('id_estado');

        $cursos = Curso::with(['estado'])
            ->when($query, function($q) use ($query) {
                $q->where('nombre_curso', 'LIKE', '%' . $query . '%')
                  ->orWhere('descripcion', 'LIKE', '%' . $query . '%');
            })
            ->when($tipo, function($q) use ($tipo) {
                $q->where('tipo', $tipo);
            })
            ->when($id_estado, function($q) use ($id_estado) {
                $q->where('id_estado', $id_estado);
            })
            ->orderBy('fecha_inicio', 'desc')
            ->paginate(10);

        return response()->json([
            'success' => true,
            'data' => $cursos
        ]);
    }

    // Obtiene datos para crear curso
    public function create()
    {
        $estados = Estado::all();

        return response()->json([
            'success' => true,
            'data' => [
                'estados' => $estados,
                'tipos' => ['Vacacional', 'Permanente', 'Temporal']
            ]
        ]);
    }

    // Crea un nuevo curso
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nombre_curso' => 'required|string|max:255',
            'tipo' => 'required|in:Vacacional,Permanente,Temporal',
            'descripcion' => 'required|string',
            'fecha_inicio' => 'required|date',
            'fecha_fin' => 'required|date|after_or_equal:fecha_inicio',
            'id_estado' => 'nullable|exists:estados,id_estado',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $validator->errors()
            ], 422);
        }

        $curso = Curso::create([
            'nombre_curso' => $request->nombre_curso,
            'tipo' => $request->tipo,
            'descripcion' => $request->descripcion,
            'fecha_inicio' => $request->fecha_inicio,
            'fecha_fin' => $request->fecha_fin,
            'id_estado' => $request->id_estado ?? 1,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Curso creado exitosamente',
            'data' => $curso->load('estado')
        ], 201);
    }

    // Muestra detalles de un curso
    public function show($id)
    {
        $curso = Curso::with(['estado', 'inscripciones.deportista'])
            ->withCount('inscripciones')
            ->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $curso
        ]);
    }

    // Obtiene datos para editar curso
    public function edit($id)
    {
        $curso = Curso::with('estado')->findOrFail($id);
        $estados = Estado::all();

        return response()->json([
            'success' => true,
            'data' => [
                'curso' => $curso,
                'estados' => $estados,
                'tipos' => ['Vacacional', 'Permanente', 'Temporal']
            ]
        ]);
    }

    // Actualiza un curso
    public function update(Request $request, $id)
    {
        $curso = Curso::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'nombre_curso' => 'required|string|max:255',
            'tipo' => 'required|in:Vacacional,Permanente,Temporal',
            'descripcion' => 'required|string',
            'fecha_inicio' => 'required|date',
            'fecha_fin' => 'required|date|after_or_equal:fecha_inicio',
            'id_estado' => 'required|exists:estados,id_estado',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $validator->errors()
            ], 422);
        }

        $curso->update([
            'nombre_curso' => $request->nombre_curso,
            'tipo' => $request->tipo,
            'descripcion' => $request->descripcion,
            'fecha_inicio' => $request->fecha_inicio,
            'fecha_fin' => $request->fecha_fin,
            'id_estado' => $request->id_estado,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Curso actualizado exitosamente',
            'data' => $curso->load('estado')
        ]);
    }

    // Desactiva un curso
    public function destroy($id)
    {
        $curso = Curso::findOrFail($id);

        // Verificar si hay inscripciones
        if ($curso->inscripciones()->count() > 0) {
            // Solo cambiar estado a inactivo
            $curso->update(['id_estado' => 2]);
            
            return response()->json([
                'success' => true,
                'message' => 'Curso desactivado (tiene inscripciones registradas)',
                'data' => $curso
            ]);
        }

        // Si no hay inscripciones, se puede eliminar
        $curso->delete();

        return response()->json([
            'success' => true,
            'message' => 'Curso eliminado exitosamente'
        ]);
    }

    // Activar curso
    public function activar($id)
    {
        $curso = Curso::findOrFail($id);
        $curso->update(['id_estado' => 1]);

        return response()->json([
            'success' => true,
            'message' => 'Curso activado exitosamente',
            'data' => $curso->load('estado')
        ]);
    }

    // Lista de inscritos en el curso
    public function inscritos($id)
    {
        $curso = Curso::with(['inscripciones.deportista'])
            ->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => [
                'curso' => $curso->only(['id_curso', 'nombre_curso', 'tipo']),
                'total_inscritos' => $curso->inscripciones->count(),
                'inscritos' => $curso->inscripciones
            ]
        ]);
    }

    // Cursos activos
    public function activos()
    {
        $cursos = Curso::with('estado')
            ->where('id_estado', 1)
            ->where('fecha_fin', '>=', now())
            ->orderBy('fecha_inicio', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $cursos
        ]);
    }
}
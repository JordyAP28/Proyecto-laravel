<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\InscripcionCurso;
use App\Models\Curso;
use App\Models\Deportista;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class InscripcionCursoController extends Controller
{
    // Lista todas las inscripciones
    public function index(Request $request)
    {
        $id_curso = $request->get('id_curso');
        $id_deportista = $request->get('id_deportista');

        $inscripciones = InscripcionCurso::with(['curso', 'deportista'])
            ->when($id_curso, function($q) use ($id_curso) {
                $q->where('id_curso', $id_curso);
            })
            ->when($id_deportista, function($q) use ($id_deportista) {
                $q->where('id_deportista', $id_deportista);
            })
            ->orderBy('fecha_inscripcion', 'desc')
            ->paginate(10);

        return response()->json([
            'success' => true,
            'data' => $inscripciones
        ]);
    }

    // Obtiene datos para crear inscripción
    public function create()
    {
        // Cursos activos
        $cursos = Curso::where('id_estado', 1)
            ->where('fecha_fin', '>=', now())
            ->orderBy('nombre_curso')
            ->get();

        // Deportistas disponibles
        $deportistas = Deportista::orderBy('apellido')
            ->orderBy('nombre')
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'cursos' => $cursos,
                'deportistas' => $deportistas
            ]
        ]);
    }

    // Inscribir deportista a curso
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id_curso' => 'required|exists:cursos,id_curso',
            'id_deportista' => 'required|exists:deportistas,id_deportista',
            'fecha_inscripcion' => 'nullable|date',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $validator->errors()
            ], 422);
        }

        // Verificar si ya está inscrito
        $yaInscrito = InscripcionCurso::where('id_curso', $request->id_curso)
            ->where('id_deportista', $request->id_deportista)
            ->exists();

        if ($yaInscrito) {
            return response()->json([
                'success' => false,
                'message' => 'El deportista ya está inscrito en este curso'
            ], 400);
        }

        // Verificar que el curso esté activo
        $curso = Curso::findOrFail($request->id_curso);
        if ($curso->id_estado != 1) {
            return response()->json([
                'success' => false,
                'message' => 'No se puede inscribir: el curso no está activo'
            ], 400);
        }

        $inscripcion = InscripcionCurso::create([
            'id_curso' => $request->id_curso,
            'id_deportista' => $request->id_deportista,
            'fecha_inscripcion' => $request->fecha_inscripcion ?? now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Inscripción realizada exitosamente',
            'data' => $inscripcion->load(['curso', 'deportista'])
        ], 201);
    }

    // Muestra detalles de una inscripción
    public function show($id)
    {
        $inscripcion = InscripcionCurso::with(['curso.estado', 'deportista'])
            ->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $inscripcion
        ]);
    }

    // Elimina una inscripción
    public function destroy($id)
    {
        $inscripcion = InscripcionCurso::findOrFail($id);
        $inscripcion->delete();

        return response()->json([
            'success' => true,
            'message' => 'Inscripción eliminada exitosamente'
        ]);
    }

    // Cursos de un deportista
    public function cursosDeportista($id_deportista)
    {
        $deportista = Deportista::findOrFail($id_deportista);
        
        $inscripciones = InscripcionCurso::with('curso.estado')
            ->where('id_deportista', $id_deportista)
            ->orderBy('fecha_inscripcion', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'deportista' => $deportista,
                'total_cursos' => $inscripciones->count(),
                'inscripciones' => $inscripciones
            ]
        ]);
    }

    // Deportistas inscritos en un curso
    public function deportistasCurso($id_curso)
    {
        $curso = Curso::findOrFail($id_curso);
        
        $inscripciones = InscripcionCurso::with('deportista')
            ->where('id_curso', $id_curso)
            ->orderBy('fecha_inscripcion', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'curso' => $curso,
                'total_deportistas' => $inscripciones->count(),
                'inscripciones' => $inscripciones
            ]
        ]);
    }
}
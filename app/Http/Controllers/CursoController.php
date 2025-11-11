<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Curso;

class CursoController extends Controller
{
    public function index()
    {
        $cursos = Curso::all();
        return view('estudiante', compact('cursos'));

    }

    public function inscribirse($curso_id)
    {
        // Ejemplo de inscripción
        $curso = Curso::findOrFail($curso_id);
        auth()->user()->cursos()->attach($curso_id);

        return back()->with('success', 'Te has inscrito correctamente al curso ' . $curso->nombre);
    }
}

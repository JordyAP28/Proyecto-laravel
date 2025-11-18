<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\ClubCampeonato;
use App\Models\Club;
use App\Models\Campeonato;
use Illuminate\Support\Facades\Validator;

class ClubCampeonatoController extends Controller
{
    // Lista todas las inscripciones de clubes a campeonatos
    public function index(Request $request)
    {
        $id_club = $request->get('id_club');
        $id_campeonato = $request->get('id_campeonato');

        $inscripciones = ClubCampeonato::with(['club.estado', 'campeonato'])
            ->when($id_club, function($q) use ($id_club) {
                $q->where('id_club', $id_club);
            })
            ->when($id_campeonato, function($q) use ($id_campeonato) {
                $q->where('id_campeonato', $id_campeonato);
            })
            ->orderBy('id_club_campeonato', 'desc')
            ->paginate(15);

        return response()->json([
            'success' => true,
            'data' => $inscripciones
        ]);
    }

    // Obtiene datos para crear inscripción
    public function create()
    {
        // Clubes activos
        $clubes = Club::where('id_estado', 1)
            ->orderBy('nombre')
            ->get();

        // Campeonatos disponibles (actuales y futuros)
        $hoy = now()->format('Y-m-d');
        $campeonatos = Campeonato::where('fecha_fin', '>=', $hoy)
            ->orderBy('fecha_inicio', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'clubes' => $clubes,
                'campeonatos' => $campeonatos
            ]
        ]);
    }

    // Inscribir club a campeonato
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id_club' => 'required|exists:clubes,id_club',
            'id_campeonato' => 'required|exists:campeonatos,id_campeonato',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $validator->errors()
            ], 422);
        }

        // Verificar si ya está inscrito
        $yaInscrito = ClubCampeonato::where('id_club', $request->id_club)
            ->where('id_campeonato', $request->id_campeonato)
            ->exists();

        if ($yaInscrito) {
            return response()->json([
                'success' => false,
                'message' => 'El club ya está inscrito en este campeonato'
            ], 400);
        }

        // Verificar que el club esté activo
        $club = Club::findOrFail($request->id_club);
        if ($club->id_estado != 1) {
            return response()->json([
                'success' => false,
                'message' => 'No se puede inscribir: el club no está activo'
            ], 400);
        }

        $inscripcion = ClubCampeonato::create([
            'id_club' => $request->id_club,
            'id_campeonato' => $request->id_campeonato,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Club inscrito al campeonato exitosamente',
            'data' => $inscripcion->load(['club', 'campeonato'])
        ], 201);
    }

    // Muestra detalles de una inscripción
    public function show($id)
    {
        $inscripcion = ClubCampeonato::with(['club.estado', 'campeonato'])
            ->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $inscripcion
        ]);
    }

    // Elimina una inscripción (retirar club del campeonato)
    public function destroy($id)
    {
        $inscripcion = ClubCampeonato::findOrFail($id);
        $inscripcion->delete();

        return response()->json([
            'success' => true,
            'message' => 'Club retirado del campeonato exitosamente'
        ]);
    }

    // Campeonatos de un club específico
    public function campeonatosDeClub($id_club)
    {
        $club = Club::findOrFail($id_club);
        
        $inscripciones = ClubCampeonato::with('campeonato')
            ->where('id_club', $id_club)
            ->orderBy('id_club_campeonato', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'club' => $club,
                'total_campeonatos' => $inscripciones->count(),
                'inscripciones' => $inscripciones
            ]
        ]);
    }

    // Clubes inscritos en un campeonato
    public function clubesDeCampeonato($id_campeonato)
    {
        $campeonato = Campeonato::findOrFail($id_campeonato);
        
        $inscripciones = ClubCampeonato::with('club.estado')
            ->where('id_campeonato', $id_campeonato)
            ->orderBy('id_club_campeonato', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'campeonato' => $campeonato,
                'total_clubes' => $inscripciones->count(),
                'inscripciones' => $inscripciones
            ]
        ]);
    }

    // Inscripción masiva de clubes
    public function inscripcionMasiva(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id_campeonato' => 'required|exists:campeonatos,id_campeonato',
            'clubes' => 'required|array|min:1',
            'clubes.*' => 'exists:clubes,id_club',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $validator->errors()
            ], 422);
        }

        $inscritos = [];
        $yaInscritos = [];
        $inactivos = [];

        foreach ($request->clubes as $id_club) {
            // Verificar si ya está inscrito
            $existe = ClubCampeonato::where('id_club', $id_club)
                ->where('id_campeonato', $request->id_campeonato)
                ->exists();

            if ($existe) {
                $yaInscritos[] = $id_club;
                continue;
            }

            // Verificar que esté activo
            $club = Club::find($id_club);
            if ($club->id_estado != 1) {
                $inactivos[] = $id_club;
                continue;
            }

            // Inscribir
            ClubCampeonato::create([
                'id_club' => $id_club,
                'id_campeonato' => $request->id_campeonato,
            ]);

            $inscritos[] = $id_club;
        }

        return response()->json([
            'success' => true,
            'message' => 'Inscripción masiva completada',
            'data' => [
                'inscritos' => count($inscritos),
                'ya_inscritos' => count($yaInscritos),
                'inactivos' => count($inactivos),
                'detalle' => [
                    'clubes_inscritos' => $inscritos,
                    'clubes_ya_inscritos' => $yaInscritos,
                    'clubes_inactivos' => $inactivos
                ]
            ]
        ]);
    }
}
<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\LogSistema;
use App\Models\Usuario;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class LogSistemaController extends Controller
{
    // Lista todos los logs con búsqueda y filtros
    public function index(Request $request)
    {
        $id_usuario = $request->get('id_usuario');
        $fecha_desde = $request->get('fecha_desde');
        $fecha_hasta = $request->get('fecha_hasta');
        $accion = trim($request->get('accion', ''));

        $logs = LogSistema::with(['usuario.rol'])
            ->when($id_usuario, function($q) use ($id_usuario) {
                $q->where('id_usuario', $id_usuario);
            })
            ->when($accion, function($q) use ($accion) {
                $q->where('accion', 'LIKE', '%' . $accion . '%');
            })
            ->when($fecha_desde, function($q) use ($fecha_desde) {
                $q->whereDate('created_at', '>=', $fecha_desde);
            })
            ->when($fecha_hasta, function($q) use ($fecha_hasta) {
                $q->whereDate('created_at', '<=', $fecha_hasta);
            })
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json([
            'success' => true,
            'data' => $logs
        ]);
    }

    // Crear un nuevo log
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id_usuario' => 'required|exists:usuarios,id_usuario',
            'accion' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $validator->errors()
            ], 422);
        }

        $log = LogSistema::create([
            'id_usuario' => $request->id_usuario,
            'accion' => $request->accion,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Log registrado exitosamente',
            'data' => $log->load('usuario')
        ], 201);
    }

    // Muestra detalles de un log
    public function show($id)
    {
        $log = LogSistema::with(['usuario.rol', 'usuario.estado'])
            ->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $log
        ]);
    }

    // Eliminar un log (generalmente no se eliminan, pero por si acaso)
    public function destroy($id)
    {
        $log = LogSistema::findOrFail($id);
        $log->delete();

        return response()->json([
            'success' => true,
            'message' => 'Log eliminado exitosamente'
        ]);
    }

    // Logs de un usuario específico
    public function logsPorUsuario($id_usuario)
    {
        $usuario = Usuario::with('rol')->findOrFail($id_usuario);
        
        $logs = LogSistema::where('id_usuario', $id_usuario)
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json([
            'success' => true,
            'data' => [
                'usuario' => $usuario,
                'total_logs' => $logs->total(),
                'logs' => $logs
            ]
        ]);
    }

    // Logs de hoy
    public function logsHoy()
    {
        $logs = LogSistema::with(['usuario.rol'])
            ->whereDate('created_at', Carbon::today())
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'fecha' => Carbon::today()->format('Y-m-d'),
                'total_logs' => $logs->count(),
                'logs' => $logs
            ]
        ]);
    }

    // Logs por rango de fechas
    public function logsPorFecha(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'fecha_desde' => 'required|date',
            'fecha_hasta' => 'required|date|after_or_equal:fecha_desde',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $validator->errors()
            ], 422);
        }

        $logs = LogSistema::with(['usuario.rol'])
            ->whereDate('created_at', '>=', $request->fecha_desde)
            ->whereDate('created_at', '<=', $request->fecha_hasta)
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json([
            'success' => true,
            'data' => [
                'fecha_desde' => $request->fecha_desde,
                'fecha_hasta' => $request->fecha_hasta,
                'total_logs' => $logs->total(),
                'logs' => $logs
            ]
        ]);
    }

    // Estadísticas de logs
    public function estadisticas(Request $request)
    {
        $fecha_desde = $request->get('fecha_desde', Carbon::now()->subDays(30));
        $fecha_hasta = $request->get('fecha_hasta', Carbon::now());

        $totalLogs = LogSistema::whereDate('created_at', '>=', $fecha_desde)
            ->whereDate('created_at', '<=', $fecha_hasta)
            ->count();

        $logsPorUsuario = LogSistema::with('usuario:id_usuario,nombre_usuario')
            ->whereDate('created_at', '>=', $fecha_desde)
            ->whereDate('created_at', '<=', $fecha_hasta)
            ->selectRaw('id_usuario, count(*) as total')
            ->groupBy('id_usuario')
            ->orderBy('total', 'desc')
            ->limit(10)
            ->get();

        $logsPorDia = LogSistema::whereDate('created_at', '>=', $fecha_desde)
            ->whereDate('created_at', '<=', $fecha_hasta)
            ->selectRaw('DATE(created_at) as fecha, count(*) as total')
            ->groupBy('fecha')
            ->orderBy('fecha', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'periodo' => [
                    'desde' => $fecha_desde,
                    'hasta' => $fecha_hasta
                ],
                'total_logs' => $totalLogs,
                'logs_por_usuario' => $logsPorUsuario,
                'logs_por_dia' => $logsPorDia
            ]
        ]);
    }

    // Limpiar logs antiguos
    public function limpiarLogsAntiguos(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'dias' => 'required|integer|min:30',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $validator->errors()
            ], 422);
        }

        $fecha_limite = Carbon::now()->subDays($request->dias);
        
        $eliminados = LogSistema::where('created_at', '<', $fecha_limite)->delete();

        return response()->json([
            'success' => true,
            'message' => 'Logs antiguos eliminados exitosamente',
            'data' => [
                'fecha_limite' => $fecha_limite->format('Y-m-d'),
                'logs_eliminados' => $eliminados
            ]
        ]);
    }

    // Buscar logs por palabra clave en acción
    public function buscarPorAccion(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'keyword' => 'required|string|min:3',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $validator->errors()
            ], 422);
        }

        $logs = LogSistema::with(['usuario.rol'])
            ->where('accion', 'LIKE', '%' . $request->keyword . '%')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json([
            'success' => true,
            'data' => [
                'keyword' => $request->keyword,
                'total_resultados' => $logs->total(),
                'logs' => $logs
            ]
        ]);
    }

    // Actividad reciente (últimos N logs)
    public function actividadReciente(Request $request)
    {
        $limite = $request->get('limite', 50);

        $logs = LogSistema::with(['usuario.rol'])
            ->orderBy('created_at', 'desc')
            ->limit($limite)
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'limite' => $limite,
                'logs' => $logs
            ]
        ]);
    }
}
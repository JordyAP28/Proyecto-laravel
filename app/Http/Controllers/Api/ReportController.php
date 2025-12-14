<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Usuario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ReportController extends Controller
{
    // Generar reporte de usuarios en JSON
    public function reporteUsuarios()
    {
        try {
            $usuarios = Usuario::select(
                'id_usuario',
                'nombre_usuario',
                'primer_nombre',
                'apellido',
                'cedula',
                'email',
                'telefono',
                'id_rol',
                'id_estado'
            )->get();

            $usuariosFormateados = $usuarios->map(function ($usuario) {
                return [
                    'ID' => $usuario->id_usuario,
                    'Nombre Completo' => $usuario->primer_nombre . ' ' . $usuario->apellido,
                    'Usuario' => $usuario->nombre_usuario,
                    'Cédula' => $usuario->cedula,
                    'Email' => $usuario->email,
                    'Teléfono' => $usuario->telefono,
                    'Rol' => $this->getRolNombre($usuario->id_rol),
                    'Estado' => $usuario->id_estado == 1 ? 'Activo' : 'Inactivo',
                ];
            });

            return response()->json([
                'success' => true,
                'data' => $usuariosFormateados,
                'total' => $usuarios->count(),
                'fecha_generacion' => now()->format('d/m/Y H:i:s')
            ], 200);

        } catch (\Exception $e) {
            Log::error('Error al generar reporte: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al generar reporte'
            ], 500);
        }
    }

    // Generar Excel (CSV)
    public function exportarExcel()
    {
        try {
            $usuarios = Usuario::select(
                'id_usuario',
                'nombre_usuario',
                'primer_nombre',
                'apellido',
                'cedula',
                'email',
                'telefono',
                'id_rol',
                'id_estado'
            )->get();

            // Crear contenido CSV
            $csvContent = "ID,Nombre Completo,Usuario,Cédula,Email,Teléfono,Rol,Estado\n";

            foreach ($usuarios as $usuario) {
                $csvContent .= sprintf(
                    "%d,\"%s %s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\"\n",
                    $usuario->id_usuario,
                    $usuario->primer_nombre,
                    $usuario->apellido,
                    $usuario->nombre_usuario,
                    $usuario->cedula,
                    $usuario->email,
                    $usuario->telefono,
                    $this->getRolNombre($usuario->id_rol),
                    $usuario->id_estado == 1 ? 'Activo' : 'Inactivo'
                );
            }

            $fileName = 'reporte_usuarios_' . date('Y-m-d_His') . '.csv';

            return response($csvContent, 200, [
                'Content-Type' => 'text/csv',
                'Content-Disposition' => 'attachment; filename="' . $fileName . '"',
            ]);

        } catch (\Exception $e) {
            Log::error('Error al exportar Excel: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al exportar Excel'
            ], 500);
        }
    }

    // Generar PDF
    public function exportarPDF()
    {
        try {
            $usuarios = Usuario::select(
                'id_usuario',
                'nombre_usuario',
                'primer_nombre',
                'apellido',
                'cedula',
                'email',
                'telefono',
                'id_rol',
                'id_estado'
            )->get();

            // Crear HTML para el PDF
            $html = '
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Reporte de Usuarios</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { color: #333; text-align: center; }
        .info { text-align: center; margin-bottom: 20px; color: #666; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th { background-color: #4CAF50; color: white; padding: 10px; text-align: left; }
        td { border: 1px solid #ddd; padding: 8px; }
        tr:nth-child(even) { background-color: #f2f2f2; }
        .footer { margin-top: 30px; text-align: center; color: #999; font-size: 12px; }
    </style>
</head>
<body>
    <h1>Reporte de Usuarios</h1>
    <div class="info">
        <p>Total de usuarios: ' . $usuarios->count() . '</p>
        <p>Fecha de generación: ' . now()->format('d/m/Y H:i:s') . '</p>
    </div>
    
    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>Nombre Completo</th>
                <th>Cédula</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>Rol</th>
                <th>Estado</th>
            </tr>
        </thead>
        <tbody>';

            foreach ($usuarios as $usuario) {
                $html .= '
            <tr>
                <td>' . $usuario->id_usuario . '</td>
                <td>' . $usuario->primer_nombre . ' ' . $usuario->apellido . '</td>
                <td>' . $usuario->cedula . '</td>
                <td>' . $usuario->email . '</td>
                <td>' . $usuario->telefono . '</td>
                <td>' . $this->getRolNombre($usuario->id_rol) . '</td>
                <td>' . ($usuario->id_estado == 1 ? 'Activo' : 'Inactivo') . '</td>
            </tr>';
            }

            $html .= '
        </tbody>
    </table>
    
    <div class="footer">
        <p>© 2025 Sistema de Administración de Usuarios</p>
    </div>
</body>
</html>';

            // Usaremos DomPDF
            $dompdf = new \Dompdf\Dompdf();
            $dompdf->loadHtml($html);
            $dompdf->setPaper('A4', 'landscape');
            $dompdf->render();

            $fileName = 'reporte_usuarios_' . date('Y-m-d_His') . '.pdf';

            return response($dompdf->output(), 200, [
                'Content-Type' => 'application/pdf',
                'Content-Disposition' => 'attachment; filename="' . $fileName . '"',
            ]);

        } catch (\Exception $e) {
            Log::error('Error al exportar PDF: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al exportar PDF: ' . $e->getMessage()
            ], 500);
        }
    }

    private function getRolNombre($idRol)
    {
        $roles = [
            1 => 'Administrador',
            2 => 'Secretaria',
            3 => 'Deportista'
        ];
        return $roles[$idRol] ?? 'Desconocido';
    }
}

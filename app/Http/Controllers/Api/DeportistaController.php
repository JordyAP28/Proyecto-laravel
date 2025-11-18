<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Deportista;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DeportistaController extends Controller
{
    /**
     * Lista todos los deportistas
     */
    public function index(): JsonResponse
    {
        $deportistas = Deportista::orderBy('apellido', 'asc')
            ->orderBy('nombre', 'asc')
            ->paginate(10);

        return response()->json([
            'success' => true,
            'data' => $deportistas
        ]);
    }

    /**
     * Crear un nuevo deportista
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'cedula' => 'required|string|unique:deportistas,cedula|max:20',
            'nombre' => 'required|string|max:255',
            'apellido' => 'required|string|max:255',
            'correo' => 'required|email|unique:deportistas,correo|max:255',
            'telefono' => 'nullable|string|max:20',
            'direccion' => 'nullable|string|max:500',
            'fecha_nacimiento' => 'required|date',
        ]);

        $deportista = Deportista::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Deportista registrado exitosamente',
            'data' => $deportista
        ], 201);
    }

    /**
     * Muestra un deportista específico
     */
    public function show(Deportista $deportista): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $deportista
        ]);
    }

    /**
     * Actualizar un deportista
     */
    public function update(Request $request, Deportista $deportista): JsonResponse
    {
        $validated = $request->validate([
            'cedula' => 'required|string|max:20|unique:deportistas,cedula,' . $deportista->id_deportista . ',id_deportista',
            'nombre' => 'required|string|max:255',
            'apellido' => 'required|string|max:255',
            'correo' => 'required|email|max:255|unique:deportistas,correo,' . $deportista->id_deportista . ',id_deportista',
            'telefono' => 'nullable|string|max:20',
            'direccion' => 'nullable|string|max:500',
            'fecha_nacimiento' => 'required|date',
        ]);

        $deportista->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Deportista actualizado exitosamente',
            'data' => $deportista->fresh()
        ]);
    }

    /**
     * Eliminar un deportista
     */
    public function destroy(Deportista $deportista): JsonResponse
    {
        $deportista->delete();

        return response()->json([
            'success' => true,
            'message' => 'Deportista eliminado exitosamente'
        ]);
    }
}
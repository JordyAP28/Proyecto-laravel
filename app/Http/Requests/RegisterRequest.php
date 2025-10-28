<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nombre_usuario' => 'required|string|max:255|unique:usuarios,nombre_usuario',
            'clave' => 'required|string|min:8|confirmed',
            'id_rol' => 'required|exists:roles,id_rol|in:3,4',
        ];
    }

    public function messages(): array
    {
        return [
            'nombre_usuario.required' => 'El nombre de usuario es obligatorio',
            'nombre_usuario.unique' => 'Este nombre de usuario ya está en uso',
            'clave.required' => 'La contraseña es obligatoria',
            'clave.min' => 'La contraseña debe tener al menos 8 caracteres',
            'clave.confirmed' => 'Las contraseñas no coinciden',
            'id_rol.required' => 'Debes seleccionar un tipo de usuario',
            'id_rol.in' => 'Solo puedes registrarte como Deportista o Entrenador',
        ];
    }
}
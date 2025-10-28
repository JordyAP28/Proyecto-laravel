<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UsuarioFormRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $usuarioId = $this->route('id'); // Para edición
        
        return [
            'nombre_usuario' => 'required|string|max:255|unique:usuarios,nombre_usuario,' . $usuarioId . ',id_usuario',
            'clave' => $this->isMethod('post') ? 'required|min:6' : 'nullable|min:6',
            'id_rol' => 'required|exists:roles,id_rol',
            'id_estado' => 'nullable|exists:estados,id_estado',
        ];
    }
}
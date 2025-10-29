<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ClubFormRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $clubId = $this->route('club');
        
        return [
            'nombre' => 'required|string|max:255|unique:clubes,nombre,' . $clubId . ',id_club',
            'representante' => 'required|string|max:255',
            'telefono' => 'required|string|size:10|regex:/^[0-9]{10}$/',
            'fecha_creacion' => 'required|date|before_or_equal:today',
            'id_estado' => 'nullable|exists:estados,id_estado',
        ];
    }

    public function messages(): array
    {
        return [
            'nombre.required' => 'El nombre del club es obligatorio',
            'nombre.max' => 'El nombre no puede exceder 255 caracteres',
            'nombre.unique' => 'Ya existe un club con este nombre',
            
            'representante.required' => 'El representante es obligatorio',
            'representante.max' => 'El nombre del representante no puede exceder 255 caracteres',
            
            'telefono.required' => 'El teléfono es obligatorio',
            'telefono.size' => 'El teléfono debe tener exactamente 10 dígitos',
            'telefono.regex' => 'El teléfono solo debe contener números',
            
            'fecha_creacion.required' => 'La fecha de creación es obligatoria',
            'fecha_creacion.date' => 'Fecha inválida',
            'fecha_creacion.before_or_equal' => 'La fecha de creación no puede ser futura',
            
            'id_estado.exists' => 'El estado seleccionado no existe',
        ];
    }
}
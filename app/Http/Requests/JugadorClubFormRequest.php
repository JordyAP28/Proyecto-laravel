<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\JugadorClub;

class JugadorClubFormRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $rules = [
            'id_deportista' => 'required|exists:deportistas,id_deportista',
            'id_club' => 'required|exists:clubes,id_club',
            'fecha_ingreso' => 'required|date',
        ];

        // Si es update, no validar id_deportista
        if ($this->isMethod('put') || $this->isMethod('patch')) {
            unset($rules['id_deportista']);
        }

        return $rules;
    }

    public function messages(): array
    {
        return [
            'id_deportista.required' => 'Debes seleccionar un deportista',
            'id_deportista.exists' => 'El deportista seleccionado no existe',
            'id_club.required' => 'Debes seleccionar un club',
            'id_club.exists' => 'El club seleccionado no existe',
            'fecha_ingreso.required' => 'La fecha de ingreso es obligatoria',
            'fecha_ingreso.date' => 'Fecha inválida',
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            // Solo validar en store (no en update)
            if ($this->isMethod('post')) {
                $tieneClubActivo = JugadorClub::where('id_deportista', $this->id_deportista)
                    ->where('activo', true)
                    ->exists();

                if ($tieneClubActivo) {
                    $validator->errors()->add('id_deportista', 'Este deportista ya está asignado a un club activo');
                }
            }
        });
    }
}
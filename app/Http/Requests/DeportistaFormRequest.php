<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class DeportistaFormRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $deportistaId = $this->route('deportistum');
        
        return [
            'cedula' => 'required|string|size:10|regex:/^[0-9]{10}$/|unique:deportistas,cedula,' . $deportistaId . ',id_deportista',
            'nombre' => 'required|string|max:255',
            'apellido' => 'required|string|max:255',
            'correo' => 'required|email|max:255|unique:deportistas,correo,' . $deportistaId . ',id_deportista',
            'telefono' => 'required|string|size:10|regex:/^[0-9]{10}$/',
            'direccion' => 'required|string|max:255',
            'fecha_nacimiento' => 'required|date|before:today',
        ];
    }

    public function messages(): array
    {
        return [
            'cedula.required' => 'La cédula es obligatoria',
            'cedula.size' => 'La cédula debe tener exactamente 10 dígitos',
            'cedula.regex' => 'La cédula solo debe contener números',
            'cedula.unique' => 'Esta cédula ya está registrada',
            
            'nombre.required' => 'El nombre es obligatorio',
            'nombre.max' => 'El nombre no puede exceder 255 caracteres',
            
            'apellido.required' => 'El apellido es obligatorio',
            'apellido.max' => 'El apellido no puede exceder 255 caracteres',
            
            'correo.required' => 'El correo es obligatorio',
            'correo.email' => 'Ingresa un correo válido',
            'correo.unique' => 'Este correo ya está registrado',
            
            'telefono.required' => 'El teléfono es obligatorio',
            'telefono.size' => 'El teléfono debe tener exactamente 10 dígitos',
            'telefono.regex' => 'El teléfono solo debe contener números',
            
            'direccion.required' => 'La dirección es obligatoria',
            'direccion.max' => 'La dirección no puede exceder 255 caracteres',
            
            'fecha_nacimiento.required' => 'La fecha de nacimiento es obligatoria',
            'fecha_nacimiento.date' => 'Fecha inválida',
            'fecha_nacimiento.before' => 'La fecha de nacimiento debe ser anterior a hoy',
        ];
    }
}
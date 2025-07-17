<?php

namespace App\Http\Requests\Operator;

use Illuminate\Foundation\Http\FormRequest;

class ClassroomOperatorRequest extends FormRequest
{
    /**
     * Tentukan apakah pengguna berhak melakukan permintaan ini.
     */
    public function authorize(): bool
    {
        return auth()->check() && auth()->user()->hasRole('Operator');
    }

    /**
     * Aturan validasi untuk permintaan ini.
     */
    public function rules(): array
    {
        return [
            'academic_year_id' => [
                'required',
                'exists:academic_years,id', // Validasi berdasarkan ID, bukan nama
            ],
            'name' => [
                'required',
                'min:3',
                'max:255',
                'string',
            ],
        ];
    }

    /**
     * Label atribut untuk pesan error yang lebih ramah pengguna.
     */
    public function attributes(): array
    {
        return [
            'academic_year_id' => 'Tahun Ajaran',
            'name' => 'Nama Kelas',
        ];
    }
}

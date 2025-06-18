<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class DepartmentRequest extends FormRequest
{
    /**
     * Tentukan apakah user berhak mengakses request ini.
     */
    public function authorize(): bool
    {
        return auth()->check() && auth()->user()->hasRole('Admin');
    }

    /**
     * Aturan validasi untuk request ini.
     */
    public function rules(): array
    {
        return [
            'faculty_id' => ['required', 'exists:faculties,id'],
            'name'       => ['required', 'string', 'min:3', 'max:255'],
            'code'       => ['nullable', 'string', 'max:20'],
        ];
    }

    /**
     * Label atribut untuk pesan validasi.
     */
    public function attributes(): array
    {
        return [
            'faculty_id' => 'Fakultas',
            'name'       => 'Nama Program Studi',
            'code'       => 'Kode Program Studi',
        ];
    }

    /**
     * (Opsional) Pesan error custom.
     */
    public function messages(): array
    {
        return [
            'faculty_id.required' => 'Fakultas wajib dipilih.',
            'faculty_id.exists'   => 'Fakultas yang dipilih tidak valid.',
            'name.required'       => 'Nama program studi wajib diisi.',
            'name.min'            => 'Nama program studi minimal :min karakter.',
            'name.max'            => 'Nama program studi maksimal :max karakter.',
            'code.max'            => 'Kode program studi maksimal :max karakter.',
        ];
    }
}

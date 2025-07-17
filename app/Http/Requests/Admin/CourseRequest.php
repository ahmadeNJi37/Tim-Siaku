<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class CourseRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->check() && auth()->user()->hasRole('Admin');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'faculty_id' => [
                'required',
                'exists:faculties,id',
            ],
            'department_id' => [
                'required',
                'exists:departments,id',
            ],
            'teacher_id' => [
                'required',
                'exists:teachers,id',
            ],
            // academic_year_id DIHAPUS karena dikontrol dari controller
            'name' => [
                'required',
                'string',
                'min:3',
                'max:255',
            ],
            'credit' => [
                'required',
                'integer',
                'min:1',
            ],
            'semester' => [
                'required',
                'integer',
                'min:1',
            ],
        ];
    }

    /**
     * Custom attribute names for validation errors.
     */
    public function attributes(): array
    {
        return [
            'faculty_id' => 'Fakultas',
            'department_id' => 'Program Studi',
            'teacher_id' => 'Dosen',
            'name' => 'Nama Mata Kuliah',
            'credit' => 'Satuan Kredit Semester (SKS)',
            'semester' => 'Semester',
        ];
    }
}

<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use App\Models\Student;

class StudentRequest extends FormRequest
{
    public ?Student $studentModel = null;

    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
{
    $this->studentModel = $this->route('student'); // langsung ambil model dari binding
}

    public function rules(): array
    {
        $userId = $this->studentModel?->user?->id;

        return [
            'name'            => ['required', 'string', 'max:100'],
            'email'           => [
                'required',
                'email',
                'max:100',
                Rule::unique('users', 'email')->ignore($userId),
            ],
            'password'        => [$this->isMethod('post') ? 'required' : 'nullable', 'string', 'min:6'],
            'avatar'          => ['nullable', 'image', 'max:2048'],

            'faculty_id'      => ['required', 'numeric', 'exists:faculties,id'],
            'department_id'   => ['required', 'numeric', 'exists:departments,id'],
            'classroom_id'    => ['required', 'numeric', 'exists:classrooms,id'],
            'fee_group_id'    => ['required', 'numeric', 'exists:fee_groups,id'],
            'student_number'  => [
                'required',
                'string',
                'max:30',
                Rule::unique('students', 'student_number')->ignore($this->studentModel?->id),
            ],
            'semester'        => ['required', 'numeric', 'min:1'],
            'batch'           => ['required', 'numeric', 'min:2000', 'max:' . now()->year],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required'           => 'Nama wajib diisi.',
            'email.required'          => 'Email wajib diisi.',
            'email.email'             => 'Format email tidak valid.',
            'password.required'       => 'Password wajib diisi saat tambah mahasiswa.',
            'faculty_id.required'     => 'Fakultas wajib dipilih.',
            'department_id.required'  => 'Program Studi wajib dipilih.',
            'classroom_id.required'   => 'Kelas wajib dipilih.',
            'fee_group_id.required'   => 'Golongan UKT wajib dipilih.',
            'student_number.required' => 'Nomor pokok wajib diisi.',
            'semester.required'       => 'Semester wajib diisi.',
            'batch.required'          => 'Angkatan wajib diisi.',
        ];
    }
}
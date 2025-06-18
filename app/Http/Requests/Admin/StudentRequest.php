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
        // Ambil Student berdasarkan student_number dari route, untuk kebutuhan validasi update
        $studentNumber = $this->route('student');
        if ($studentNumber) {
            $this->studentModel = Student::where('student_number', $studentNumber)->with('user')->first();
        }
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

            'faculty_id'      => ['required', 'exists:faculties,id'],
            'department_id'   => ['required', 'exists:departments,id'],
            'classroom_id'    => ['required', 'exists:classrooms,id'],
            'fee_group_id'    => ['required', 'exists:fee_groups,id'],
            'student_number'  => [
                'required',
                'string',
                'max:30',
                Rule::unique('students', 'student_number')->ignore($this->studentModel?->id),
            ],
            'semester'        => ['required', 'integer', 'min:1'],
            'batch'           => ['required', 'integer', 'min:2000', 'max:' . now()->year],
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
            'fee_group_id.required'   => 'Golongan UKT wajib dipilih.',
            'student_number.required' => 'Nomor pokok wajib diisi.',
            'semester.required'       => 'Semester wajib diisi.',
            'batch.required'          => 'Angkatan wajib diisi.',
        ];
    }
}

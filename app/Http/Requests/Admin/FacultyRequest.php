<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class FacultyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check() && auth()->user()->hasRole('Admin');
    }

    public function rules(): array
    {
        return [
            'name' => [
                'required',
                'string',
                'min:3',
                'max:255',
            ],
            'logo' => [
                Rule::when($this->routeIs('admin.faculties.store'), [
                    'required',
                    'mimes:png,jpg,jpeg,webp',
                    'max:2048',
                ]),
                Rule::when($this->routeIs('admin.faculties.update'), [
                    'nullable',
                    'mimes:png,jpg,jpeg,webp',
                    'max:2048',
                ]),
            ],
        ];
    }

    public function attributes(): array
    {
        return [
            'name' => 'Nama',
            'logo' => 'Logo'
        ];
    }
}

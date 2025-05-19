<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;
use Spatie\Permission\Traits\HasRoles;

class UserSingleResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'avatar' => $this->avatar ? Storage::url($this->avatar) : null,
            'roles' => $this->resource->getRoleNames(), // ✅ Benar! Mengakses method dari model User
            'role_name' => $this->getRoleNames()->first(),
            'student' => $this->when($this->hasRole('student'), [
                'id' => $this->student?->id,
                'student_number' => $this->student?->student_number,
                'batch' => $this->student?->batch,
                'semester' => $this->student?->semester,
                'faculty' => [
                    'id' => $this->student?->faculty?->id,
                    'name' => $this->student?->faculty?->name,           
                ],
                'departement' => [
                    'id' => $this->student?->departement?->id,
                    'name' => $this->student?->departement?->name,           
                ],
                'classrom' => [
                    'id' => $this->student?->classroom?->id,
                    'name' => $this->student?->classroom?->name,           
                ],
                'fee_group' => [
                    'id' => $this->student?->fee_group?->id,
                    'group' => $this->student?->fee_group?->group,
                    'amount' => $this->student?->fee_group?->amount,           
                ],
            ]),
            'teacher' => $this->when($this->hasRole('Teacher'), [
                'id' => $this->teacher?->id,
                'teacher_number' => $this->teacher?->teacher_number,
                'academic_title' => $this->teacher?->academic_title,
                'faculty_id' => $this->teacher?->faculty_id,
                'departement_id' => $this->teacher?->departement_id,
            ]),
            'operator' => $this->when($this->hasRole('Operator'), [
                'id' => $this->operator?->id,
                'employee_number' => $this->operator?->employee_number,
                'faculty_id' => $this->operator?->faculty_id,
                'departement_id' => $this->operator?->departement_id,
            ]),
        ];
    }
}

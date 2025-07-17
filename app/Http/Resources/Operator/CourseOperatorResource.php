<?php

namespace App\Http\Resources\Operator;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CourseOperatorResource extends JsonResource
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
        'code' => $this->code,
        'name' => $this->name,
        'credit' => $this->credit,
        'semester' => $this->semester,
        'created_at' => $this->created_at,

        // ✅ Ambil nama dari relasi teacher->user->name
        'teacher_name' => optional($this->teacher?->user)->name ?? '-',

        'academicYear' => $this->whenLoaded('academicYear', function () {
            return [
                'id' => $this->academicYear?->id,
                'name' => $this->academicYear?->name,
            ];
        }),
    ];
}

}

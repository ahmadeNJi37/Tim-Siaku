<?php

namespace App\Http\Resources\Admin;

use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ClassroomStudentResource extends JsonResource
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
            'student_number' => $this->student_number,
            'created_at' => $this->created_at,
            'user' => $this->whenLoaded('user', value: [
                'id' => $this->user?->id,
                'name' => $this->user?->name,
                'avatar' => $this->user?->avatar ? Storage::url($this->user?->avatar) : null,
            ]),
            'classroom' => $this->whenLoaded('classroom', value: [
                'id' => $this->classroom?->id,
                'name' => $this->classroom?->name,

            ]),
        ];
    }
}

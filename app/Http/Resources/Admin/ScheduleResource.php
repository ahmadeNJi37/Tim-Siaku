<?php

namespace App\Http\Resources\Admin;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ScheduleResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'start_time' => $this->start_time ? Carbon::parse($this->start_time)->format('H:i') : null,
            'end_time' => $this->end_time ? Carbon::parse($this->end_time)->format('H:i') : null,
            // ✅ Gunakan ->name jika day_of_week adalah enum
            'day_of_week' => $this->day_of_week?->name ?? '-',
            'quota' => $this->quota,
            'taken_quota' => $this->taken_quota ?? 0,

            'faculty' => $this->whenLoaded('faculty', [
                'id' => $this->faculty?->id,
                'name' => $this->faculty?->name,
            ]),

            'department' => $this->whenLoaded('department', [
                'id' => $this->department?->id,
                'name' => $this->department?->name,
            ]),

            'course' => $this->whenLoaded('course', [
                'id' => $this->course?->id,
                'name' => $this->course?->name,
                'code' => $this->course?->code,
                'credit' => $this->course?->credit,
            ]),

            'classroom' => $this->whenLoaded('classroom', [
                'id' => $this->classroom?->id,
                'name' => $this->classroom?->name,
                'slug' => $this->classroom?->slug,
            ]),

            'academicYear' => $this->whenLoaded('academicYear', [
                'id' => $this->academicYear?->id,
                'name' => $this->academicYear?->name,
            ]),
        ];
    }
}

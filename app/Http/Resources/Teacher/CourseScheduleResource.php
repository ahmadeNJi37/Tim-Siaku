<?php

namespace App\Http\Resources\Teacher;

use App\Http\Resources\Admin\ScheduleResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CourseScheduleResource extends JsonResource
{
    /**
     * @param  \App\Models\Course  $this->resource
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'code' => $this->code,
            'name' => $this->name,
            'semester' => $this->semester,
            'credit' => $this->credit,
            'faculty' => $this->whenLoaded('faculty'),
            'department' => $this->whenLoaded('department'),
            'academic_year' => $this->whenLoaded('academicYear'),
            'schedules' => ScheduleResource::collection($this->whenLoaded('schedules')),
        ];
    }
}

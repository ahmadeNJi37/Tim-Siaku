<?php

namespace App\Models;

use App\Models\Faculty;
use App\Models\Teacher;
use App\Models\Department;
use App\Models\AcademicYear;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Course extends Model
{
    protected $fillable = [
        'faculty_id',
        'department_id',
        'teacher_id',
        'academic_year_id',
        'code',
        'name',
        'credit',
        'semester',
    ];

    public function faculty(): BelongsTo
    {
        return $this->belongsTo(related: Faculty::class);
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(related: Department::class);
    }

    public function teacher(): BelongsTo
    {
        return $this->belongsTo(related: Teacher::class);
    }

    public function academicYear(): BelongsTo
    {
        return $this->belongsTo(related: AcademicYear::class);
    }

    public function schedules(): HasMany
    {
        return $this->hasMany(related: Schedule::class);
    }

    public function attendances(): HasMany
    {
        return $this->hasMany(related: Attendance::class);
    }

    public function grades(): HasMany
    {
        return $this->hasMany(related: Grade::class);
    }
}

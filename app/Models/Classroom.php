<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

class Classroom extends Model
{
    protected $fillable = [
        'faculty_id',
        'department_id',
        'academic_year_id',
        'name',
        'slug',
    ];

    public function faculty(): BelongsTo
    {
        return $this->belongsTo(related: Faculty::class);
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(related: Department::class);
    }

    public function academicYear(): BelongsTo
    {
        return $this->belongsTo(related: AcademicYear::class);
    }

    public function students(): HasMany
    {
        return $this->hasMany(related: Student::class);
    }

    public function schedules(): HasMany
    {
        return $this->hasMany(related: Schedule::class);
    }

    public function courses(): HasManyThrough
    {
        return $this->hasManyThrough(
            related: Course::class,
            through: Schedule::class,
            firstKey:'classroom_id',
            secondKey: 'id',
            localKey: 'id',
            secondLocalKey: 'course_id',
        );
    }
}

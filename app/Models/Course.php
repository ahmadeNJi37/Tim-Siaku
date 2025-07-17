<?php

namespace App\Models;

use App\Models\Faculty;
use App\Models\Teacher;
use App\Models\Department;
use App\Models\AcademicYear;
use Illuminate\Database\Eloquent\Builder;
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

    // === Relationships ===
    public function faculty(): BelongsTo
    {
        return $this->belongsTo(Faculty::class);
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    public function teacher(): BelongsTo
    {
        return $this->belongsTo(Teacher::class);
    }

    public function academicYear(): BelongsTo
    {
        return $this->belongsTo(AcademicYear::class);
    }

    public function schedules(): HasMany
    {
        return $this->hasMany(Schedule::class);
    }

    public function attendances(): HasMany
    {
        return $this->hasMany(Attendance::class);
    }

    public function grades(): HasMany
    {
        return $this->hasMany(Grade::class);
    }

    // === Scopes ===

    public function scopeFilter(Builder $query, array $filters): void
    {
        $query->when($filters['search'] ?? null, function ($q, $search) {
            $q->where(function ($q) use ($search) {
                $q->where('name', 'REGEXP', $search)
                  ->orWhere('code', 'REGEXP', $search)
                  ->orWhereHas('teacher.user', function ($query) use ($search) {
                      $query->where('name', 'REGEXP', $search)
                            ->orWhere('email', 'REGEXP', $search);
                  })
                  ->orWhereHas('faculty', function ($query) use ($search) {
                      $query->where('name', 'REGEXP', $search);
                  })
                  ->orWhereHas('department', function ($query) use ($search) {
                      $query->where('name', 'REGEXP', $search);
                  });
            });
        });
    }

    public function scopeSorting(Builder $query, array $sorts): void
    {
        $query->when(($sorts['field'] ?? null) && ($sorts['direction'] ?? null), function ($query) use ($sorts) {
            match ($sorts['field']) {
                'faculty_id' => $query->join('faculties', 'courses.faculty_id', '=', 'faculties.id')
                    ->orderBy('faculties.name', $sorts['direction']),
                'department_id' => $query->join('departments', 'courses.department_id', '=', 'departments.id')
                    ->orderBy('departments.name', $sorts['direction']),
                'teacher_id' => $query
                    ->leftJoin('teachers', 'teachers.id', '=', 'courses.teacher_id')
                    ->leftJoin('users', 'users.id', '=', 'teachers.user_id')
                    ->orderBy('users.name', $sorts['direction']),
                default => $query->orderBy($sorts['field'], $sorts['direction']),
            };
        });
    }
}

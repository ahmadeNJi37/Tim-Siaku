<?php

namespace App\Models;

use Cviebrock\EloquentSluggable\Sluggable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

class Classroom extends Model
{
    use Sluggable;
    protected $fillable = [
        'faculty_id',
        'department_id',
        'academic_year_id',
        'name',
        'slug',
    ];

    public function sluggable(): array
    {
        return [
            'slug' => [
                'source' => 'name',
            ],
        ];
    }

    public function faculty(): BelongsTo
    {
        return $this->belongsTo(Faculty::class);
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    public function academicYear(): BelongsTo
    {
        return $this->belongsTo(AcademicYear::class);
    }

    public function students(): HasMany
    {
        return $this->hasMany(Student::class);
    }

    public function schedules(): HasMany
    {
        return $this->hasMany(Schedule::class);
    }

    public function courses(): HasManyThrough
    {
        return $this->hasManyThrough(
            Course::class,
            Schedule::class,
            'classroom_id',
            'id',
            'id',
            'course_id'
        );
    }

    public function scopeFilter(Builder $query, array $filter): void
    {
        $query->when($filter['search'] ?? null, function ($query, $search) {
            $query->where(function ($query) use ($search) {
                $query->where('name', 'like', "%$search%")
                      ->orWhereHas('faculty', fn ($q) => $q->where('name', 'like', "%$search%"))
                      ->orWhereHas('department', fn ($q) => $q->where('name', 'like', "%$search%"))
                      ->orWhereHas('academicYear', fn ($q) => $q->where('name', 'like', "%$search%"));
            });
        });
    }

    public function scopeSorting(Builder $query, array $sorts): void
    {
        $field = $sorts['field'] ?? null;
        $direction = $sorts['direction'] ?? 'asc';

        if (!$field || !$direction) {
            return;
        }

        switch ($field) {
            case 'faculty_id':
                $query->join('faculties', 'faculties.id', '=', 'classrooms.faculty_id')
                      ->orderBy('faculties.name', $direction)
                      ->select('classrooms.*');
                break;

            case 'department_id':
                $query->join('departments', 'departments.id', '=', 'classrooms.department_id')
                      ->orderBy('departments.name', $direction)
                      ->select('classrooms.*');
                break;

            case 'academic_year_id':
                $query->join('academic_years', 'academic_years.id', '=', 'classrooms.academic_year_id')
                      ->orderBy('academic_years.name', $direction)
                      ->select('classrooms.*');
                break;

            default:
                $query->orderBy($field, $direction);
                break;
        }
    }
}

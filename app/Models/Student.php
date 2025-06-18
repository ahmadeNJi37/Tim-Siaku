<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Student extends Model
{
    // Kolom yang bisa diisi secara mass-assignment
    protected $fillable = [
        'user_id',
        'faculty_id',
        'department_id',
        'classroom_id',
        'fee_group_id',
        'student_number',
        'semester',
        'batch',
    ];

    // Otomatis eager load relasi penting (hindari N+1 query problem)
    protected $with = ['user', 'faculty', 'department', 'classroom', 'feeGroup'];

    // Gunakan student_number untuk route model binding
    public function getRouteKeyName(): string
    {
        return 'student_number';
    }

    /** =======================
     *     RELATIONSHIPS
     *  =======================
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function faculty(): BelongsTo
    {
        return $this->belongsTo(Faculty::class);
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    public function classroom(): BelongsTo
    {
        return $this->belongsTo(Classroom::class);
    }

    public function feeGroup(): BelongsTo
    {
        return $this->belongsTo(FeeGroup::class);
    }

    public function attendances(): HasMany
    {
        return $this->hasMany(Attendance::class);
    }

    public function grades(): HasMany
    {
        return $this->hasMany(Grade::class);
    }

    public function studyPlans(): HasMany
    {
        return $this->hasMany(StudyPlan::class);
    }

    public function studyResults(): HasMany
    {
        return $this->hasMany(StudyResult::class);
    }

    /** =======================
     *         SCOPES
     *  =======================
     */
    public function scopeFilter(Builder $query, array $filters): void 
    {
        $query->when($filters['search'] ?? null, function ($query, $search) {
            $query->where(function ($query) use ($search) {
                $query->where('student_number', 'REGEXP', $search)
                    ->orWhere('semester', 'REGEXP', $search)
                    ->orWhere('batch', 'REGEXP', $search)
                    ->orWhereHas('user', fn ($q) => 
                        $q->where('name', 'REGEXP', $search)
                          ->orWhere('email', 'REGEXP', $search))
                    ->orWhereHas('faculty', fn ($q) => 
                        $q->where('name', 'REGEXP', $search))
                    ->orWhereHas('department', fn ($q) => 
                        $q->where('name', 'REGEXP', $search));
            });
        });
    }

    public function scopeSorting(Builder $query, array $sorts): void
    {
        $field = $sorts['field'] ?? null;
        $direction = $sorts['direction'] ?? null;

        if ($field && $direction) {
            match ($field) {
                'faculty_id' => $query->join('faculties', 'students.faculty_id', '=', 'faculties.id')
                                      ->orderBy('faculties.name', $direction),
                'department_id' => $query->join('departments', 'students.department_id', '=', 'departments.id')
                                         ->orderBy('departments.name', $direction),
                'name' => $query->join('users', 'students.user_id', '=', 'users.id')
                                ->orderBy('users.name', $direction),
                'email' => $query->join('users', 'students.user_id', '=', 'users.id')
                                 ->orderBy('users.email', $direction),
                'fee_group_id' => $query->join('fee_groups', 'students.fee_group_id', '=', 'fee_groups.id')
                                        ->orderBy('fee_groups.group', $direction),
                'classroom_id' => $query->join('classrooms', 'students.classroom_id', '=', 'classrooms.id')
                                        ->orderBy('classrooms.name', $direction),
                default => $query->orderBy($field, $direction)
            };
        }
    }
}

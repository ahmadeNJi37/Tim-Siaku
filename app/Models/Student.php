<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Student extends Model
{
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

    public function user(): BelongsTo
    {
        return $this->belongsTo(related: User::class);
    }
    
    public function faculty(): BelongsTo
    {
        return $this->belongsTo(related: Faculty::class);
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(related: Department::class);
    }

    public function classroom(): BelongsTo
    {
        return $this->belongsTo(related: Classroom::class);
    }

    public function feeGroup(): BelongsTo
    {
        return $this->belongsTo(related: FeeGroup::class);
    }

    public function attendances(): HasMany
    {
        return $this->hasMany(related: attendance::class);
    }

    public function grades(): HasMany
    {
        return $this->hasMany(related: Grade::class);
    }

    public function studyPlans(): HasMany
    {
        return $this->hasMany(related: StudyPlan::class);
    }

    public function studyResults(): HasMany
    {
        return $this->hasMany(related: StudyResult::class);
    }
}

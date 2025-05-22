<?php

namespace App\Models;

use App\Models\Student;
use App\Models\AcademicYear;
use App\Models\StudyResultGrade;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StudyResult extends Model
{
    protected $fillable = [
        'student_id',
        'academic_year_id',
        'semester',
        'gpa',
    ];

    public function student(): BelongsTo
    {
        return $this->belongsTo(related: Student::class);
    }

    public function academicYear(): BelongsTo
    {
        return $this->belongsTo(related: AcademicYear::class);
    }

    public function grades(): HasMany
    {
        return $this->hasMany(related: StudyResultGrade::class);
    }
}

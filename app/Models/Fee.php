<?php

namespace App\Models;

use App\Enums\FeeStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Fee extends Model
{
    protected $fillable = [
        'fee_code',
        'student_id',
        'fee_group_id',
        'academic_year_id',
        'semester',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'status' => FeeStatus::class,
        ];
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(related: Student::class);
    }

    public function feeGroup(): BelongsTo
    {
        return $this->belongsTo(related: FeeGroup::class);
    }

    public function academicYear(): BelongsTo
    {
        return $this->belongsTo(related: AcademicYear::class);
    }

}

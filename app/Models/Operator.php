<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Operator extends Model
{
    protected $fillable = [
        'user_id',
        'faculty_id',
        'department_id',
        'employee_number',
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
}

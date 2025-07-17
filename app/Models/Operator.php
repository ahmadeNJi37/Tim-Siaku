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

    // Relasi
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

    // ✅ Scope: Filter pencarian
    public function scopeFilter($query, array $filters): void
    {
        $query->when($filters['search'] ?? false, function ($query, $search) {
            $query->where(function ($query) use ($search) {
                $query->where('employee_number', 'like', "%{$search}%")
                      ->orWhereHas('user', function ($q) use ($search) {
                          $q->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                      });
            });
        });
    }

    // ✅ Scope: Sorting dinamis
    public function scopeSorting($query, array $sorts): void
    {
        $field = $sorts['field'] ?? null;
        $direction = $sorts['direction'] ?? 'asc';

        // Sorting by related user fields
        if ($field === 'name' || $field === 'email') {
            $query->join('users', 'operators.user_id', '=', 'users.id')
                  ->orderBy("users.$field", $direction)
                  ->select('operators.*'); // Hindari ambil semua kolom users
        } else {
            $query->when($field, fn($q) => $q->orderBy($field, $direction));
        }
    }
}

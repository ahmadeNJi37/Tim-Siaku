<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FeeGroup extends Model
{
    use HasFactory;

    protected $fillable = [
        'group',
        'amount',
    ];

   
    public function scopeFilter(Builder $query, array $filters): void
    {
        $query->when($filters['search'] ?? null, function ($query, $search) {
            $query->where(function ($q) use ($search) {
                $q->where('group', 'REGEXP', $search)
                  ->orWhere('amount', 'REGEXP', $search);
            });
        });
    }

   
    public function scopeSorting(Builder $query, array $sorts): void
    {
        $query->when(
            ($sorts['field'] ?? null) && ($sorts['direction'] ?? null),
            function ($query) use ($sorts) {
                $allowed = ['group', 'amount', 'created_at', 'updated_at'];
                $field = $sorts['field'];
                $direction = strtolower($sorts['direction']) === 'desc' ? 'desc' : 'asc';
                if (in_array($field, $allowed, true)) {
                    $query->orderBy($field, $direction);
                }
            }
        );
    }
}

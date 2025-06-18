<?php

namespace App\Models;

use App\Enums\AcademicYearSemester;
use Cviebrock\EloquentSluggable\Sluggable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class AcademicYear extends Model
{
    use Sluggable; // ✅ tambahkan titik koma

    protected $fillable = [
        'name',
        'slug',
        'start_date',
        'end_date',
        'semester',
        'is_active',
    ];

    public function sluggable(): array
    {
        return [
            'slug' => [
                'source' => 'name',
            ],
        ]; // ✅ ganti koma di akhir array jadi titik koma
    }

    protected $casts = [
        'semester' => AcademicYearSemester::class,
        'is_active' => 'boolean',
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    public function scopeFilter(Builder $query, array $filters): void
    {
        $query->when($filters['search'] ?? null, function ($query, $search) {
            $query->whereAny([
                'name',
                'semester',
            ], 'REGEXP', $search);
        }); // ✅ tambahkan kurung tutup di sini
    }

    public function scopeSorting(Builder $query, array $sorts): void
    {
        $query->when(($sorts['field'] ?? null) && ($sorts['direction'] ?? null), function ($query) use ($sorts) {
            $query->orderBy($sorts['field'], $sorts['direction']);
        });
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }
}

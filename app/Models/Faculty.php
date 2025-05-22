<?php

namespace App\Models;

use App\Models\Student;
use App\Models\Department;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Faculty extends Model
{
    
    use HasFactory;

    protected $fillable = [
        'name',
        'code',
        'logo',
        'slug',
    ];

    protected function code(): Attribute
    {
        return Attribute::make(
            get: fn(string $value) => strtoupper($value),
            set: fn(string $value) => strtolower($value),
        );
    }

    public function departments(): HasMany
    {
        return $this->hasMany(related: Department::class);
    }

    public function students(): HasMany
    {
        return $this->hasMany(related: Student::class);
    }
}

<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Route;
use App\Models\Student;

class RouteServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        // Custom binding: student berdasarkan student_number
        Route::bind('student', function ($value) {
            return Student::where('student_number', $value)->firstOrFail();
        });
    }
}

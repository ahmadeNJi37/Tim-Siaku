<?php

use App\Http\Controllers\Admin\DashboardAdminController;
use App\Http\Controllers\Operator\DashboardOperatorController;
use App\Http\Controllers\Teacher\DashboardTeacherController;
use Illuminate\Support\Facades\Route;



Route::prefix('teachers')->group(function (){

    Route::get('dashboard', DashboardTeacherController::class)->name('teacher.dashboard');
});
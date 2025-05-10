<?php

use App\Http\Controllers\Admin\DashboardAdminController;
use App\Http\Controllers\Operator\DashboardOperatorController;
use Illuminate\Support\Facades\Route;



Route::prefix('operators')->group(function (){

    Route::get('dashboard', DashboardOperatorController::class)->name('operator.dashboard');
});
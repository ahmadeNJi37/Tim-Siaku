<?php

use App\Http\Controllers\Admin\DashboardAdminController;
use App\Http\Controllers\Admin\DepartmentController;
use App\Http\Controllers\Admin\FacultyController;
use App\Http\Controllers\Admin\AcademicYearController;
use App\Http\Controllers\Admin\ClassroomController;
use App\Http\Controllers\Admin\ClassroomStudentController;
use App\Http\Controllers\Admin\CourseController;
use App\Http\Controllers\Admin\FeeGroupController;
use App\Http\Controllers\Admin\OperatorController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\StudentController;
use App\Http\Controllers\Admin\TeacherController;
use App\Http\Controllers\Admin\ScheduleController;
use App\Http\Controllers\Admin\FeeController;
use Illuminate\Support\Facades\Route;

Route::prefix('admin')->middleware(['auth', 'role:Admin'])->group(function () {
    Route::get('dashboard', DashboardAdminController::class)->name('admin.dashboard');

    Route::controller(FacultyController::class)->group(function () {
        Route::get('faculties', 'index')->name('admin.faculties.index');
        Route::get('faculties/create', 'create')->name('admin.faculties.create');
        Route::post('faculties', 'store')->name('admin.faculties.store');
        Route::get('faculties/{faculty:slug}/edit', 'edit')->name('admin.faculties.edit');
        Route::put('faculties/{faculty:slug}', 'update')->name('admin.faculties.update');
        Route::delete('faculties/{faculty:slug}', 'destroy')->name('admin.faculties.destroy');
    });

    Route::controller(DepartmentController::class)->group(function () {
        Route::get('departments', 'index')->name('admin.departments.index');
        Route::get('departments/create', 'create')->name('admin.departments.create');
        Route::post('departments', 'store')->name('admin.departments.store');
        Route::get('departments/{department:slug}/edit', 'edit')->name('admin.departments.edit');
        Route::put('departments/{department:slug}', 'update')->name('admin.departments.update');
        Route::delete('departments/{department:slug}', 'destroy')->name('admin.departments.destroy');
    });

    Route::controller(AcademicYearController::class)->group(function () {
        Route::get('academic-years', 'index')->name('admin.academic-years.index');
        Route::get('academic-years/create', 'create')->name('admin.academic-years.create');
        Route::post('academic-years', 'store')->name('admin.academic-years.store'); // ✅ diperbaiki
        Route::get('academic-years/{academicYear:slug}/edit', 'edit')->name('admin.academic-years.edit');
        Route::put('academic-years/{academicYear:slug}', 'update')->name('admin.academic-years.update');
        Route::delete('academic-years/{academicYear:slug}', 'destroy')->name('admin.academic-years.destroy');
    });

     Route::controller(ClassroomController::class)->group(function () {
        Route::get('classrooms', 'index')->name('admin.classrooms.index');
        Route::get('classrooms/create', 'create')->name('admin.classrooms.create');
        Route::post('classrooms', 'store')->name('admin.classrooms.store'); // ✅ diperbaiki
        Route::get('classrooms/{classroom:slug}/edit', 'edit')->name('admin.classrooms.edit');
        Route::put('classrooms/{classroom:slug}', 'update')->name('admin.classrooms.update');
        Route::delete('classrooms/{classroom:slug}', 'destroy')->name('admin.classrooms.destroy');
    });

    Route::controller(RoleController::class)->group(function () {
        Route::get('roles', 'index')->name('admin.roles.index');
        Route::get('roles/create', 'create')->name('admin.roles.create');
        Route::post('roles', 'store')->name('admin.roles.store'); // ✅ diperbaiki
        Route::get('roles/{role}/edit', 'edit')->name('admin.roles.edit');
        Route::put('roles/{role}', 'update')->name('admin.roles.update');
        Route::delete('roles/{role}', 'destroy')->name('admin.roles.destroy');
    });

    Route::controller(FeeGroupController::class)->group(function () {
        Route::get('fee_groups', 'index')->name('admin.fee_groups.index');
        Route::get('fee_groups/create', 'create')->name('admin.fee_groups.create');
        Route::post('fee_groups', 'store')->name('admin.fee_groups.store'); // ✅ diperbaiki
        Route::get('fee_groups/{feeGroup}/edit', 'edit')->name('admin.fee_groups.edit');
        Route::put('fee_groups/{feeGroup}', 'update')->name('admin.fee_groups.update');
        Route::delete('fee_groups/{feeGroup}', 'destroy')->name('admin.fee_groups.destroy');
    });

    Route::controller(StudentController::class)->group(function () {
        Route::get('students', 'index')->name('admin.students.index');
        Route::get('students/create', 'create')->name('admin.students.create');
        Route::post('students', 'store')->name('admin.students.store'); // ✅ diperbaiki
// Gunakan student_number untuk binding
    Route::get('students/{student:student_number}/edit', 'edit')->name('admin.students.edit');
    Route::put('students/{student:student_number}', 'update')->name('admin.students.update');
    Route::delete('students/{student:student_number}', 'destroy')->name('admin.students.destroy');
    });

    Route::controller(ClassroomStudentController::class)->group(function () {
    Route::get('classrooms/students/{classroom:slug}', 'index')->name('admin.classroom-students.index');
    Route::put('classrooms/students/{classroom:slug}/sync', 'sync')->name('admin.classroom-students.sync');
    Route::delete('classrooms/{classroom:slug}/students/{student:student_number}', 'destroy')->name('admin.classroom-students.destroy');
});

Route::controller(TeacherController::class)->group(function () {
        Route::get('teachers', 'index')->name('admin.teachers.index');
        Route::get('teachers/create', 'create')->name('admin.teachers.create');
        Route::post('teachers', 'store')->name('admin.teachers.store'); // ✅ diperbaiki
        Route::get('teachers/{teacher:teacher_number}/edit', 'edit')->name('admin.teachers.edit');
        Route::put('teachers/{teacher:teacher_number}', 'update')->name('admin.teachers.update');
        Route::delete('teachers/{teacher:teacher_number}', 'destroy')->name('admin.teachers.destroy');
        });

     Route::controller(OperatorController::class)->group(function () {
        Route::get('operators', 'index')->name('admin.operators.index');
        Route::get('operators/create', 'create')->name('admin.operators.create');
        Route::post('operators', 'store')->name('admin.operators.store'); // ✅ diperbaiki
        Route::get('operators/{operator:employee_number}/edit', 'edit')->name('admin.operators.edit');
        Route::put('operators/{operator:employee_number}', 'update')->name('admin.operators.update');
        Route::delete('operators/{operator:employee_number}', 'destroy')->name('admin.operators.destroy');
        });
     Route::controller(CourseController::class)->group(function () {
        Route::get('courses', 'index')->name('admin.courses.index');
        Route::get('courses/create', 'create')->name('admin.courses.create');
        Route::post('courses', 'store')->name('admin.courses.store'); // ✅ diperbaiki
        Route::get('courses/{course:code}/edit', 'edit')->name('admin.courses.edit');
        Route::put('courses/{course:code}', 'update')->name('admin.courses.update');
        Route::delete('courses/{course:code}', 'destroy')->name('admin.courses.destroy');
        });

     Route::controller(ScheduleController::class)->group(function () {
        Route::get('schedules', 'index')->name('admin.schedules.index');
        Route::get('schedules/create', 'create')->name('admin.schedules.create');
        Route::post('schedules', 'store')->name('admin.schedules.store'); // ✅ diperbaiki
        Route::get('schedules/{schedule}/edit', 'edit')->name('admin.schedules.edit');
        Route::put('schedules/{schedule}', 'update')->name('admin.schedules.update');
        Route::delete('schedules/{schedule}', 'destroy')->name('admin.schedules.destroy');
        });

    Route::get('fees', FeeController::class)->name('admin.fees.index');

});

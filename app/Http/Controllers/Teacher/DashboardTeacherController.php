<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\Classroom;
use App\Models\Course;
use App\Models\Schedule;
use Illuminate\Http\Request;
use Inertia\Response;

class DashboardTeacherController extends Controller
{
   public function __invoke(): \Inertia\Response
{
    $user = auth()->user()->load('teacher');
    $teacher = $user->teacher;

    // 🛑 Jika relasi teacher tidak ditemukan
    if (!$teacher) {
        abort(403, 'Akun Anda belum terhubung dengan data guru.');
    }

    return inertia('Teachers/Dashboard', [
        'page_setting' => [
            'title' => 'Dashboard',
            'subtitle' => 'Menampilkan semua statistik pada platform ini',
        ],
        'count' => [
            'courses' => Course::where('teacher_id', $teacher->id)->count(),
            'classrooms' => Classroom::whereHas('schedules.course', fn ($q) => $q->where('teacher_id', $teacher->id))->count(),
            'schedules' => Schedule::whereHas('course', fn ($q) => $q->where('teacher_id', $teacher->id))->count(),
        ],
    ]);
}
}
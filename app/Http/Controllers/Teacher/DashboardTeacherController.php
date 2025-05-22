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
    public function __invoke(): Response
    {
        return inertia('Teachers/Dashboard', [
            'page_settings' => [
                'title' => 'Dashboard',
                'subtitle' => 'Menampilkan semua statistik pada platform ini',
            ],
            'count' => [
                // Hitung jumlah matakuliah milik guru ini
                'courses' => Course::query()
                ->where('teacher_id', auth()->user()->teacher->id)
                ->count(),

                // Hitung jumlah jadwal milik guru ini lalu ambil distinct classroom_id-nya
                'classrooms' => Classroom::query()
                ->whereHas('schedules.course', fn ($query) => $query->where('teacher_id', auth()->user()->teacher->id))
                ->count(),

                // Hitung jumlah jadwal mengajar guru ini
                'schedules' => Schedule::query()
                ->whereHas('course', fn ($query) => $query->where('teacher_id', auth()->user()->teacher->id))
                ->count(),
            ],
        ]);
    }
}

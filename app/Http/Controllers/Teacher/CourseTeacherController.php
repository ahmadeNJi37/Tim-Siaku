<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Http\Resources\Teacher\CourseScheduleResource;
use App\Http\Resources\Teacher\CourseTeacherResource;
use App\Models\Course;
use Illuminate\Http\Request;
use Inertia\Response;

use function App\Helpers\activeAcademicYear;

class CourseTeacherController extends Controller
{
   public function index(): Response
{
    $user = auth()->user();

    // Pastikan relasi teacher tersedia
    if (!$user->teacher) {
        return inertia('Teachers/Courses/Index', [
            'page_setting' => [
                'title' => 'Mata Kuliah',
                'subtitle' => 'Menampilkan semua data mata kuliah yang anda ampu',
            ],
            'courses' => [],
            'state' => [],
            'error' => 'User tidak memiliki relasi teacher',
        ]);
    }

    $courses = Course::query()
        ->where('teacher_id', $user->teacher->id)
        ->where('academic_year_id', activeAcademicYear()->id)
        ->filter(request()->only(['search']))
        ->sorting(request()->only(['field', 'direction']))
        ->with(['faculty', 'department', 'schedules'])
        ->paginate(request()->load ?? 9);

    return inertia('Teachers/Courses/Index', [
        'page_setting' => [
            'title' => 'Mata Kuliah',
            'subtitle' => 'Menampilkan semua data mata kuliah yang anda ampu',
        ],
        'courses' => CourseTeacherResource::collection($courses)->additional([
            'meta' => [
                'has_pages' => $courses->hasPages(),
                'from' => $courses->firstItem(),
                'to' => $courses->lastItem(),
                'total' => $courses->total(),
                'current_page' => $courses->currentPage(),
                'per_page' => $courses->perPage(),
            ],
            'links' => $courses->linkCollection(),
        ]),
        'state' => [
            'page' => request()->page ?? 1,
            'search' => request()->search ?? '',
            'load' => request()->load ?? 9,
        ],
    ]);
}

public function show(Course $course): Response
    {
        return inertia('Teachers/Courses/Show',  [
            'page_setting' => [
                'title' => $course->name,
                'subtitle' => 'Menampilkan detail mata kuliah',
            ],
            'course' => new CourseScheduleResource($course->load([ 'faculty', 'department', 'academicYear',  'schedules', ]))
        ]);
    }

}

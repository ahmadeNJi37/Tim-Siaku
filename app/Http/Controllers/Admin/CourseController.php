<?php

namespace App\Http\Controllers\Admin;

use App\Enums\MessageType;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\CourseRequest;
use App\Http\Resources\Admin\CourseResource;
use App\Models\Course;
use App\Models\Department;
use App\Models\Faculty;
use App\Models\Teacher;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Response;
use Illuminate\Support\Str;
use Throwable;

use function App\Helpers\activeAcademicYear;
use function App\Helpers\flashMessage;
use function Pest\Laravel\delete;

class CourseController extends Controller
{
    public function index(): Response
    {
        $courses = Course::query()
            ->select([
                'courses.id',
                'courses.faculty_id',
                'courses.department_id',
                'courses.teacher_id',
                'courses.academic_year_id',
                'courses.code',
                'courses.name',
                'courses.credit',
                'courses.semester',
                'courses.created_at',
            ])
            ->filter(request()->only(['search']))
            ->sorting(request()->only(['field', 'direction']))
            ->with(['faculty', 'department', 'teacher.user', 'academicYear'])
            ->paginate(request()->load ?? 10);

        return inertia('Admin/Courses/Index', [
            'page_setting' => [
                'title' => 'Mata Kuliah',
                'subtitle' => 'Menampilkan semua data mata kuliah yang tersedia pada universitas ini',
            ],
            'courses' => CourseResource::collection($courses)->additional([
                'meta' => [
                    'has_pages' => $courses->hasPages(),
                    'current_page' => $courses->currentPage(),
                    'per_page' => $courses->perPage(),
                    'from' => $courses->firstItem(),
                    'to' => $courses->lastItem(),
                    'total' => $courses->total(),
                ],
                'links' => $courses->linkCollection(),
            ]),
            'state' => [
                'page' => request()->page ?? 1,
                'search' => request()->search ?? '',
                'load' => request()->load ?? 10,
                'field' => request()->field ?? '',
                'direction' => request()->direction ?? '',
            ],
        ]);
    }

    public function create(): Response
    {
        return inertia('Admin/Courses/Create', [
            'page_setting' => [
                'title' => 'Tambah data mata kuliah',
                'subtitle' => 'Buat mata kuliah baru di sini. Klik simpan setelah selesai.',
                'method' => 'POST',
                'action' => route('admin.courses.store'),
            ],
            'faculties' => Faculty::select(['id', 'name'])->orderBy('name')->get()->map(fn($item) => [
                'value' => $item->id,
                'label' => $item->name,
            ]),
            'departments' => Department::select(['id', 'name'])->orderBy('name')->get()->map(fn($item) => [
                'value' => $item->id,
                'label' => $item->name,
            ]),
            'teachers' => Teacher::with('user.roles')
                ->get()
                ->filter(fn($item) => $item->user !== null && $item->user->roles->contains('name', 'Teacher'))
                ->map(fn($item) => [
                    'value' => $item->id,
                    'label' => $item->user->name,
                ])
                ->values(),
        ]);
    }

    public function store(CourseRequest $request): RedirectResponse
    {
        try {
            $activeYear = activeAcademicYear();

            if (!$activeYear) {
                flashMessage('Tahun akademik aktif tidak ditemukan.', 'error');
                return back();
            }

            Course::create([
                'faculty_id' => $request->faculty_id,
                'department_id' => $request->department_id,
                'teacher_id' => $request->teacher_id,
                'academic_year_id' => $activeYear->id,
                'code' => Str::upper(Str::random(6)),
                'name' => $request->name,
                'credit' => $request->credit,
                'semester' => $request->semester,
            ]);

            flashMessage(MessageType::CREATED->message('Mata kuliah'));
            return to_route('admin.courses.index');
        } catch (Throwable $e) {
            flashMessage(MessageType::ERROR->message($e->getMessage()), 'error');
            return back();
        }
    }

     public function edit(Course $course): Response
    {
        return inertia('Admin/Courses/Edit', [
            'page_setting' => [
                'title' => 'Edit data mata kuliah',
                'subtitle' => 'Edit mata kuliah baru di sini. Klik simpan setelah selesai.',
                'method' => 'PUT',
                'action' => route('admin.courses.update', $course),
            ],
            'course' => $course,
            'faculties' => Faculty::select(['id', 'name'])->orderBy('name')->get()->map(fn($item) => [
                'value' => $item->id,
                'label' => $item->name,
            ]),
            'departments' => Department::select(['id', 'name'])->orderBy('name')->get()->map(fn($item) => [
                'value' => $item->id,
                'label' => $item->name,
            ]),
            'teachers' => Teacher::with('user.roles')
                ->get()
                ->filter(fn($item) => $item->user !== null && $item->user->roles->contains('name', 'Teacher'))
                ->map(fn($item) => [
                    'value' => $item->id,
                    'label' => $item->user->name,
                ])
                ->values(),
        ]);
    }

    public function update(Course $course, CourseRequest $request): RedirectResponse
    {
        try {
            $activeYear = activeAcademicYear();

            if (!$activeYear) {
                flashMessage('Tahun akademik aktif tidak ditemukan.', 'error');
                return back();
            }

            $course->update([
                'faculty_id' => $request->faculty_id,
                'department_id' => $request->department_id,
                'teacher_id' => $request->teacher_id,
                'name' => $request->name,
                'credit' => $request->credit,
                'semester' => $request->semester,
            ]);

            flashMessage(MessageType::UPDATED->message('Mata kuliah'));
            return to_route('admin.courses.index');
        } catch (Throwable $e) {
            flashMessage(MessageType::ERROR->message($e->getMessage()), 'error');
            return back();
        }
    }

    public function destroy(Course $course): RedirectResponse
    {
        try {
            $course->delete();
            flashMessage(MessageType::DELETED->message('Mata Kuliah'));
            return to_route('admin.courses.index');
        } catch (Throwable $e) {
            flashMessage(MessageType::ERROR->message($e->getMessage()), 'error');
            return back();
        }
    }
}

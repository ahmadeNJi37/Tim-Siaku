<?php

namespace App\Http\Controllers\Operator;

use App\Enums\MessageType;
use App\Http\Controllers\Controller;
use App\Http\Requests\Operator\CourseOperatorRequest;
use App\Http\Resources\Operator\CourseOperatorResource;
use App\Models\Course;
use App\Models\Teacher;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Response;
use Throwable;

use function App\Helpers\activeAcademicYear;
use function App\Helpers\flashMessage;

class CourseOperatorController extends Controller
{
    public function index(): Response
    {
        $operator = auth()->user()->operator;

        if (!$operator) {
            abort(403, 'Data operator tidak ditemukan. Pastikan akun Anda adalah operator.');
        }

        $courses = Course::query()
            ->select([
                'courses.id', 'courses.faculty_id', 'courses.department_id',
                'courses.teacher_id', 'courses.code', 'courses.name',
                'courses.credit', 'courses.semester', 'courses.created_at'
            ])
            ->filter(request()->only(['search']))
            ->sorting(request()->only(['field', 'direction']))
            ->where('courses.faculty_id', $operator->faculty_id)
            ->where('courses.department_id', $operator->department_id)
            ->with(['teacher.user', 'academicYear']) // ✅ perbaikan disini
            ->paginate(request()->load ?? 10);

        return inertia('Operators/Courses/Index', [
            'page_setting' => [
                'title' => 'Mata Kuliah',
                'subtitle' => 'Menampilkan semua data mata kuliah yang tersedia'
            ],
            'courses' => CourseOperatorResource::collection($courses)->additional([
                'meta' => [
                    'has_pages' => $courses->hasPages(),
                ],
            ]),
            'state' => [
                'page' => request()->page ?? 1,
                'search' => request()->search ?? '',
                'load' => request()->load ?? 10,
            ],
        ]);
    }

    public function create(): Response
    {
        return inertia('Operators/Courses/Create', [
            'page_setting' => [
                'title' => 'Tambah Mata Kuliah',
                'subtitle' => 'Buat mata kuliah di sini. Klik simpan setelah selesai',
                'method' => 'POST',
                'action' => route('operators.courses.store'),
            ],
            'teachers' => Teacher::query()
                ->select(['id', 'user_id'])
                ->whereHas('user', function($query) {
                    $query->whereHas('roles', function($query) {
                        $query->where('name', 'Teacher');
                    });
                })
                ->where('faculty_id', auth()->user()->operator->faculty_id)
                ->where('department_id', auth()->user()->operator->department_id)
                ->with(['user'])
                ->get()
                ->map(function($item) {
                    return [
                        'value' => $item->id,
                        'label' => $item->user->name,
                    ];
                }),
        ]);
    }

    public function store(CourseOperatorRequest $request): RedirectResponse
    {
        try {
            Course::create([
                'faculty_id' => auth()->user()->operator->faculty_id,
                'department_id' => auth()->user()->operator->department_id,
                'teacher_id' => $request->teacher_id,
                'academic_year_id' => activeAcademicYear()->id,
                'code' => str()->random(6),
                'name' => $request->name,
                'credit' => $request->credit,
                'semester' => $request->semester,
            ]);

            flashMessage(MessageType::CREATED->message('Mata Kuliah'));
            return to_route('operators.courses.index');
        } catch (Throwable $e) {
            flashMessage(MessageType::ERROR->message(error: $e->getMessage()), 'error');
            return to_route('operators.courses.index');
        }
    }

     public function edit(Course $course): Response
    {
        return inertia('Operators/Courses/Edit', [
            'page_setting' => [
                'title' => 'Edit Mata Kuliah',
                'subtitle' => 'Edit mata kuliah di sini. Klik simpan setelah selesai',
                'method' => 'PUT',
                'action' => route('operators.courses.update', $course),
            ],
            'course' => $course,
            'teachers' => Teacher::query()
                ->select(['id', 'user_id'])
                ->whereHas('user', function($query) {
                    $query->whereHas('roles', function($query) {
                        $query->where('name', 'Teacher');
                    });
                })
                ->where('faculty_id', auth()->user()->operator->faculty_id)
                ->where('department_id', auth()->user()->operator->department_id)
                ->with(['user'])
                ->get()
                ->map(function($item) {
                    return [
                        'value' => $item->id,
                        'label' => $item->user->name,
                    ];
                }),
        ]);
    }

    public function update(Course $course, CourseOperatorRequest $request): RedirectResponse
    {
        try {
            $course->update([
                'teacher_id' => $request->teacher_id,
                'name' => $request->name,
                'credit' => $request->credit,
                'semester' => $request->semester,
            ]);

            flashMessage(MessageType::UPDATED->message('Mata Kuliah'));
            return to_route('operators.courses.index');
        } catch (Throwable $e) {
            flashMessage(MessageType::ERROR->message(error: $e->getMessage()), 'error');
            return to_route('operators.courses.index');
        }
    }

    public function destroy(Course $course): RedirectResponse
    {
        try {
            $course->delete();

            flashMessage(MessageType::DELETED->message('Mata Kuliah'));
            return to_route('operators.courses.index');
        }catch (Throwable $e) {
            flashMessage(MessageType::ERROR->message(error: $e->getMessage()), 'error');
            return to_route('operators.courses.index');
        }
    }
}

<?php

namespace App\Http\Controllers\Admin;

use App\Enums\MessageType;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ClassroomRequest;
use App\Http\Resources\Admin\ClassroomResource;
use App\Models\Classroom;
use App\Models\Department;
use App\Models\Faculty;
use Illuminate\Http\RedirectResponse;
use Inertia\Response;
use Throwable;

use function App\Helpers\activeAcademicYear;

class ClassroomController extends Controller
{
    public function index(): Response
    {
        $classrooms = Classroom::query()
            ->select(['id', 'faculty_id', 'department_id', 'academic_year_id', 'name', 'slug', 'created_at'])
            ->filter(request()->only(['search']))
            ->sorting(request()->only(['field', 'direction']))
            ->with(['faculty', 'department', 'academicYear'])
            ->paginate(request()->load ?? 10);

        return inertia('Admin/Classrooms/Index', [
            'page_setting' => [
                'title' => 'Kelas',
                'subtitle' => 'Menampilkan semua data kelas yang tersedia pada universitas ini.',
            ],
            'classrooms' => ClassroomResource::collection($classrooms)->additional([
                'meta' => [
                    'has_pages' => $classrooms->hasPages(),
                ],
                'state' => [
                    'page' => request()->page ?? 1,
                    'search' => request()->search ?? '',
                    'load' => request()->load ?? 10,
                ],
            ]),
        ]);
    }

    public function create(): Response
    {
        return inertia('Admin/Classrooms/Create', [
            'page_setting' => [
                'title' => 'Tambah kelas',
                'subtitle' => 'Buat kelas di sini. Klik simpan setelah selesai',
                'method' => 'POST',
                'action' => route('admin.classrooms.store'),
            ],
            'faculties' => Faculty::query()
                ->select(['id', 'name'])
                ->orderBy('name')
                ->get()
                ->map(fn ($item) => [
                    'value' => $item->id,
                    'label' => $item->name,
                ]),
            'departments' => Department::query()
                ->select(['id', 'name'])
                ->orderBy('name')
                ->get()
                ->map(fn ($item) => [
                    'value' => $item->id,
                    'label' => $item->name,
                ]),
        ]);
    }

    public function store(ClassroomRequest $request): RedirectResponse
    {
        try {
            Classroom::create([
                'faculty_id' => $request->faculty_id,
                'department_id' => $request->department_id,
                'academic_year_id' => activeAcademicYear()->id,
                'name' => $request->name,
            ]);

            session()->flash('flash', [
                'type' => 'success',
                'message' => MessageType::CREATED->message('Kelas'),
            ]);

            return to_route('admin.classrooms.index');
        } catch (Throwable $e) {
            session()->flash('flash', [
                'type' => 'error',
                'message' => MessageType::ERROR->message($e->getMessage()),
            ]);

            return back()->withInput();
        }
    }

    public function edit(Classroom $classroom): Response
    {
        return inertia('Admin/Classrooms/Edit', [
            'page_setting' => [
                'title' => 'Edit kelas',
                'subtitle' => 'Edit kelas di sini. Klik simpan setelah selesai',
                'method' => 'PUT',
                'action' => route('admin.classrooms.update', $classroom),
            ],
            'classroom' => $classroom,
            'faculties' => Faculty::query()
                ->select(['id', 'name'])
                ->orderBy('name')
                ->get()
                ->map(fn ($item) => [
                    'value' => $item->id,
                    'label' => $item->name,
                ]),
            'departments' => Department::query()
                ->select(['id', 'name'])
                ->orderBy('name')
                ->get()
                ->map(fn ($item) => [
                    'value' => $item->id,
                    'label' => $item->name,
                ]),
        ]);
    }

    public function update(Classroom $classroom, ClassroomRequest $request): RedirectResponse
    {
        try {
            $classroom->update([
                'faculty_id' => $request->faculty_id,
                'department_id' => $request->department_id,
                'name' => $request->name,
            ]);

            session()->flash('flash', [
                'type' => 'success',
                'message' => MessageType::UPDATED->message('Kelas'),
            ]);

            return to_route('admin.classrooms.index');
        } catch (Throwable $e) {
            session()->flash('flash', [
                'type' => 'error',
                'message' => MessageType::ERROR->message($e->getMessage()),
            ]);

            return back()->withInput();
        }
    }

    public function destroy(Classroom $classroom): RedirectResponse
    {
        try {
            $classroom->delete();
            session()->flash('flash', [
                'type' => 'success',
                'message' => MessageType::DELETED->message('Kelas'),
            ]);
            return to_route('admin.classrooms.index');
        } catch (Throwable $e) {
            session()->flash('flash', [
                'type' => 'error',
                'message' => MessageType::ERROR->message($e->getMessage()),
            ]);
            return to_route('admin.classrooms.index');
        }
    }
}

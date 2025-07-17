<?php

namespace App\Http\Controllers\Admin;

use App\Enums\MessageType;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\TeacherRequest;
use App\Http\Resources\Admin\TeacherResource;
use App\Models\Department;
use App\Models\Faculty;
use App\Models\Teacher;
use App\Models\User;
use App\Traits\HasFile;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Response;
use Throwable;

use function App\Helpers\flashMessage;

class TeacherController extends Controller
{
    use HasFile;

    public function index(): Response
    {
        $teachers = Teacher::query()
            ->select(['teachers.id', 'teachers.user_id', 'teachers.faculty_id', 'teachers.department_id', 'teachers.teacher_number', 'teachers.academic_title', 'teachers.created_at'])
            ->filter(request()->only(['search']))
            ->sorting(request()->only(['field', 'direction']))
            ->with(['user', 'faculty', 'department'])
            ->whereHas('user', function ($query) {
                $query->whereHas('roles', function ($query) {
                    $query->where('name', 'Teacher');
                });
            })
            ->paginate(request('load', 10));

        return inertia('Admin/Teachers/Index', [
            'page_setting' => [
                'title' => 'Dosen',
                'subtitle' => 'Menampilkan semua data dosen yang tersedia di universitas ini',
            ],
            'teachers' => TeacherResource::collection($teachers)->additional([
                'meta' => [
                    'has_pages' => $teachers->hasPages(),
                ],
            ]),
            'state' => [
                'page' => request('page', 1),
                'search' => request('search', ''),
                'load' => request('load', 10),
            ],
        ]);
    }

    public function create(): Response
    {
        return inertia('Admin/Teachers/Create', [
            'page_setting' => [
                'title' => 'Tambah Dosen',
                'subtitle' => 'Buat dosen baru di sini. Klik simpan setelah selesai.',
                'method' => 'POST',
                'action' => route('admin.teachers.store'),
            ],
            'faculties' => Faculty::query()
                ->select(['id', 'name'])
                ->orderBy('name')
                ->get()
                ->map(function ($item) {
                    return [
                        'value' => $item->id,
                        'label' => $item->name,
                    ];
                }),

            'departments' => Department::query()
                ->select(['id', 'name'])
                ->orderBy('name')
                ->get()
                ->map(function ($item) {
                    return [
                        'value' => $item->id,
                        'label' => $item->name,
                    ];
                }),
        ]);
    }

    public function store(TeacherRequest $request): RedirectResponse
    {
        try {
            DB::beginTransaction();

            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'avatar' => $this->upload_file($request, 'avatar', 'users'),
            ]);

            $user->teacher()->create([
                'faculty_id' => $request->faculty_id,
                'department_id' => $request->department_id,
                'teacher_number' => $request->teacher_number,
                'academic_title' => $request->academic_title,
            ]);

            $user->assignRole('Teacher');

            DB::commit();

            flashMessage(MessageType::CREATED->message('Dosen'));
            return to_route('admin.teachers.index');
        } catch (Throwable $e) {
            DB::rollBack();
            flashMessage(MessageType::ERROR->message(error: $e->getMessage()));
            return to_route('admin.teachers.index');
        }
    }

     public function edit(Teacher $teacher): Response
{
    return inertia('Admin/Teachers/Edit', [ // ✅ sudah diperbaiki
        'page_setting' => [
            'title' => 'Edit Dosen',
            'subtitle' => 'Edit dosen baru di sini. Klik simpan setelah selesai.',
            'method' => 'PUT',
            'action' => route('admin.teachers.update', $teacher),
        ],
        'teacher' => $teacher->load('user'), // ✅ sudah diperbaiki
        'faculties' => Faculty::query()
            ->select(['id', 'name'])
            ->orderBy('name')
            ->get()
            ->map(function ($item) {
                return [
                    'value' => $item->id,
                    'label' => $item->name,
                ];
            }),

        'departments' => Department::query()
            ->select(['id', 'name'])
            ->orderBy('name')
            ->get()
            ->map(function ($item) {
                return [
                    'value' => $item->id,
                    'label' => $item->name,
                ];
            }),
    ]);
}


  public function update(Teacher $teacher, TeacherRequest $request): RedirectResponse
{
    try {
        DB::beginTransaction();

        $validated = $request->validated();

        $teacher->update([
            'faculty_id' => $validated['faculty_id'],
            'department_id' => $validated['department_id'],
            'teacher_number' => $validated['teacher_number'],
            'academic_title' => $validated['academic_title'],
        ]);

        $teacher->user()->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => $validated['password']
                ? Hash::make($validated['password'])
                : $teacher->user->password,
            'avatar' => $this->update_file($request, $teacher->user, 'avatar', 'users'),
        ]);

        DB::commit();

        flashMessage(MessageType::UPDATED->message('Dosen'));
        return to_route('admin.teachers.index');
    } catch (Throwable $e) {
        DB::rollBack();
        flashMessage(MessageType::ERROR->message(error: $e->getMessage()));
        return to_route('admin.teachers.index');
    }
}

public function destroy(Teacher $teacher): RedirectResponse
{
    try {
        $this->delete_file($teacher->user, 'avatar');
        $teacher->delete();

        flashMessage(MessageType::DELETED->message('Dosen'));
        return to_route('admin.teachers.index');
    } catch (Throwable $e) {
        flashMessage(MessageType::ERROR->message(error: $e->getMessage()));
        return to_route('admin.teachers.index');
    }
}


}

<?php

namespace App\Http\Controllers\Admin;

use App\Enums\MessageType;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StudentRequest;
use App\Http\Resources\Admin\StudentResource;
use App\Models\Classroom;
use App\Models\Department;
use App\Models\Faculty;
use App\Models\FeeGroup;
use App\Models\Student;
use App\Models\User;
use App\Traits\HasFile;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Response;
use Throwable;

class StudentController extends Controller
{
    use HasFile;

    public function index(): Response
    {
        $students = Student::query()
            ->select([
                'students.id',
                'students.user_id',
                'students.faculty_id',
                'students.department_id',
                'students.fee_group_id',
                'students.classroom_id',
                'students.student_number',
                'students.semester',
                'students.batch',
                'students.created_at',
            ])
            ->filter(request()->only(['search']))
            ->sorting(request()->only(['field', 'direction']))
            ->with(['user', 'faculty', 'department', 'feeGroup', 'classroom'])
            ->whereHas('user', fn ($query) =>
                $query->whereHas('roles', fn ($q) => $q->where('name', 'student'))
            )
            ->paginate(request()->load ?? 10);

        return inertia('Admin/Students/Index', [
            'page_setting' => [
                'title' => 'Mahasiswa',
                'subtitle' => 'Menampilkan semua data mahasiswa yang tersedia di universitas ini',
            ],
            'students' => StudentResource::collection($students)->additional([
                'meta' => ['has_pages' => $students->hasPages()],
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
        return inertia('Admin/Students/Create', [
            'page_setting' => [
                'title' => 'Tambah mahasiswa',
                'subtitle' => 'Buat mahasiswa baru di sini. Klik simpan setelah selesai',
                'method' => 'POST',
                'action' => route('admin.students.store'),
            ],
            'faculties' => Faculty::select('id', 'name')->orderBy('name')->get()->map(fn ($item) => [
                'value' => $item->id,
                'label' => $item->name,
            ]),
            'departments' => Department::select('id', 'name')->orderBy('name')->get()->map(fn ($item) => [
                'value' => $item->id,
                'label' => $item->name,
            ]),
            'feeGroups' => FeeGroup::select('id', 'group', 'amount')->orderBy('group')->get()->map(fn ($item) => [
                'value' => $item->id,
                'label' => 'Golongan ' . $item->group . ' - Rp' . number_format($item->amount, 0, ',', '.'),
            ]),
            'classrooms' => Classroom::select('id', 'name')->orderBy('name')->get()->map(fn ($item) => [
                'value' => $item->id,
                'label' => $item->name,
            ]),
        ]);
    }

    public function store(StudentRequest $request): RedirectResponse
    {
        try {
            DB::beginTransaction();

            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'avatar' => $this->upload_file($request, 'avatar', 'users'),
            ]);

            $user->student()->create([
                'faculty_id' => $request->faculty_id,
                'department_id' => $request->department_id,
                'classroom_id' => $request->classroom_id,
                'fee_group_id' => $request->fee_group_id,
                'student_number' => $request->student_number,
                'semester' => $request->semester,
                'batch' => $request->batch,
            ]);

            $user->assignRole('Student');

            DB::commit();

            session()->flash('message', [
                'type' => 'success',
                'text' => MessageType::CREATED->message('Mahasiswa'),
            ]);

            return to_route('admin.students.index');
        } catch (Throwable $e) {
            DB::rollBack();

            session()->flash('message', [
                'type' => 'error',
                'text' => MessageType::ERROR->message($e->getMessage()),
            ]);

            return to_route('admin.students.index');
        }
    }

    public function edit(Student $student_number): Response
    {
        $student = Student::where('student_number', $student_number)
            ->with(['user', 'faculty', 'department', 'feeGroup', 'classroom'])
            ->firstOrFail();

        return inertia('Admin/Students/Edit', [
            'page_setting' => [
                'title' => 'Edit mahasiswa',
                'subtitle' => 'Edit mahasiswa di sini. Klik simpan setelah selesai',
                'method' => 'PUT',
                'action' => route('admin.students.update', $student->student_number),
            ],
            'student' => $student->load('user'),
            'faculties' => Faculty::select('id', 'name')->orderBy('name')->get()->map(fn ($item) => [
                'value' => $item->id,
                'label' => $item->name,
            ]),
            'departments' => Department::select('id', 'name')->orderBy('name')->get()->map(fn ($item) => [
                'value' => $item->id,
                'label' => $item->name,
            ]),
            'feeGroups' => FeeGroup::select('id', 'group', 'amount')->orderBy('group')->get()->map(fn ($item) => [
                'value' => $item->id,
                'label' => 'Golongan ' . $item->group . ' - Rp' . number_format($item->amount, 0, ',', '.'),
            ]),
            'classrooms' => Classroom::select('id', 'name')->orderBy('name')->get()->map(fn ($item) => [
                'value' => $item->id,
                'label' => $item->name,
            ]),
        ]);
    }

    public function update(Student $student, StudentRequest $request): RedirectResponse
{
    try {
        DB::beginTransaction();

        $student->update([
            'faculty_id' => $request->faculty_id,
            'department_id' => $request->department_id,
            'fee_group_id' => $request->fee_group_id,
            'classroom_id' => $request->classroom_id,
            'student_number' => $request->student_number,
            'semester' => $request->semester,
            'batch' => $request->batch,
        ]);

        $student->user()->update([
            'name' => $request->name,
            'email' => $request->email,
            'password' => $request->filled('password')
                ? Hash::make($request->password)
                : $student->user->password,
            'avatar' => $this->update_file($request, $student->user, 'avatar', 'users'),
        ]);

        DB::commit();

        session()->flash('message', [
            'type' => 'success',
            'text' => MessageType::UPDATED->message('Mahasiswa'),
        ]);

        return to_route('admin.students.index');
    } catch (Throwable $e) {
        DB::rollBack();

        session()->flash('message', [
            'type' => 'error',
            'text' => MessageType::ERROR->message($e->getMessage()),
        ]);

        return to_route('admin.students.index');
    }
}

}

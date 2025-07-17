<?php

namespace App\Http\Controllers\Admin;

use App\Enums\MessageType;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ClassroomStudentRequest;
use App\Http\Resources\Admin\ClassroomStudentResource;
use App\Models\Classroom;
use App\Models\Student;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Response;
use Throwable;

class ClassroomStudentController extends Controller
{
    public function index(Classroom $classroom): Response
    {
        $classroomStudents = Student::query()
            ->select(['id', 'user_id', 'classroom_id', 'student_number', 'created_at'])
            ->where('classroom_id', $classroom->id)
            ->whereHas('user', function ($query) {
                $query->whereHas('roles', function ($q) {
                    $q->where('name', 'student');
                });
            })
            ->with('user')
            ->orderBy('student_number')
            ->paginate(10);

        $students = Student::query()
            ->select(['id', 'user_id', 'faculty_id', 'department_id'])
            ->with('user:id,name')
            ->whereNull('classroom_id')
            ->where('faculty_id', $classroom->faculty_id)
            ->where('department_id', $classroom->department_id)
            ->get()
            ->map(function ($item) {
                return [
                    'value' => $item->id,
                    'label' => $item->user->name,
                ];
            });

        return inertia('Admin/Classrooms/Students/Index', [
            'page_setting' => [
                'title' => "Kelas $classroom->name",
                'subtitle' => 'Menampilkan semua data mahasiswa yang tersedia pada kelas ini.',
                'method' => 'PUT',
                'action' => route('admin.classroom-students.sync', $classroom),
            ],
            'students' => $students,
            'classroomStudents' => ClassroomStudentResource::collection($classroomStudents),
            'classroom' => $classroom,
        ]);
    }

    public function sync(Classroom $classroom, ClassroomStudentRequest $request): RedirectResponse
    {
        try {
            Student::whereHas('user', function ($query) use ($request) {
                $query->where('name', $request->student);
            })->update([
                'classroom_id' => $classroom->id,
            ]);

            flashMessage("Berhasil menambahkan mahasiswa baru ke dalam kelas {$classroom->name}");
            return to_route('admin.classroom-students.index', $classroom);
        } catch (Throwable $e) {
            flashMessage(MessageType::ERROR->message($e->getMessage()), 'error');
            return to_route('admin.classroom-students.index', $classroom);
        }
    }

    public function destroy(Classroom $classroom, Student $student): RedirectResponse
    {
        try {
            $student->update([
                'classroom_id' => null,
            ]);

            flashMessage("Berhasil menghapus mahasiswa dari kelas {$classroom->name}");
            return to_route('admin.classroom-students.index', $classroom);
        } catch (Throwable $e) {
            flashMessage(MessageType::ERROR->message($e->getMessage()), 'error');
            return to_route('admin.classroom-students.index', $classroom);
        }
    }
}

<?php

namespace App\Http\Controllers\Operator;

use App\Enums\MessageType;
use App\Http\Controllers\Controller;
use App\Http\Requests\Operator\ClassroomOperatorRequest;
use App\Http\Resources\Operator\ClassroomOperatorResource;
use App\Models\Classroom;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Response;
use Throwable;

use function App\Helpers\activeAcademicYear;
use function App\Helpers\flashMessage;

class ClassroomOperatorController extends Controller
{
    public function index(): Response
    {
        $classrooms = Classroom::query()
            ->select(['id', 'faculty_id', 'department_id', 'academic_year_id', 'name', 'slug', 'created_at'])
            ->filter(request()->only(['search']))
            ->sorting(request()->only(['field', 'direction']))
            ->where('faculty_id', auth()->user()->operator->faculty_id)
            ->where('department_id', auth()->user()->operator->department_id)
            ->with(['academicYear'])
            ->paginate(request('load', 10));

        return inertia('Operators/Classrooms/Index', [
            'page_setting' => [
                'title' => 'Kelas',
                'subtitle' => 'Menampilkan semua kelas yang tersedia',
            ],
            'classrooms' => ClassroomOperatorResource::collection($classrooms)->additional([
                'meta' => [
                    'has_pages' => $classrooms->hasPages(),
                ],
                'state' => [
                    'page' => request('page', 1),
                    'search' => request('search', ''),
                    'load' => request('load', 10),
                ],
            ]),
        ]);
    }

    public function create(): Response
    {
        return inertia('Operators/Classrooms/Create', [
            'page_setting' => [
                'title' => 'Tambah Kelas',
                'subtitle' => 'Buat kelas baruu di sini. Klik simpan setelah selesai',
                'method' => 'POST',
                'action' => route('operators.classrooms.store'),
            ],
        ]);
    }
public function store(ClassroomOperatorRequest $request): RedirectResponse
{
    try {
        Classroom::create([
            'faculty_id' => auth()->user()->operator->faculty_id,
            'department_id' => auth()->user()->operator->department_id,
            'academic_year_id' => $request->academic_year_id, // ✅ ambil dari request
            'name' => $request->name,
            'slug' => null, // jika auto-slug via observer / trait, boleh dihapus
        ]);

        flashMessage(MessageType::CREATED->message('Kelas'));
        return to_route('operators.classrooms.index');
    } catch (Throwable $e) {
        flashMessage(MessageType::ERROR->message(error: $e->getMessage()), 'error');
        return to_route('operators.classrooms.index');
    }
}

  public function edit(Classroom $classroom): Response
    {
        return inertia('Operators/Classrooms/Edit', [
            'page_setting' => [
                'title' => 'Edit Kelas',
                'subtitle' => 'Edit kelas baruu di sini. Klik simpan setelah selesai',
                'method' => 'PUT',
                'action' => route('operators.classrooms.update', $classroom),
            ],
            'classroom' => $classroom->load(['academicYear']),
        ]);
    }
public function update(Classroom $classroom, ClassroomOperatorRequest $request): RedirectResponse
{
    try {
        $classroom->update([
            'name' => $request->name,
        ]);

        flashMessage(MessageType::UPDATED->message('Kelas'));
        return to_route('operators.classrooms.index');
    } catch (Throwable $e) {
        flashMessage(MessageType::ERROR->message(error: $e->getMessage()), 'error');
        return to_route('operators.classrooms.index');
    }
}

public function destroy(Classroom $classroom): RedirectResponse
{
    try {
        $classroom->delete();

        flashMessage(MessageType::DELETED->message('Kelas'));
        return to_route('operators.classrooms.index');
    } catch (Throwable $e) {
         flashMessage(MessageType::ERROR->message(error: $e->getMessage()), 'error');
        return to_route('operators.classrooms.index');
    }
}

}

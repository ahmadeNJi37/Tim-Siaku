<?php

namespace App\Http\Controllers\Admin;

use App\Enums\MessageType;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\DepartmentRequest; 
use App\Http\Resources\Admin\DepartmentResource;
use App\Models\Department;
use App\Models\Faculty;
use Illuminate\Http\Request;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Throwable;

class DepartmentController extends Controller
{
    public function index(): Response
    {
        $departments = Department::query()
            ->select(['departments.id', 'departments.faculty_id', 'departments.name', 'departments.code', 'departments.slug', 'departments.created_at'])
            ->filter(request()->only(['search']))
            ->sorting(request()->only(['field', 'direction']))
            ->with('faculty')
            ->paginate(request()->load ?? 10);

        return inertia('Admin/Departments/Index', [
            'page_setting' => [
                'title' => 'Program studi',
                'subtitle' => 'Menampilkan semua program studi yang tersedia pada universitas ini',
            ],
            'departments' => DepartmentResource::collection($departments)->additional([
                'meta' => [
                    'has_pages' => $departments->hasPages(),
                    'current_page' => $departments->currentPage(),
                    'per_page' => $departments->perPage(),
                    'from' => $departments->firstItem(),
                    'total' => $departments->total(),
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
        return inertia('Admin/Departments/Create', [
            'page_setting' => [
                'title' => 'Tambah program studi',
                'subtitle' => 'Buat program studi baru di sini. Klik simpan setelah selesai',
                'method' => 'POST',
                'action' => route('admin.departments.store'),
            ],
            'faculties' => Faculty::query()
                ->select(['id', 'name'])
                ->orderBy('name')
                ->get()
                ->map(fn ($item) => [
                    'value' => $item->id,
                    'label' => $item->name,
                ]),
        ]);
    }

    public function store(DepartmentRequest $request): RedirectResponse
    {
        try {
            Department::create([
                'faculty_id' => $request->faculty_id,
                'name' => $request->name,
                'code' => $request->code ?? str()->random(6),
            ]);

            session()->flash('flash', [
                'type' => 'success',
                'message' => MessageType::CREATED->message('program studi'),
            ]);

            return to_route('admin.departments.index');
        } catch (Throwable $e) {
            session()->flash('flash', [
                'type' => 'error',
                'message' => MessageType::ERROR->message($e->getMessage()),
            ]);

            return back();
        }
    }

    public function edit(Department $department): Response
    {
        return inertia('Admin/Departments/Edit', [
            'page_setting' => [
                'title' => 'Edit program studi',
                'subtitle' => 'Edit program studi di sini. Klik simpan setelah selesai.',
                'method' => 'PUT',
                'action' => route('admin.departments.update', $department),
            ],
            'department' => $department,
            'faculties' => Faculty::query()
                ->select(['id', 'name'])
                ->orderBy('name')
                ->get()
                ->map(fn ($item) => [
                    'value' => $item->id,
                    'label' => $item->name,
                ]),
        ]);
    }

    public function update(Department $department, DepartmentRequest $request): RedirectResponse
    {
        try {
            $department->update([
                'faculty_id' => $request->faculty_id,
                'name' => $request->name,
                'code' => $request->code, // Pastikan validasi kode juga ada di request jika editable
            ]);

            session()->flash('flash', [
                'type' => 'success',
                'message' => MessageType::UPDATED->message('program studi'),
            ]);

            return to_route('admin.departments.index');
        } catch (Throwable $e) {
            session()->flash('flash', [
                'type' => 'error',
                'message' => MessageType::ERROR->message($e->getMessage()),
            ]);

            return back();
        }
    }

    public function destroy(Department $department): RedirectResponse
{
    try {
        $department->delete();

        session()->flash('flash', [
            'type' => 'success',
            'message' => MessageType::DELETED->message('program studi'),
        ]);

        return to_route('admin.departments.index');
    } catch (Throwable $e) {
        session()->flash('flash', [
            'type' => 'error',
            'message' => MessageType::ERROR->message($e->getMessage()),
        ]);

        return to_route('admin.departments.index');
    }
}

}

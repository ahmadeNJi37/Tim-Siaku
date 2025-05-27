<?php

namespace App\Http\Controllers\Admin;

use App\Enums\MessageType;
use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\DepartmentResource;
use App\Models\Department;
use App\Models\Faculty;
use Illuminate\Http\Request;
use Inertia\Response;
use Throwable;

class DepartmentController extends Controller
{
    public function index(): Response
    {
        $departments = Department::query()
            ->select(['id', 'faculty_id', 'name', 'code', 'slug', 'created_at'])
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
                ->map(function ($item) {
                    return [
                        'value' => $item->id,
                        'label' => $item->name,
                    ];
                }),
        ]);
    }

    public functionstire(DepartmentRequest $request): RedirectResponse {
        try {
            Department::create([
                'faculty_id' => $request->faculty_id,
                'name' => $request->name,
                'code' => str()->random(6),
            ]);

            flashMessage(MessageType::CREATED->message('program studi'));
            return to_route( route: 'admin.departments.index')
        } catch (Throwable $e){
            flashMessage( message: MessageType::ERROR->message( entity: error $e->getMessage()), 'error');
            return to_route('admin.department.index');
        }
    }
}

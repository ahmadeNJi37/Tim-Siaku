<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AcademicYearRequest;
use App\Http\Resources\Admin\AcademicYearResource;
use App\Models\AcademicYear;
use App\Models\Faculty;
use App\Enums\AcademicYearSemester;
use App\Enums\MessageType;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Response;
use Throwable;

class AcademicYearController extends Controller
{
    public function index(): Response
    {
        $academicYears = AcademicYear::query()
            ->select(['id', 'name', 'slug', 'start_date', 'end_date', 'semester', 'is_active', 'created_at'])
            ->filter(request()->only(['search']))
            ->sorting(request()->only(['field', 'direction']))
            ->paginate(request()->load ?? 10);

        return inertia('Admin/AcademicYears/Index', [
            'page_setting' => [
                'title' => 'Tahun Ajaran',
                'subtitle' => 'Menampilkan semua data tahun ajaran yang tersedia pada universitas ini',
            ],
            'academicYears' => AcademicYearResource::collection($academicYears)->additional([
                'meta' => [
                    'has_pages' => $academicYears->hasPages(),
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
        return inertia('Admin/AcademicYears/Create', [
            'page_setting' => [
                'title' => 'Tambah tahun ajaran',
                'subtitle' => 'Buat tahun ajaran baru di sini. Klik simpan setelah selesai',
                'method' => 'POST',
                'action' => route('admin.academic-years.store'),
            ],
            'faculties' => Faculty::query()
                ->select(['id', 'name'])
                ->orderBy('name')
                ->get()
                ->map(fn ($item) => [
                    'value' => $item->id,
                    'label' => $item->name,
                ]),
            'academicYearSemester' => AcademicYearSemester::options(), // ✅ Diperbaiki
        ]);
    }

    public function store(AcademicYearRequest $request): RedirectResponse
    {
        try {
            AcademicYear::create([
                'name' => $request->name,
                'start_date' => $request->start_date,
                'end_date' => $request->end_date,
                'semester' => $request->semester,
                'is_active' => $request->is_active ?? false,
                'code' => $request->code,
            ]);

            session()->flash('flash', [
                'type' => 'success',
                'message' => MessageType::CREATED->message('tahun ajaran'),
            ]);

            return to_route('admin.academic-years.index');
        } catch (Throwable $e) {
            session()->flash('flash', [
                'type' => 'error',
                'message' => MessageType::ERROR->message($e->getMessage()),
            ]);

            return back()->withInput();
        }
    }

    public function edit(AcademicYear $academicYear): Response
    {
        return inertia('Admin/AcademicYears/Edit', [
            'page_setting' => [
                'title' => 'Edit tahun ajaran',
                'subtitle' => 'Edit tahun ajaran di sini. Klik simpan setelah selesai.',
                'method' => 'PUT',
                'action' => route('admin.academic-years.update', $academicYear),
            ],
            'academicYear' => $academicYear,
            'academicYearSemester' => AcademicYearSemester::options(),
            'faculties' => Faculty::query()
                ->select(['id', 'name'])
                ->orderBy('name')
                ->get()
                ->map(fn ($item) => [
                    'value' => $item->id,
                    'label' => $item->name,
                ]),
            'academicYear' => $academicYear->only([
                'id', 'name', 'code', 'slug', 'start_date', 'end_date', 'semester', 'is_active',
            ]),
        ]);
    }

    public function update(AcademicYear $academicYear, AcademicYearRequest $request): RedirectResponse
    {
        try {
            $academicYear->update([
                'name' => $request->name,
                'start_date' => $request->start_date,
                'end_date' => $request->end_date,
                'semester' => $request->semester,
                'is_active' => $request->is_active ?? false,
                'code' => $request->code,
            ]);

            session()->flash('flash', [
                'type' => 'success',
                'message' => MessageType::UPDATED->message('tahun ajaran'),
            ]);

            return to_route('admin.academic-years.index');
        } catch (Throwable $e) {
            session()->flash('flash', [
                'type' => 'error',
                'message' => MessageType::ERROR->message($e->getMessage()),
            ]);

            return back()->withInput();
        }
    }

    public function destroy(AcademicYear $academicYear): RedirectResponse
    {
        try {
            $academicYear->delete();

            session()->flash('flash', [
                'type' => 'success',
                'message' => MessageType::DELETED->message('tahun ajaran'),
            ]);

            return to_route('admin.academic-years.index');
        } catch (Throwable $e) {
            session()->flash('flash', [
                'type' => 'error',
                'message' => MessageType::ERROR->message($e->getMessage()),
            ]);

            return to_route('admin.academic-years.index');
        }
    }
}

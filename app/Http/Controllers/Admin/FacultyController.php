<?php

namespace App\Http\Controllers\Admin;

use App\Enums\MessageType;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\FacultyRequest;
use App\Http\Resources\Admin\FacultyResource;
use App\Models\Faculty;
use App\Traits\HasFile;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Response;
use Inertia\Inertia;
use Throwable;

use function App\Helpers\flashMessage;

class FacultyController extends Controller
{
    use HasFile;

    public function index(): Response
    {
        $faculties = Faculty::query()
            ->select(['id', 'name', 'code', 'logo', 'slug', 'created_at'])
            ->filter(request()->only(['search']))
            ->sorting(request()->only(['field', 'direction']))
            ->paginate(request('load', 10));

        return Inertia::render('Admin/Faculties/Index', [
            'page_setting' => [
                'title' => 'Fakultas',
                'subtitle' => 'Menampilkan semua data fakultas yang tersedia pada universitas ini',
            ],
            'faculties' => FacultyResource::collection($faculties)->additional([
                'meta' => [
                    'has_pages' => $faculties->hasPages(),
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
        return Inertia::render('Admin/Faculties/Create', [
            'page_setting' => [
                'title' => 'Tambah fakultas',
                'subtitle' => 'Buat fakultas baru di sini. Klik simpan setelah selesai',
                'method' => 'POST',
                'action' => route('admin.faculties.store'),
            ],
        ]);
    }

    public function store(FacultyRequest $request): RedirectResponse
    {
        try {
            $name = $request->name;

            Faculty::create([
                'name' => $name,
                'slug' => str()->slug($name),
                'code' => str()->random(6),
                'logo' => $this->upload_file($request, 'logo', 'faculties'),
            ]);

            flashMessage(MessageType::CREATED->message('fakultas'));
            return to_route('admin.faculties.index');
        } catch (Throwable $e) {
            flashMessage(MessageType::ERROR->message($e->getMessage()), 'error');
            return redirect()->back();
        }
    }

    public function edit(Faculty $faculty): Response
    {
        return Inertia::render('Admin/Faculties/Edit', [
            'page_setting' => [
                'title' => 'Edit fakultas',
                'subtitle' => 'Edit fakultas di sini. Klik simpan setelah selesai',
                'method' => 'PUT',
                'action' => route('admin.faculties.update', $faculty),
            ],
            'faculty' => $faculty,
        ]);
    }

    public function update(Faculty $faculty, FacultyRequest $request): RedirectResponse
    {
        try {
            $name = $request->name;

            $faculty->update([
                'name' => $name,
                'slug' => str()->slug($name),
                'logo' => $this->update_file($request, $faculty, 'logo', 'faculties'),
            ]);

            flashMessage(MessageType::UPDATED->message('fakultas'));
            return to_route('admin.faculties.index');
        } catch (Throwable $e) {
            flashMessage(MessageType::ERROR->message($e->getMessage()), 'error');
            return redirect()->back();
        }
    }

    public function destroy(Faculty $faculty): RedirectResponse
    {
        try {
            $this->delete_file($faculty, 'logo');
            $faculty->delete();

            flashMessage(MessageType::DELETED->message('fakultas'));
            return to_route('admin.faculties.index');
        } catch (Throwable $e) {
            flashMessage(MessageType::ERROR->message($e->getMessage()), 'error');
            return to_route('admin.faculties.index');
        }
    }
}

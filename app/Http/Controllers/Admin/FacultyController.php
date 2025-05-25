<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\FacultyResource;
use App\Models\Faculty;
use Illuminate\Http\Request;
use Inertia\Response;
use Inertia\Inertia;

class FacultyController extends Controller
{
    public function index(): Response
    {$faculties = Faculty::query()
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
}

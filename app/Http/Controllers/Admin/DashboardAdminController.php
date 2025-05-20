<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Classroom;
use App\Models\Course;
use App\Models\Department;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Faculty; // <- Pastikan ini ditambahkan

class DashboardAdminController extends Controller
{
    public function __invoke(): Response
    {

        return Inertia::render('Admin/Dashboard', [
            'page_settings' => [
                'title' => 'Dashboard',
                'subtitle' => 'Menampilkan semua statistik pada platform ini',
            ],
           'count' => [
    'faculties' => Faculty::count(),
    'departments' => Department::count(),
    'classrooms' => Classroom::count(),
    'courses' => Course::count(),
],

        ]);
    }
}


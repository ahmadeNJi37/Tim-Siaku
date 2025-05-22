<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Classroom;
use App\Models\Faculty;
use App\Models\Department;
use App\Models\AcademicYear;

class ClassroomSeeder extends Seeder
{
    public function run()
    {
        $faculties = Faculty::all();
        $academicYear = AcademicYear::latest()->first(); // Ambil tahun akademik terbaru

        foreach ($faculties as $faculty) {
            foreach ($faculty->departments as $department) {
                Classroom::create([
                    'faculty_id' => $faculty->id,
                    'department_id' => $department->id,
                    'academic_year_id' => $academicYear->id,
                    'name' => "Kelas " . $department->name,
                    'slug' => str()->slug("Kelas " . $department->name),
                ]);
            }
        }
    }
}


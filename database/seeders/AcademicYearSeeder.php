<?php

namespace Database\Seeders;
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\AcademicYear;
use App\Enums\AcademicYearSemester;

class AcademicYearSeeder extends Seeder
{
    public function run(): void
    {
        AcademicYear::create([
            'name' => '2024/2025',
            'is_active' => true,
            'semester' => AcademicYearSemester::ODD->value, // ✅ Gunakan Enums
            'start_date' => '2024-07-01', // ✅ Tambahkan start_date
            'end_date' => '2025-06-30',   // ✅ Tambahkan end_date agar tidak error
        ]);
    }
}


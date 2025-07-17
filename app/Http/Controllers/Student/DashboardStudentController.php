<?php

namespace App\Http\Controllers\Student;

use App\Enums\FeeStatus;
use App\Enums\StudyPlanStatus;
use App\Http\Controllers\Controller;
use App\Models\Fee;
use App\Models\StudyPlan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Response;

class DashboardStudentController extends Controller
{
    public function __invoke(): Response
    {
        $user = Auth::user();

        // ✅ Validasi: jika user tidak punya relasi student, tolak akses
        if (!$user || !$user->student) {
            abort(403, 'Akses ditolak: Anda bukan mahasiswa atau belum memiliki data mahasiswa.');
        }

        $student = $user->student;

        return inertia('Students/Dashboard', [
            'auth' => $user->load('student'),

            'page_settings' => [
                'title' => 'Dashboard',
                'subtitle' => 'Menampilkan semua statistik pada platform ini',
            ],

            'count' => [
                'study_plans_approved' => StudyPlan::query()
                    ->where('status', StudyPlanStatus::APPROVED->value)
                    ->where('student_id', $student->id)
                    ->count(),

                'study_plans_reject' => StudyPlan::query()
                    ->where('status', StudyPlanStatus::REJECT->value)
                    ->where('student_id', $student->id)
                    ->count(),

                'total_payments' => Fee::query()
                    ->where('student_id', $student->id)
                    ->where('status', FeeStatus::SUCCESS->value)
                    ->with('feeGroup')
                    ->get()
                    ->sum(fn($fee) => $fee->feeGroup->amount),
            ],
        ]);
    }
}

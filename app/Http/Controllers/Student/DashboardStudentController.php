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
        
        return inertia('Students/Dashboard', [
        'auth' => Auth::user()->load('student'),

            'page_settings' => [
                'title' => 'Dashboard',
                'subtitle' => 'Menampilkan semua statistik pada platfrom ini',
            ],

        'count' => [
            'study_plans_approved' => StudyPlan::query()
            ->where('status', StudyPlanStatus::APPROVED->value)
            ->count(),
            'study_plans_reject' => StudyPlan::query()
            ->where('status', StudyPlanStatus::REJECT->value)
            ->count(),
            'total_payments' => Fee::query()
            ->where('student_id', auth()->user()->student->id)
            ->where('status', FeeStatus::SUCCESS->value)
            ->with('feeGroup')
            ->get()
            ->sum(fn($fee) => $fee->feeGroup->amount)

        ]
        ]);

    }
}
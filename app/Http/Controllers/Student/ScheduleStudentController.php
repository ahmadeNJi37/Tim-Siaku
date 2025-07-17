<?php

namespace App\Http\Controllers\Student;

use App\Enums\ScheduleDay;
use App\Http\Controllers\Controller;
use App\Models\StudyPlan;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Response;

use function App\Helpers\activeAcademicYear;
use function App\Helpers\flashMessage;

class ScheduleStudentController extends Controller
{
    public function __invoke(): Response|RedirectResponse
    {
        $studyPlan = StudyPlan::query()
            ->where('student_id', auth()->user()->student->id)
            ->where('academic_year_id', activeAcademicYear()->id)
            ->approved()
            ->with(['schedules.course']) // tambahkan course agar tidak null
            ->first();

        if (!$studyPlan) {
            flashMessage('Anda belum mengajukan KRS', 'warning');
            return to_route('students.study-plans.index');
        }

        $days = ScheduleDay::cases();
        $scheduleTable = [];

        foreach ($studyPlan->schedules as $schedule) {
            $startTime = substr($schedule->start_time, 0, 5);
            $endTime = substr($schedule->end_time, 0, 5); // ✅ typo: sebelumnya `$end_time`
            $day = $schedule->day_of_week->value;

            $scheduleTable[$startTime][$day] = [
                'course' => $schedule->course->name ?? '-',
                'code' => $schedule->course->code ?? '-',
                'end_time' => $endTime,
            ];
        }

        $scheduleTable = collect($scheduleTable)->sortKeys();

        return inertia('Students/Schedules/Index', [
            'page_setting' => [
                'title' => 'Jadwal',
                'subtitle' => 'Menampilkan semua jadwal yang tersedia',
            ],
            'scheduleTable' => $scheduleTable,
            'days' => $days,
        ]);
    }
}

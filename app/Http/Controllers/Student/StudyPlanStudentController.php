<?php

namespace App\Http\Controllers\Student;

use App\Enums\MessageType;
use App\Enums\StudyPlanStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Student\StudyPlanStudentRequest;
use App\Http\Resources\Admin\ScheduleResource;
use App\Http\Resources\Student\StudyPlanStudentResource;
use App\Models\Schedule;
use App\Models\StudyPlan;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Response;
use Throwable;

use function App\Helpers\activeAcademicYear;
use function App\Helpers\flashMessage;

class StudyPlanStudentController extends Controller
{
    public function index(Request $request): Response
    {
        $student = Auth::user()?->student;

        if (!$student) {
            abort(403, 'Akses ditolak: Anda bukan mahasiswa atau belum memiliki data mahasiswa.');
        }

        $studyPlans = StudyPlan::query()
            ->select(['id', 'student_id', 'academic_year_id', 'status', 'created_at'])
            ->where('student_id', $student->id)
            ->with(['academicYear'])
            ->latest('created_at')
            ->paginate($request->input('load', 10))
            ->withQueryString();

        return inertia('Students/StudyPlans/Index', [
            'page_setting' => [
                'title' => 'Kartu Rencana Studi',
                'subtitle' => 'Menampilkan semua kartu rencana studi anda',
            ],
            'studyPlans' => StudyPlanStudentResource::collection($studyPlans)->additional([
                'meta' => [
                    'has_pages' => $studyPlans->hasPages(),
                    'total' => $studyPlans->total(),
                ],
            ]),
            'state' => [
                'page' => (int) $request->input('page', 1),
                'search' => $request->input('search', ''),
                'load' => (int) $request->input('load', 10),
            ],
        ]);
    }

    public function create(): Response|RedirectResponse
    {
        if (!activeAcademicYear()) {
            flashMessage('Tahun akademik belum aktif.', 'warning');
            return to_route('students.study-plans.index');
        }

        $student = Auth::user()?->student;

        if (!$student) {
            flashMessage('Data mahasiswa tidak ditemukan.', 'error');
            return to_route('students.study-plans.index');
        }

        $academicYearId = activeAcademicYear()->id;

        $schedules = Schedule::query()
            ->where('faculty_id', $student->faculty_id)
            ->where('department_id', $student->department_id)
            ->where('academic_year_id', $academicYearId)
            ->where(function ($query) use ($student) {
                $query->whereNull('classroom_id');
                if ($student->classroom_id) {
                    $query->orWhere('classroom_id', $student->classroom_id);
                }
            })
            ->with(['course', 'classroom'])
            ->withCount(['studyPlans as taken_quota' => function ($query) use ($academicYearId) {
                $query->where('academic_year_id', $academicYearId);
            }])
            ->orderByDesc('day_of_week')
            ->get();

        if ($schedules->isEmpty()) {
            flashMessage('Tidak ada jadwal tersedia.', 'warning');
            return to_route('students.study-plans.index');
        }

        $studyPlanExists = StudyPlan::query()
            ->where('student_id', $student->id)
            ->where('academic_year_id', $academicYearId)
            ->where('semester', $student->semester)
            ->where('status', '!=', StudyPlanStatus::REJECT)
            ->exists();

        if ($studyPlanExists) {
            flashMessage('Anda sudah mengajukan KRS.', 'warning');
            return to_route('students.study-plans.index');
        }

        return inertia('Students/StudyPlans/Create', [
            'page_setting' => [
                'title' => 'Tambah kartu rencana studi',
                'subtitle' => 'Harap pilih mata kuliah yang sesuai dengan kelas anda',
                'method' => 'POST',
                'action' => route('students.study-plans.store'),
            ],
            'student' => $student,
            'schedules' => ScheduleResource::collection($schedules),
        ]);
    }

    public function store(StudyPlanStudentRequest $request): RedirectResponse
    {
        $student = Auth::user()?->student;

        if (!$student) {
            flashMessage('Gagal menyimpan KRS. Data mahasiswa tidak ditemukan.', 'error');
            return to_route('students.study-plans.index');
        }

        try {
            DB::beginTransaction();

            $studyPlan = StudyPlan::create([
                'student_id' => $student->id,
                'academic_year_id' => activeAcademicYear()->id,
                'semester' => $student->semester,
            ]);

            $studyPlan->schedules()->attach($request->schedule_id);

            DB::commit();

            flashMessage('Berhasil mengajukan KRS');
            return to_route('students.study-plans.index');
        } catch (Throwable $e) {
            DB::rollBack();
            flashMessage(MessageType::ERROR->message(error: $e->getMessage()), 'error');
            return to_route('students.study-plans.index');
        }
    }

   public function show(StudyPlan $studyPlan): Response
{
    $studyPlan->load([
        'schedules.course',
        'schedules.classroom',
        'schedules.academicYear',
        'academicYear',
    ]);

    return inertia('Students/StudyPlans/Show', [
        'page_setting' => [
            'title' => 'Detail kartu rencana studi',
            'subtitle' => 'Anda dapat melihat kartu rencana studi yang sudah anda ajukan sebelumnya',
        ],
        'studyPlan' => new StudyPlanStudentResource($studyPlan),
    ]);
}

}

<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Http\Resources\Student\FeeStudentResource;
use App\Models\Fee;
use Illuminate\Http\Request;
use Inertia\Response;

use function App\Helpers\activeAcademicYear;

class FeeStudentController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $user = auth()->user()->load([
            'student.classroom',
            'student.department',
            'student.faculty',
            'student.feeGroup',
        ]);

        $student = $user->student;

        $fees = Fee::query()
            ->select([
                'fees.id', 'fees.code', 'fees.student_id', 'fees.fee_group_id',
                'fees.academic_year_id', 'fees.semester', 'fees.status', 'fees.created_at'
            ])
            ->filter($request->only(['search']))
            ->sorting($request->only(['field', 'direction']))
            ->where('student_id', $student->id)
            ->where('academic_year_id', activeAcademicYear()->id)
            ->where('semester', $student->semester)
            ->with(['feeGroup', 'academicYear'])
            ->paginate($request->input('load', 10));

        return inertia('Students/Fees/Index', [
            'auth' => [
                'user' => $user, // ✅ cukup pakai $user yang sudah diload
            ],
            'page_setting' => [
                'title' => 'Pembayaran',
                'subtitle' => 'Menampilkan semua data pembayaran UKT yang tersedia',
            ],
            'fees' => FeeStudentResource::collection($fees)->additional([
                'meta' => [
                    'has_pages' => $fees->hasPages(),
                ],
            ]),
            'state' => [
                'page' => $request->input('page', 1),
                'search' => $request->input('search', ''),
                'load' => $request->input('load', 10),
            ],
        ]);
    }
}

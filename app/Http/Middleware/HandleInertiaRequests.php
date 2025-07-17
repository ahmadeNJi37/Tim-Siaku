<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;
use App\Http\Resources\UserSingleResource;
use App\Models\AcademicYear;
use App\Models\Fee;
use App\Enums\FeeStatus;

use function App\Helpers\activeAcademicYear;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),

            // 🔐 Auth user dari UserSingleResource
            'auth' => fn () => $request->user()
                ? new UserSingleResource($request->user())
                : null,

            // 🔁 Flash message dari session
            'flash_message' => fn () => [
                'type' => $request->session()->get('type'),
                'message' => $request->session()->get('message'),
            ],

            // 🔗 Ziggy (route js)
            'ziggy' => fn () => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],

            // 📅 Tahun ajaran aktif
            'academic_year' => fn () =>
                AcademicYear::query()->where('is_active', true)->first(),

            // 💰 Cek status pembayaran UKT mahasiswa
            'checkfee' => fn () =>
                $request->user() &&
                $request->user()->student &&
                activeAcademicYear()
                    ? Fee::query()
                        ->where('student_id', $request->user()->student->id)
                        ->where('academic_year_id', activeAcademicYear()->id)
                        ->where('semester', $request->user()->student->semester)
                        ->where('status', FeeStatus::SUCCESS->value)
                        ->first()
                    : null,
        ];
    }
}

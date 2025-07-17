<?php

namespace App\Http\Controllers\Admin;

use App\Enums\MessageType;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\OperatorRequest;
use App\Http\Resources\Admin\OperatorResource;
use App\Models\Department;
use App\Models\Faculty;
use App\Models\Operator;
use App\Models\User;
use App\Traits\HasFile;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Response;
use Throwable;

use function App\Helpers\flashMessage;

class OperatorController extends Controller
{
    use HasFile;

    public function index(): Response
    {
     $operators = Operator::query()
        ->select([
            'operators.id',
            'operators.user_id',
            'operators.faculty_id',
            'operators.department_id',
            'operators.employee_number',
            'operators.created_at',
        ])
        ->with(['user', 'faculty', 'department'])
        ->filter(request()->only('search'))
        ->sorting(request()->only('field', 'direction'))
        ->whereHas('user', function ($query) {
            $query->whereHas('roles', function ($q) {
                $q->where('name', 'Operator');
            });
        })
        ->paginate(request('load', 10));

     return inertia('Admin/Operators/Index', [
        'page_setting' => [
            'title' => 'Operator',
            'subtitle' => 'Daftar operator yang terdaftar di sistem',
        ],
        'operators' => OperatorResource::collection($operators)->additional([
            'meta' => [
                'has_pages' => $operators->hasPages(),
            ],
        ]),
        'state' => [
            'page' => request('page', 1),
            'search' => request('search', ''),
            'load' => request('load', 10),
        ],
    ]);
   }


    public function create(): Response
    {
        return inertia('Admin/Operators/Create', [
            'page_setting' => [
                'title' => 'Tambah Operator',
                'subtitle' => 'Masukkan data operator baru di sini, lalu klik simpan.',
                'method' => 'POST',
                'action' => route('admin.operators.store'),
            ],
            'faculties' => Faculty::select('id', 'name')->orderBy('name')->get()->map(fn($item) => [
                'value' => $item->id,
                'label' => $item->name,
            ]),
            'departments' => Department::select('id', 'name')->orderBy('name')->get()->map(fn($item) => [
                'value' => $item->id,
                'label' => $item->name,
            ]),
        ]);
    }

    public function store(OperatorRequest $request): RedirectResponse
    {
        try {
            DB::beginTransaction();

            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'avatar' => $this->upload_file($request, 'avatar', 'users'),
            ]);

            $user->operator()->create([
                'faculty_id' => $request->faculty_id,
                'department_id' => $request->department_id,
                'employee_number' => $request->employee_number,
            ]);

            $user->assignRole('Operator');

            DB::commit();
            flashMessage(MessageType::CREATED->message('Operator'));

            return to_route('admin.operators.index');
        } catch (Throwable $e) {
            DB::rollBack();
            flashMessage(MessageType::ERROR->message($e->getMessage()));
            return to_route('admin.operators.index');
        }
    }

    public function edit(Operator $operator): Response
    {
        return inertia('Admin/Operators/Edit', [
            'page_setting' => [
                'title' => 'Edit Operator',
                'subtitle' => 'Perbarui data operator, lalu klik simpan.',
                'method' => 'PUT',
                'action' => route('admin.operators.update', $operator),
            ],
            'operator' => $operator->load('user'),
            'faculties' => Faculty::select('id', 'name')->orderBy('name')->get()->map(fn($item) => [
                'value' => $item->id,
                'label' => $item->name,
            ]),
            'departments' => Department::select('id', 'name')->orderBy('name')->get()->map(fn($item) => [
                'value' => $item->id,
                'label' => $item->name,
            ]),
        ]);
    }

    public function update(Operator $operator, OperatorRequest $request): RedirectResponse
    {
        try {
            DB::beginTransaction();

            $operator->update([
                'faculty_id' => $request->faculty_id,
                'department_id' => $request->department_id,
                'employee_number' => $request->employee_number,
            ]);

            $operator->user()->update([
                'name' => $request->name,
                'email' => $request->email,
                'password' => $request->password
                    ? Hash::make($request->password)
                    : $operator->user->password,
                'avatar' => $this->update_file($request, $operator->user, 'avatar', 'users'),
            ]);

            DB::commit();
            flashMessage(MessageType::UPDATED->message('Operator'));

            return to_route('admin.operators.index');
        } catch (Throwable $e) {
            DB::rollBack();
            flashMessage(MessageType::ERROR->message($e->getMessage()));
            return to_route('admin.operators.index');
        }
    }

    public function destroy(Operator $operator): RedirectResponse
    {
        try {
            $this->delete_file($operator->user, 'avatar');
            $operator->user()->delete();
            $operator->delete();

            flashMessage(MessageType::DELETED->message('Operator'));
            return to_route('admin.operators.index');
        } catch (Throwable $e) {
            flashMessage(MessageType::ERROR->message($e->getMessage()));
            return to_route('admin.operators.index');
        }
    }
}

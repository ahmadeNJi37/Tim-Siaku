<?php

namespace App\Http\Controllers\Admin;

use App\Enums\MessageType;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\RoleRequest;
use App\Http\Resources\Admin\RoleResource;
use Illuminate\Http\Request;
use Inertia\Response;
use Spatie\Permission\Models\Role;
use Illuminate\Http\RedirectResponse;
use Throwable;


class RoleController extends Controller
{
    public function index(): Response
    {
        $roles = Role::query()
            ->select(['id', 'name', 'guard_name', 'created_at'])
            // Pencarian: ganti whereAny jika perlu; contoh pakai REGEXP jika diinginkan:
            ->when(request()->search, function ($query, $search) {
                // Jika ada custom macro whereAny:
                // $query->whereAny(['name', 'guard_name'], 'REGEXP', $search);
                // Contoh pakai where(function) agar safe:
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'REGEXP', $search)
                      ->orWhere('guard_name', 'REGEXP', $search);
                });
            })
            ->when(request()->field && request()->direction, function ($query) {
                $query->orderBy(request()->field, request()->direction);
            })
            ->paginate(request()->load ?? 10);

        return inertia('Admin/Roles/Index', [
            'page_setting' => [
                'title' => 'Peran',
                'subtitle' => 'Menampilkan semua data peran yang tersedia pada universitas ini.',
            ],
            'roles' => RoleResource::collection($roles)
                ->additional([
                    'meta' => [
                        'has_pages' => $roles->hasPages(),
                    ],
                ]),
            'state' => [
                'page' => request()->page ?? 1,
                'search' => request()->search ?? '',
                'load' => request()->load ?? 10,
            ],
        ]);
    }

    public function create(): Response
    {
        return inertia('Admin/Roles/Create', [
            'page_setting' => [
                'title'    => 'Tambah Peran',
                'subtitle' => 'Buat peran baru di sini. Klik simpan setelah selesai.',
                'method'   => 'POST',
                'action'   => route('admin.roles.store'),
            ],
        ]);
    }

    /**
     * Store a newly created role.
     */
    public function store(RoleRequest $request): RedirectResponse
    {
        try {
            // Gunakan validated data
            $data = $request->validated();
            // Spatie Role: biasanya membutuhkan name dan guard_name
            // Jika form hanya mengirim 'name', kita set guard_name default 'web'
            $guardName = $data['guard_name'] ?? 'web';

            Role::create([
                'name'       => $data['name'],
                'guard_name' => 'web',
            ]);

            session()->flash('flash', [
                'type'    => 'success',
                'message' => MessageType::CREATED->message('Peran'),
            ]);

            return to_route('admin.roles.index');
        } catch (Throwable $e) {
            session()->flash('flash', [
                'type'    => 'error',
                'message' => MessageType::ERROR->message($e->getMessage()),
            ]);
            return to_route('admin.roles.index');
        }
    }

    /**
     * Show the form for editing the specified role.
     */
    public function edit(Role $role): Response
    {
        return inertia('Admin/Roles/Edit', [
            'page_setting' => [
                'title'    => 'Edit Peran',
                'subtitle' => 'Edit peran di sini. Klik simpan setelah selesai.',
                'method'   => 'PUT',
                'action'   => route('admin.roles.update', $role),
            ],
            // Kirim data role yang diperlukan ke frontend
            'role' => $role->only(['id', 'name', 'guard_name', 'created_at']),
        ]);
    }

    /**
     * Update the specified role.
     */
    public function update(Role $role, RoleRequest $request): RedirectResponse
    {
        try {
            $data = $request->validated();
            $guardName = $data['guard_name'] ?? $role->guard_name;

            $role->update([
                'name'       => $data['name'],
                'guard_name' => $guardName,
            ]);

            session()->flash('flash', [
                'type'    => 'success',
                'message' => MessageType::UPDATED->message('Peran'),
            ]);

            return to_route('admin.roles.index');
        } catch (Throwable $e) {
            session()->flash('flash', [
                'type'    => 'error',
                'message' => MessageType::ERROR->message($e->getMessage()),
            ]);
            return to_route('admin.roles.index');
        }
    }

    /**
     * Remove the specified role.
     */
    public function destroy(Role $role): RedirectResponse
    {
        try {
            $role->delete();

            session()->flash('flash', [
                'type'    => 'success',
                'message' => MessageType::DELETED->message('Peran'),
            ]);

            return to_route('admin.roles.index');
        } catch (Throwable $e) {
            session()->flash('flash', [
                'type'    => 'error',
                'message' => MessageType::ERROR->message($e->getMessage()),
            ]);

            return to_route('admin.roles.index');
        }
    }
}

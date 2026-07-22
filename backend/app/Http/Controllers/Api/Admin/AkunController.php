<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreAkunRequest;
use App\Http\Resources\Admin\AkunResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Throwable;

class AkunController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = User::query();

        if ($request->filled('role')) {
            $query->where('role', $request->input('role'));
        }

        if ($request->filled('status')) {
            $val = $request->input('status') === 'active' ? 1 : 0;
            $query->where('is_active', $val);
        }

        if ($request->filled('q')) {
            $q = $request->input('q');
            $query->where(function ($qbuilder) use ($q) {
                $qbuilder->where('nama', 'like', "%$q%")
                    ->orWhere('email', 'like', "%$q%");
            });
        }

        $users = $query->paginate(20);

        return response()->json([
            'success' => true,
            'data' => AkunResource::collection($users),
            'meta' => [
                'current_page' => $users->currentPage(),
                'last_page' => $users->lastPage(),
                'per_page' => $users->perPage(),
                'total' => $users->total(),
            ],
        ]);
    }

    public function store(StoreAkunRequest $request): JsonResponse
    {
        try {
            $password = $request->input('password') ?? Str::random(10);

            $user = User::create([
                'nama' => $request->input('nama'),
                'email' => $request->input('email'),
                'username' => $request->input('username') ?? explode('@', $request->input('email'))[0],
                'password' => Hash::make($password),
                'nim' => $request->input('nim'),
                'role' => $request->input('role'),
                'is_active' => true,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Akun berhasil dibuat.',
                'data' => new AkunResource($user),
                'password' => $password,
            ], 201);
        } catch (Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal membuat akun.',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    public function update(StoreAkunRequest $request, int $id): JsonResponse
    {
        $user = User::findOrFail($id);

        $user->fill($request->only(['nama','email','username','nim','role']));
        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Akun diperbarui.',
            'data' => new AkunResource($user),
        ]);
    }

    public function deactivate(int $id): JsonResponse
    {
        $user = User::findOrFail($id);
        $user->is_active = false;
        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Akun dinonaktifkan.',
        ]);
    }

    public function resetPassword(int $id): JsonResponse
    {
        $user = User::findOrFail($id);
        $password = Str::random(10);
        $user->password = Hash::make($password);
        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Password direset.',
            'password' => $password,
        ]);
    }
}

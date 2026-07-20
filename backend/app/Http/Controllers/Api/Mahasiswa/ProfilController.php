<?php

namespace App\Http\Controllers\Api\Mahasiswa;

use App\Http\Controllers\Controller;
use App\Http\Resources\Mahasiswa\ProfilResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Throwable;

class ProfilController extends Controller
{
    /**
     * Menampilkan profil mahasiswa yang sedang login.
     */
    public function show(): JsonResponse
    {
        try {

            $user = Auth::user();

            $user->load([
                'magangPeriode.pembimbing'
            ]);

            return response()->json([

                'success' => true,

                'message' => 'Profil berhasil diambil.',

                'data' => new ProfilResource($user)

            ], 200);

        } catch (Throwable $e) {

            return response()->json([

                'success' => false,

                'message' => 'Terjadi kesalahan pada server.',

                'error' => config('app.debug')
                    ? $e->getMessage()
                    : null

            ], 500);

        }
    }

    /**
     * Memperbarui profil mahasiswa.
     */
    public function update(Request $request): JsonResponse
    {
        $request->validate([

            'nama' => 'required|string|max:255',

            'email' => 'required|email|unique:users,email,' . Auth::id(),

            'username' => 'required|string|max:100|unique:users,username,' . Auth::id(),

        ]);

        DB::beginTransaction();

        try {

            $user = Auth::user();

            $user->update([

                'nama' => $request->nama,

                'email' => $request->email,

                'username' => $request->username,

            ]);

            DB::commit();

            return response()->json([

                'success' => true,

                'message' => 'Profil berhasil diperbarui.',

                'data' => new ProfilResource($user->fresh())

            ], 200);

        } catch (Throwable $e) {

            DB::rollBack();

            return response()->json([

                'success' => false,

                'message' => 'Gagal memperbarui profil.',

                'error' => config('app.debug')
                    ? $e->getMessage()
                    : null

            ], 500);

        }
    }

    /**
     * Mengubah password mahasiswa.
     */
    public function changePassword(Request $request): JsonResponse
    {
        $request->validate([

            'password_lama' => 'required',

            'password_baru' => 'required|string|min:8|confirmed',

        ]);

        DB::beginTransaction();

        try {

            $user = Auth::user();

            if (!Hash::check($request->password_lama, $user->password)) {

                return response()->json([

                    'success' => false,

                    'message' => 'Password lama tidak sesuai.'

                ], 422);

            }

            $user->update([

                'password' => Hash::make($request->password_baru)

            ]);

            DB::commit();

            return response()->json([

                'success' => true,

                'message' => 'Password berhasil diubah.'

            ], 200);

        } catch (Throwable $e) {

            DB::rollBack();

            return response()->json([

                'success' => false,

                'message' => 'Gagal mengubah password.',

                'error' => config('app.debug')
                    ? $e->getMessage()
                    : null

            ], 500);

        }
    }
}
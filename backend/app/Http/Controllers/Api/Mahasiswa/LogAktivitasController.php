<?php

namespace App\Http\Controllers\Api\Mahasiswa;

use App\Http\Controllers\Controller;
use App\Http\Requests\Mahasiswa\StoreLogAktivitasRequest;
use App\Http\Requests\Mahasiswa\UpdateLogAktivitasRequest;
use App\Http\Resources\Mahasiswa\LogAktivitasResource;
use App\Models\LogAktivitas;
use App\Models\MagangPeriode;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Throwable;

class LogAktivitasController extends Controller
{
    /**
     * Menampilkan daftar log aktivitas mahasiswa.
     *
     * Fitur:
     * - Pagination
     * - Search judul
     * - Filter status
     * - Filter tanggal
     */
    public function index(Request $request): JsonResponse
    {
        try {

            $user = Auth::user();

            $query = LogAktivitas::with([
                'periode',
                'lampiran'
            ])
            ->where('mahasiswa_id', $user->id);

            /**
             * Search Judul
             */
            if ($request->filled('search')) {

                $query->where(function ($q) use ($request) {

                    $q->where('judul', 'like', '%' . $request->search . '%')
                      ->orWhere('deskripsi', 'like', '%' . $request->search . '%');

                });

            }

            /**
             * Filter Status
             */
            if ($request->filled('status')) {

                $query->where('status', $request->status);

            }

            /**
             * Filter Tanggal Awal
             */
            if ($request->filled('tanggal_mulai')) {

                $query->whereDate(
                    'tanggal',
                    '>=',
                    $request->tanggal_mulai
                );

            }

            /**
             * Filter Tanggal Akhir
             */
            if ($request->filled('tanggal_selesai')) {

                $query->whereDate(
                    'tanggal',
                    '<=',
                    $request->tanggal_selesai
                );

            }

            /**
             * Sorting
             */
            $query->orderBy('tanggal', 'desc')
                  ->orderBy('created_at', 'desc');

            /**
             * Pagination
             */
            $perPage = $request->integer('per_page', 10);

            $logAktivitas = $query->paginate($perPage);

            return response()->json([

                'success' => true,

                'message' => 'Data log aktivitas berhasil diambil.',

                'data' => LogAktivitasResource::collection($logAktivitas),

                'pagination' => [

                    'current_page' => $logAktivitas->currentPage(),

                    'last_page' => $logAktivitas->lastPage(),

                    'per_page' => $logAktivitas->perPage(),

                    'total_data' => $logAktivitas->total(),

                ]

            ], 200);

        } catch (Throwable $e) {

            return response()->json([

                'success' => false,

                'message' => 'Terjadi kesalahan pada server.',

                'error' => config('app.debug')
                    ? $e->getMessage()
                    : null,

            ], 500);

        }
    }
    /**
     * Menyimpan log aktivitas baru.
     */
    public function store(StoreLogAktivitasRequest $request): JsonResponse
    {
        DB::beginTransaction();

        try {

            $user = Auth::user();

            // Pastikan periode magang milik mahasiswa
            $periode = MagangPeriode::where('id', $request->periode_id)
                ->where('mahasiswa_id', $user->id)
                ->first();

            if (!$periode) {

                return response()->json([
                    'success' => false,
                    'message' => 'Periode magang tidak ditemukan.'
                ], 404);

            }

            $data = $request->validated();

            $logAktivitas = LogAktivitas::create([

                'mahasiswa_id' => $user->id,

                'periode_id' => $periode->id,

                'tanggal' => $data['tanggal'],

                'judul' => $data['judul'],

                'deskripsi' => $data['deskripsi'],

                'hasil' => $data['hasil'],

                'jam_mulai' => $data['jam_mulai'] ?? null,

                'jam_selesai' => $data['jam_selesai'] ?? null,

                'status' => $data['status'],

                'submitted_at' => $data['status'] === 'submitted'
                    ? now()
                    : null,

            ]);

            DB::commit();

            return response()->json([

                'success' => true,

                'message' => 'Log aktivitas berhasil ditambahkan.',

                'data' => new LogAktivitasResource($logAktivitas)

            ], 201);

        } catch (Throwable $e) {

            DB::rollBack();

            return response()->json([

                'success' => false,

                'message' => 'Gagal menambahkan log aktivitas.',

                'error' => config('app.debug')
                    ? $e->getMessage()
                    : null,

            ], 500);

        }
    }

        /**
     * Menampilkan detail log aktivitas.
     */
    public function show(int $id): JsonResponse
    {
        try {

            $logAktivitas = LogAktivitas::with([
                'periode',
                'lampiran',
                'penilaian'
            ])
            ->where('id', $id)
            ->where('mahasiswa_id', Auth::id())
            ->first();

            if (!$logAktivitas) {

                return response()->json([
                    'success' => false,
                    'message' => 'Log aktivitas tidak ditemukan.'
                ], 404);

            }

            return response()->json([

                'success' => true,

                'message' => 'Detail log aktivitas berhasil diambil.',

                'data' => new LogAktivitasResource($logAktivitas)

            ], 200);

        } catch (Throwable $e) {

            return response()->json([

                'success' => false,

                'message' => 'Terjadi kesalahan pada server.',

                'error' => config('app.debug')
                    ? $e->getMessage()
                    : null,

            ], 500);

        }
    }

        /**
     * Memperbarui log aktivitas.
     */
    public function update(UpdateLogAktivitasRequest $request, int $id): JsonResponse
    {
        DB::beginTransaction();

        try {

            $logAktivitas = LogAktivitas::where('id', $id)
                ->where('mahasiswa_id', Auth::id())
                ->first();

            if (!$logAktivitas) {

                return response()->json([
                    'success' => false,
                    'message' => 'Log aktivitas tidak ditemukan.'
                ], 404);

            }

            /**
             * Business Rule
             * Hanya Draft dan Revision yang boleh diedit
             */
            if (!in_array($logAktivitas->status, ['draft', 'revision'])) {

                return response()->json([
                    'success' => false,
                    'message' => 'Log aktivitas yang sudah dikirim atau disetujui tidak dapat diubah.'
                ], 422);

            }

            /**
             * Validasi periode magang
             */
            $periode = MagangPeriode::where('id', $request->periode_id)
                ->where('mahasiswa_id', Auth::id())
                ->first();

            if (!$periode) {

                return response()->json([
                    'success' => false,
                    'message' => 'Periode magang tidak ditemukan.'
                ], 404);

            }

            $data = $request->validated();

            $logAktivitas->update([

                'periode_id' => $periode->id,

                'tanggal' => $data['tanggal'],

                'judul' => $data['judul'],

                'deskripsi' => $data['deskripsi'],

                'hasil' => $data['hasil'],

                'jam_mulai' => $data['jam_mulai'] ?? null,

                'jam_selesai' => $data['jam_selesai'] ?? null,

                'status' => $data['status'],

                'submitted_at' => $data['status'] === 'submitted'
                    ? now()
                    : null,

            ]);

            DB::commit();

            return response()->json([

                'success' => true,

                'message' => 'Log aktivitas berhasil diperbarui.',

                'data' => new LogAktivitasResource(
                    $logAktivitas->fresh([
                        'periode',
                        'lampiran',
                        'penilaian'
                    ])
                )

            ], 200);

        } catch (Throwable $e) {

            DB::rollBack();

            return response()->json([

                'success' => false,

                'message' => 'Gagal memperbarui log aktivitas.',

                'error' => config('app.debug')
                    ? $e->getMessage()
                    : null,

            ], 500);

        }
    }
        /**
     * Menghapus log aktivitas.
     */
    public function destroy(int $id): JsonResponse
    {
        DB::beginTransaction();

        try {

            $logAktivitas = LogAktivitas::with('lampiran')
                ->where('id', $id)
                ->where('mahasiswa_id', Auth::id())
                ->first();

            if (!$logAktivitas) {

                return response()->json([
                    'success' => false,
                    'message' => 'Log aktivitas tidak ditemukan.'
                ], 404);

            }

            /**
             * Business Rule
             * Hanya Draft yang boleh dihapus
             */
            if ($logAktivitas->status !== 'draft') {

                return response()->json([
                    'success' => false,
                    'message' => 'Log aktivitas yang sudah dikirim atau diverifikasi tidak dapat dihapus.'
                ], 422);

            }

            /**
             * Hapus seluruh lampiran dari storage
             */
            foreach ($logAktivitas->lampiran as $lampiran) {

                if ($lampiran->file_path &&
                    \Storage::disk('public')->exists($lampiran->file_path)) {

                    \Storage::disk('public')->delete($lampiran->file_path);

                }

                $lampiran->delete();
            }

            /**
             * Soft Delete Log Aktivitas
             */
            $logAktivitas->delete();

            DB::commit();

            return response()->json([

                'success' => true,

                'message' => 'Log aktivitas berhasil dihapus.'

            ], 200);

        } catch (Throwable $e) {

            DB::rollBack();

            return response()->json([

                'success' => false,

                'message' => 'Gagal menghapus log aktivitas.',

                'error' => config('app.debug')
                    ? $e->getMessage()
                    : null,

            ], 500);

        }
    }

}

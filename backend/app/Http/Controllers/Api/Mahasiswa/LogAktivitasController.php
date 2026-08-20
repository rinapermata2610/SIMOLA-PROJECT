<?php

namespace App\Http\Controllers\Api\Mahasiswa;

use App\Http\Controllers\Controller;
use App\Http\Requests\Mahasiswa\StoreLogAktivitasRequest;
use App\Http\Requests\Mahasiswa\UpdateLogAktivitasRequest;
use App\Http\Resources\Mahasiswa\LogAktivitasResource;
use App\Models\LogAktivitas;
use App\Models\LampiranBukti;
use App\Models\MagangPeriode;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Throwable;

class LogAktivitasController extends Controller
{
    /**
     * Menampilkan daftar log aktivitas mahasiswa.
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $user = Auth::user();

            $query = LogAktivitas::with(['periode', 'lampiran'])
                ->where('mahasiswa_id', $user->id);

            if ($request->filled('search')) {
                $query->where(function ($q) use ($request) {
                    $q->where('judul', 'like', '%' . $request->search . '%')
                      ->orWhere('deskripsi', 'like', '%' . $request->search . '%');
                });
            }

            if ($request->filled('status')) {
                $query->where('status', $request->status);
            }

            if ($request->filled('tanggal_mulai')) {
                $query->whereDate('tanggal', '>=', $request->tanggal_mulai);
            }

            if ($request->filled('tanggal_selesai')) {
                $query->whereDate('tanggal', '<=', $request->tanggal_selesai);
            }

            $query->orderBy('tanggal', 'desc')
                  ->orderBy('created_at', 'desc');

            $perPage = $request->integer('per_page', 10);
            $logAktivitas = $query->paginate($perPage);

            return response()->json([
                'success' => true,
                'message' => 'Data log aktivitas berhasil diambil.',
                'data'    => LogAktivitasResource::collection($logAktivitas),
                'pagination' => [
                    'current_page' => $logAktivitas->currentPage(),
                    'last_page'    => $logAktivitas->lastPage(),
                    'per_page'     => $logAktivitas->perPage(),
                    'total_data'   => $logAktivitas->total(),
                ]
            ], 200);

        } catch (Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan pada server.',
                'error'   => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Menyimpan log aktivitas baru (termasuk upload lampiran opsional).
     */
    public function store(StoreLogAktivitasRequest $request): JsonResponse
    {
        DB::beginTransaction();

        try {
            $user = Auth::user();

            // Ambil periode magang aktif (opsional fallback jika dikirim dari frontend)
            $periodeId = $request->periode_id
                ?? MagangPeriode::where('mahasiswa_id', $user->id)
                    ->where('status', 'aktif')
                    ->value('id');

            if (!$periodeId) {
                return response()->json([
                    'success' => false,
                    'message' => 'Anda belum memiliki periode magang aktif.',
                ], 422);
            }

            $data = $request->validated();

            // 1. Simpan Data Log Aktivitas
            $logAktivitas = LogAktivitas::create([
                'mahasiswa_id' => $user->id,
                'periode_id'   => $periodeId,
                'tanggal'      => $data['tanggal'],
                'judul'        => $data['judul'],
                'deskripsi'    => $data['deskripsi'],
                'hasil'        => $data['hasil'],
                'status'       => $data['status'], // 'draft' atau 'submitted'
                'submitted_at' => $data['status'] === 'submitted' ? now() : null,
            ]);

            // 2. Simpan Lampiran Bukti jika ada file diunggah
            if ($request->hasFile('lampiran')) {
                foreach ($request->file('lampiran') as $file) {
                    $filePath = $file->store('lampiran_bukti', 'public');

                    LampiranBukti::create([
                        'log_aktivitas_id' => $logAktivitas->id,
                        'nama_file'        => $file->getClientOriginalName(),
                        'file_path'        => $filePath,
                        'file_type'        => $file->getClientOriginalExtension(),
                        'file_size'        => $file->getSize(),
                    ]);
                }
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Aktivitas magang berhasil disimpan.',
                'data'    => new LogAktivitasResource($logAktivitas->load('lampiran'))
            ], 201);

        } catch (Throwable $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Gagal menyimpan aktivitas magang.',
                'error'   => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Menampilkan detail log aktivitas.
     */
    public function show(int $id): JsonResponse
    {
        try {
            $logAktivitas = LogAktivitas::with(['periode', 'lampiran', 'penilaian'])
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
                'data'    => new LogAktivitasResource($logAktivitas)
            ], 200);

        } catch (Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan pada server.',
                'error'   => config('app.debug') ? $e->getMessage() : null,
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

            if (!in_array($logAktivitas->status, ['draft', 'revision'])) {
                return response()->json([
                    'success' => false,
                    'message' => 'Aktivitas yang sudah dikirim atau disetujui tidak dapat diubah.'
                ], 422);
            }

            $data = $request->validated();

            $logAktivitas->update([
                'tanggal'      => $data['tanggal'],
                'judul'        => $data['judul'],
                'deskripsi'    => $data['deskripsi'],
                'hasil'        => $data['hasil'],
                'status'       => $data['status'],
                'submitted_at' => $data['status'] === 'submitted' ? now() : null,
            ]);

            // Jika mengunggah lampiran baru
            if ($request->hasFile('lampiran')) {
                foreach ($request->file('lampiran') as $file) {
                    $filePath = $file->store('lampiran_bukti', 'public');

                    LampiranBukti::create([
                        'log_aktivitas_id' => $logAktivitas->id,
                        'nama_file'        => $file->getClientOriginalName(),
                        'file_path'        => $filePath,
                        'file_type'        => $file->getClientOriginalExtension(),
                        'file_size'        => $file->getSize(),
                    ]);
                }
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Aktivitas magang berhasil diperbarui.',
                'data'    => new LogAktivitasResource($logAktivitas->fresh(['periode', 'lampiran']))
            ], 200);

        } catch (Throwable $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Gagal memperbarui aktivitas magang.',
                'error'   => config('app.debug') ? $e->getMessage() : null,
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

            if ($logAktivitas->status !== 'draft') {
                return response()->json([
                    'success' => false,
                    'message' => 'Aktivitas yang sudah dikirim tidak dapat dihapus.'
                ], 422);
            }

            foreach ($logAktivitas->lampiran as $lampiran) {
                if ($lampiran->file_path && Storage::disk('public')->exists($lampiran->file_path)) {
                    Storage::disk('public')->delete($lampiran->file_path);
                }
                $lampiran->delete();
            }

            $logAktivitas->delete();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Aktivitas magang berhasil dihapus.'
            ], 200);

        } catch (Throwable $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Gagal menghapus aktivitas magang.',
                'error'   => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }
}
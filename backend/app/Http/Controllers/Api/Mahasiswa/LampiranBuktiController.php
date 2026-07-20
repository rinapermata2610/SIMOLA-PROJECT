<?php

namespace App\Http\Controllers\Api\Mahasiswa;

use App\Http\Controllers\Controller;
use App\Http\Requests\Mahasiswa\UploadLampiranRequest;
use App\Http\Resources\Mahasiswa\LampiranBuktiResource;
use App\Models\LampiranBukti;
use App\Models\LogAktivitas;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Throwable;

class LampiranBuktiController extends Controller
{
    /**
     * Menampilkan seluruh lampiran berdasarkan log aktivitas.
     */
    public function index(int $logId): JsonResponse
    {
        try {

            $log = LogAktivitas::where('id', $logId)
                ->where('mahasiswa_id', Auth::id())
                ->first();

            if (!$log) {
                return response()->json([
                    'success' => false,
                    'message' => 'Log aktivitas tidak ditemukan.'
                ], 404);
            }

            $lampiran = LampiranBukti::where('log_aktivitas_id', $logId)
                ->latest()
                ->get();

            return response()->json([
                'success' => true,
                'message' => 'Data lampiran berhasil diambil.',
                'data' => LampiranBuktiResource::collection($lampiran)
            ]);

        } catch (Throwable $e) {

            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan pada server.',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);

        }
    }

    /**
     * Upload lampiran bukti.
     */
    public function store(UploadLampiranRequest $request): JsonResponse
    {
        DB::beginTransaction();

        try {

            $log = LogAktivitas::where('id', $request->log_aktivitas_id)
                ->where('mahasiswa_id', Auth::id())
                ->first();

            if (!$log) {
                return response()->json([
                    'success' => false,
                    'message' => 'Log aktivitas tidak ditemukan.'
                ], 404);
            }

            if (in_array($log->status, ['submitted', 'approved'])) {
                return response()->json([
                    'success' => false,
                    'message' => 'Lampiran tidak dapat ditambahkan.'
                ], 422);
            }

            $file = $request->file('file');

            $path = $file->store('lampiran-bukti', 'public');

            $lampiran = LampiranBukti::create([
                'log_aktivitas_id' => $log->id,
                'nama_file' => $file->getClientOriginalName(),
                'file_path' => $path,
                'tipe_file' => $file->getClientMimeType(),
                'ukuran_file' => $file->getSize(),
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Lampiran berhasil diunggah.',
                'data' => new LampiranBuktiResource($lampiran)
            ], 201);

        } catch (Throwable $e) {

            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Upload lampiran gagal.',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);

        }
    }

    /**
     * Detail lampiran.
     */
    public function show(int $id): JsonResponse
    {
        try {

            $lampiran = LampiranBukti::with('logAktivitas')
                ->find($id);

            if (!$lampiran) {
                return response()->json([
                    'success' => false,
                    'message' => 'Lampiran tidak ditemukan.'
                ], 404);
            }

            if ($lampiran->logAktivitas->mahasiswa_id != Auth::id()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Akses ditolak.'
                ], 403);
            }

            return response()->json([
                'success' => true,
                'message' => 'Detail lampiran berhasil diambil.',
                'data' => new LampiranBuktiResource($lampiran)
            ]);

        } catch (Throwable $e) {

            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan pada server.',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);

        }
    }

    /**
     * Download lampiran.
     */
    public function download(int $id)
    {
        $lampiran = LampiranBukti::with('logAktivitas')->findOrFail($id);

        abort_if(
            $lampiran->logAktivitas->mahasiswa_id != Auth::id(),
            403
        );

        return Storage::disk('public')->download(
            $lampiran->file_path,
            $lampiran->nama_file
        );
    }

    /**
     * Hapus lampiran.
     */
    public function destroy(int $id): JsonResponse
    {
        DB::beginTransaction();

        try {

            $lampiran = LampiranBukti::with('logAktivitas')
                ->find($id);

            if (!$lampiran) {
                return response()->json([
                    'success' => false,
                    'message' => 'Lampiran tidak ditemukan.'
                ], 404);
            }

            if ($lampiran->logAktivitas->mahasiswa_id != Auth::id()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Akses ditolak.'
                ], 403);
            }

            if (Storage::disk('public')->exists($lampiran->file_path)) {
                Storage::disk('public')->delete($lampiran->file_path);
            }

            $lampiran->delete();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Lampiran berhasil dihapus.'
            ]);

        } catch (Throwable $e) {

            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Gagal menghapus lampiran.',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);

        }
    }
}
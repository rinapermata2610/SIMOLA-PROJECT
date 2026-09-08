<?php

namespace App\Http\Controllers\Api\Pembimbing;

use App\Http\Controllers\Controller;
use App\Http\Requests\Pembimbing\VerifikasiLogAktivitasRequest;
use App\Http\Resources\Pembimbing\LogAktivitasResource;
use App\Models\LampiranBukti;
use App\Models\LogAktivitas;
use App\Models\PenilaianBulanan;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Carbon;
use Throwable;

class LogAktivitasController extends Controller
{
    /**
     * List log aktivitas mahasiswa bimbingan.
     *
     * GET /api/pembimbing/log-aktivitas
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $user = Auth::user();

            $query = LogAktivitas::with(['mahasiswa', 'periode', 'penilaian', 'lampiran'])
                ->whereHas('periode', function ($q) use ($user) {
                    $q->where('pembimbing_id', $user->id);
                });

            if ($request->filled('mahasiswa_id')) {
                $query->where('mahasiswa_id', $request->input('mahasiswa_id'));
            }

            if ($request->filled('status')) {
                $query->where('status', $request->input('status'));
            }

            if ($request->filled('tanggal_mulai') && $request->filled('tanggal_selesai')) {
                $query->whereBetween('tanggal', [
                    $request->input('tanggal_mulai'),
                    $request->input('tanggal_selesai'),
                ]);
            }

            $perPage = min(max($request->integer('per_page', 15), 1), 100);
            $logs = $query->latest('tanggal')->latest('updated_at')->paginate($perPage);

            return response()->json([
                'success' => true,
                'message' => 'Daftar log aktivitas pembimbing berhasil dimuat.',
                'data' => LogAktivitasResource::collection($logs),
                'meta' => [
                    'current_page' => $logs->currentPage(),
                    'last_page' => $logs->lastPage(),
                    'per_page' => $logs->perPage(),
                    'total' => $logs->total(),
                ],
            ], 200);
        } catch (Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan pada server.',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Show detail log aktivitas pembimbing.
     *
     * GET /api/pembimbing/log-aktivitas/{id}
     */
    public function show(int $id): JsonResponse
    {
        try {
            $user = Auth::user();

            $log = LogAktivitas::with(['mahasiswa', 'periode', 'penilaian', 'lampiran'])
                ->where('id', $id)
                ->whereHas('periode', function ($q) use ($user) {
                    $q->where('pembimbing_id', $user->id);
                })
                ->first();

            if (!$log) {
                return response()->json([
                    'success' => false,
                    'message' => 'Log aktivitas tidak ditemukan atau tidak dalam bimbingan Anda.',
                ], 404);
            }

            return response()->json([
                'success' => true,
                'message' => 'Detail log aktivitas berhasil dimuat.',
                'data' => new LogAktivitasResource($log),
            ], 200);
        } catch (Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan pada server.',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Tampilkan file lampiran untuk pembimbing yang menangani mahasiswa terkait.
     *
     * GET /api/pembimbing/lampiran/{id}/view
     */
    public function viewAttachment(int $id)
    {
        $user = Auth::user();

        $lampiran = LampiranBukti::with('logAktivitas.periode')
            ->whereHas('logAktivitas.periode', function ($query) use ($user) {
                $query->where('pembimbing_id', $user->id);
            })
            ->findOrFail($id);

        abort_unless(
            $lampiran->file_path && Storage::disk('public')->exists($lampiran->file_path),
            404,
            'File lampiran tidak ditemukan.'
        );

        return response()->file(
            Storage::disk('public')->path($lampiran->file_path),
            [
                'Content-Disposition' => 'inline; filename="' . addslashes($lampiran->nama_file) . '"',
            ]
        );
    }

    /**
     * Verify a submitted log activity.
     *
     * PUT /api/pembimbing/log-aktivitas/{id}/verify
     */
    public function verify(VerifikasiLogAktivitasRequest $request, int $id): JsonResponse
    {
        try {
            $user = Auth::user();

            $log = LogAktivitas::with(['periode'])
                ->where('id', $id)
                ->whereHas('periode', function ($q) use ($user) {
                    $q->where('pembimbing_id', $user->id);
                })
                ->first();

            if (!$log) {
                return response()->json([
                    'success' => false,
                    'message' => 'Log aktivitas tidak ditemukan atau tidak dalam bimbingan Anda.',
                ], 404);
            }

            if ($log->status !== 'submitted') {
                return response()->json([
                    'success' => false,
                    'message' => 'Hanya log dengan status submitted yang dapat diverifikasi.',
                ], 422);
            }

            $penilaian = PenilaianBulanan::updateOrCreate(
                [
                    'log_aktivitas_id' => $log->id,
                    'pembimbing_id' => $user->id,
                ],
                [
                    'status' => $request->input('status'),
                    'komentar' => $request->input('komentar'),
                    'verified_at' => Carbon::now(),
                ]
            );

            $log->status = $request->input('status');
            $log->save();

            return response()->json([
                'success' => true,
                'message' => 'Log aktivitas berhasil diverifikasi.',
                'data' => new LogAktivitasResource($log->load(['mahasiswa', 'periode', 'penilaian'])),
            ], 200);
        } catch (Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan pada server.',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }
}

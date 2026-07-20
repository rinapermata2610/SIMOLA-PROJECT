<?php

namespace App\Http\Controllers\Api\Mahasiswa;

use App\Http\Controllers\Controller;
use App\Http\Resources\Mahasiswa\DashboardResource;
use App\Models\LogAktivitas;
use App\Models\MagangPeriode;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Throwable;

class DashboardController extends Controller
{
    /**
     * Menampilkan dashboard mahasiswa.
     *
     * GET /api/mahasiswa/dashboard
     */
    public function index(): JsonResponse
    {
        try {

            // ===========================
            // User Login
            // ===========================
            $user = Auth::user();

            // ===========================
            // Periode Magang Aktif
            // ===========================
            $periode = MagangPeriode::with([
                'pembimbing:id,nama,email',
            ])
            ->where('mahasiswa_id', $user->id)
            ->first();

            if (!$periode) {

                return response()->json([
                    'success' => false,
                    'message' => 'Periode magang tidak ditemukan.',
                    'data' => null,
                ],404);

            }

            // ===========================
            // Query Log Aktivitas
            // ===========================
            $query = LogAktivitas::where('mahasiswa_id', $user->id);

            // ===========================
            // Statistik
            // ===========================
            $totalAktivitas = (clone $query)->count();

            $totalDraft = (clone $query)
                ->where('status','draft')
                ->count();

            $totalSubmitted = (clone $query)
                ->where('status','submitted')
                ->count();

            $totalApproved = (clone $query)
                ->where('status','approved')
                ->count();

            $totalRevision = (clone $query)
                ->where('status','revision')
                ->count();

            // ===========================
            // Progress Magang
            // ===========================
            $progress = 0;

            if ($totalAktivitas > 0) {

                $progress = round(
                    ($totalApproved / $totalAktivitas) * 100,
                    2
                );

            }

            // ===========================
            // Aktivitas Terbaru
            // ===========================
            $aktivitasTerbaru = LogAktivitas::where('mahasiswa_id',$user->id)
                ->latest('tanggal')
                ->latest('created_at')
                ->limit(5)
                ->get();

            // ===========================
            // Response
            // ===========================
            return response()->json([

                'success' => true,

                'message' => 'Dashboard berhasil dimuat.',

                'data' => new DashboardResource([

                    'user' => $user,

                    'periode' => $periode,

                    'statistik' => [

                        'total_aktivitas' => $totalAktivitas,

                        'draft' => $totalDraft,

                        'submitted' => $totalSubmitted,

                        'approved' => $totalApproved,

                        'revision' => $totalRevision,

                        'progress' => $progress,

                    ],

                    'aktivitas_terbaru' => $aktivitasTerbaru,

                ])

            ],200);

        } catch (Throwable $e) {

            return response()->json([

                'success' => false,

                'message' => 'Terjadi kesalahan pada server.',

                'error' => config('app.debug')
                    ? $e->getMessage()
                    : null,

            ],500);

        }
    }
}
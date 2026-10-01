<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\MagangPeriode;
use App\Models\PeriodeBatch;
use App\Models\User;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function index(): JsonResponse
    {
        $mahasiswaActive = User::where('role','mahasiswa')->where('is_active',1)->count();
        $pembimbingActive = User::where('role','pembimbing')->where('is_active',1)->count();

        $relasiBelum = User::where('role','mahasiswa')
            ->whereDoesntHave('periodeMagang', function ($q) {
                $q->where('status','aktif');
            })->count();

        $periodeBerjalan = PeriodeBatch::where('status', 'aktif')->count();
        $periodeSelesai = PeriodeBatch::where('status', 'selesai')->count();

        $periodeTerbaru = PeriodeBatch::withCount(['mahasiswaPeriode as jumlah_peserta'])
            ->select(
                'id',
                'instansi',
                'tanggal_mulai',
                'tanggal_selesai',
                'status',
            )
            ->orderByDesc('tanggal_mulai')
            ->limit(5)
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'mahasiswa_active' => $mahasiswaActive,
                'pembimbing_active' => $pembimbingActive,
                'relasi_belum' => $relasiBelum,
                'periode_berjalan' => $periodeBerjalan,
                'periode_selesai' => $periodeSelesai,
                'periode_terbaru' => $periodeTerbaru,
            ],
        ]);
    }
}

<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\MagangPeriode;
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

        $periodeBerjalan = MagangPeriode::where('status','aktif')->count();
        $periodeSelesai = MagangPeriode::where('status','selesai')->count();

        return response()->json([
            'success' => true,
            'data' => [
                'mahasiswa_active' => $mahasiswaActive,
                'pembimbing_active' => $pembimbingActive,
                'relasi_belum' => $relasiBelum,
                'periode_berjalan' => $periodeBerjalan,
                'periode_selesai' => $periodeSelesai,
            ],
        ]);
    }
}

<?php

namespace App\Http\Controllers\Api\Pembimbing;

use App\Http\Controllers\Controller;
use App\Models\Absensi;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AbsensiController extends Controller
{
    public function index(Request $request, int $mahasiswaId): JsonResponse
    {
        $isAssigned = User::whereKey($mahasiswaId)
            ->whereHas('periodeMagang', function ($query) {
                $query->where('pembimbing_id', Auth::id());
            })
            ->exists();

        if (!$isAssigned) {
            return response()->json([
                'success' => false,
                'message' => 'Mahasiswa tidak termasuk dalam bimbingan Anda.',
            ], 403);
        }

        $month = $request->input('bulan', Carbon::now()->format('Y-m'));
        $monthDate = Carbon::createFromFormat('Y-m', $month);

        $records = Absensi::where('mahasiswa_id', $mahasiswaId)
            ->whereBetween('tanggal', [
                $monthDate->copy()->startOfMonth()->toDateString(),
                $monthDate->copy()->endOfMonth()->toDateString(),
            ])
            ->orderByDesc('tanggal')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $records->map(fn (Absensi $item) => [
                'id' => $item->id,
                'tanggal' => $item->tanggal?->format('Y-m-d'),
                'jam_masuk' => $item->jam_masuk?->format('H:i'),
                'status_masuk' => $item->status_masuk,
                'keterlambatan_masuk_menit' => $item->keterlambatan_masuk_menit,
                'jam_keluar' => $item->jam_keluar?->format('H:i'),
                'status_keluar' => $item->status_keluar,
                'keterlambatan_keluar_menit' => $item->keterlambatan_keluar_menit,
            ])->values(),
            'summary' => [
                'hari_absen' => $records->count(),
                'hadir_masuk' => $records->whereNotNull('jam_masuk')->count(),
                'hadir_keluar' => $records->whereNotNull('jam_keluar')->count(),
                'terlambat_masuk' => $records->where('status_masuk', 'terlambat')->count(),
            ],
            'bulan' => $month,
        ]);
    }
}

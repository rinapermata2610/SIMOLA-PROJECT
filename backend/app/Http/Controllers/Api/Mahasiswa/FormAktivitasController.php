<?php

namespace App\Http\Controllers\Api\Mahasiswa;

use App\Http\Controllers\Controller;
use App\Models\LogAktivitas;
use App\Models\MagangPeriode;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FormAktivitasController extends Controller
{
    /**
     * ============================================================
     * Cek Form Aktivitas berdasarkan tanggal
     * ============================================================
     */
    public function check(Request $request)
    {
        $request->validate([
            'tanggal' => ['required', 'date'],
        ]);

        $user = Auth::user();

        $tanggal = Carbon::parse($request->tanggal);

        $periode = MagangPeriode::where('tanggal_mulai', '<=', $tanggal)
            ->where('tanggal_selesai', '>=', $tanggal)
            ->first();

        if (!$periode) {
            return response()->json([
                'success' => false,
                'message' => 'Tanggal berada di luar periode magang.',
            ], 422);
        }

        $log = LogAktivitas::where('mahasiswa_id', $user->id)
            ->whereDate('tanggal', $tanggal)
            ->first();

        return response()->json([
            'success' => true,
            'mode' => $log ? 'edit' : 'create',
            'data' => $log,
        ]);
    }

    /**
     * ============================================================
     * Simpan Form Aktivitas
     * ============================================================
     */
    public function store(Request $request)
    {

    }

    /**
     * ============================================================
     * Update Form Aktivitas
     * ============================================================
     */
    public function update(Request $request, $id)
    {

    }

    /**
     * ============================================================
     * Hapus Form Aktivitas
     * ============================================================
     */
    public function destroy($id)
    {

    }
}
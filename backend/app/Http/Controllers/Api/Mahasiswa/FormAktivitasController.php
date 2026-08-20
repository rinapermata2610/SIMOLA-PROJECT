<?php

namespace App\Http\Controllers\Api\Mahasiswa;

use App\Http\Controllers\Controller;
use App\Models\LogAktivitas;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FormAktivitasController extends Controller
{
    /**
     * Mengecek apakah tanggal tertentu sudah diisi log aktivitasnya.
     */
    public function check(Request $request): JsonResponse
    {
        $request->validate([
            'tanggal' => 'required|date',
        ]);

        $log = LogAktivitas::where('mahasiswa_id', Auth::id())
            ->whereDate('tanggal', $request->tanggal)
            ->first();

        return response()->json([
            'success'   => true,
            'is_filled' => $log ? true : false,
            'data'      => $log ? [
                'id'     => $log->id,
                'status' => $log->status,
            ] : null,
        ]);
    }
}
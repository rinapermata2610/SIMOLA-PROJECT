<?php

namespace App\Http\Controllers\Api\Pembimbing;

use App\Http\Controllers\Controller;
use App\Http\Resources\Pembimbing\MahasiswaBimbinganResource;
use App\Models\MagangPeriode;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Throwable;

class DashboardController extends Controller
{
    /**
     * List mahasiswa bimbingan pembimbing yang login.
     *
     * GET /api/pembimbing/dashboard
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $user = Auth::user();

            $query = MagangPeriode::with(['mahasiswa'])
                ->where('pembimbing_id', $user->id);

            if ($request->filled('status')) {
                $query->where('status', $request->input('status'));
            }

            if ($request->filled('search')) {
                $query->whereHas('mahasiswa', function ($q) use ($request) {
                    $q->where('nama', 'like', '%'.$request->input('search').'%');
                });
            }

            $periode = $query->get();

            return response()->json([
                'success' => true,
                'message' => 'Data dashboard pembimbing berhasil dimuat.',
                'data' => MahasiswaBimbinganResource::collection(
                    $periode->map(fn($item) => $item->mahasiswa)
                ),
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

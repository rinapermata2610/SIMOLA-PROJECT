<?php

namespace App\Http\Controllers\Api\Pembimbing;

use App\Http\Controllers\Controller;
use App\Http\Resources\PenilaianAkhirResource;
use App\Models\MagangPeriode;
use App\Models\PenilaianAkhir;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PenilaianAkhirController extends Controller
{
    public function show(int $mahasiswaId): JsonResponse
    {
        $periode = $this->assignedPeriod($mahasiswaId);
        $assessment = $periode->penilaianAkhir()
            ->with(['mahasiswa', 'pembimbing', 'periode'])
            ->first();

        return response()->json([
            'success' => true,
            'data' => $assessment ? new PenilaianAkhirResource($assessment) : null,
            'student' => $periode->mahasiswa?->only(['id', 'nama', 'nim', 'email', 'universitas']),
            'supervisor' => $periode->pembimbing?->only(['id', 'nama', 'email', 'nip']),
            'period' => $periode->only(['id', 'instansi', 'tanggal_mulai', 'tanggal_selesai', 'status']),
        ]);
    }

    public function update(Request $request, int $mahasiswaId): JsonResponse
    {
        $data = $request->validate([
            'scores' => ['required', 'array', 'size:6'],
            'scores.*' => ['required', 'numeric', 'min:0', 'max:100'],
        ]);

        $periode = $this->assignedPeriod($mahasiswaId);
        $scores = array_map('floatval', array_values($data['scores']));
        $assessment = PenilaianAkhir::query()->updateOrCreate(
            ['periode_id' => $periode->id],
            [
                'mahasiswa_id' => $periode->mahasiswa_id,
                'pembimbing_id' => Auth::id(),
                'scores' => $scores,
                'nilai_akhir' => PenilaianAkhir::calculateScore($scores),
            ],
        );

        return response()->json([
            'success' => true,
            'message' => 'Penilaian akhir berhasil disimpan.',
            'data' => new PenilaianAkhirResource($assessment->load(['mahasiswa', 'pembimbing', 'periode'])),
        ]);
    }

    private function assignedPeriod(int $mahasiswaId): MagangPeriode
    {
        $query = MagangPeriode::with(['mahasiswa', 'pembimbing'])
            ->where('mahasiswa_id', $mahasiswaId)
            ->where('pembimbing_id', Auth::id());

        return $query->where('status', 'aktif')->first()
            ?? $query->latest('tanggal_mulai')->firstOrFail();
    }
}
<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\PeriodeMagangResource;
use App\Models\MagangPeriode;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Throwable;

class PeriodeMagangController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = MagangPeriode::with(['mahasiswa','pembimbing']);

        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        $list = $query->get();

        return response()->json([
            'success' => true,
            'data' => PeriodeMagangResource::collection($list),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'mahasiswa_id' => 'required|exists:users,id',
            'pembimbing_id' => 'required|exists:users,id',
            'instansi' => 'required|string',
            'tanggal_mulai' => 'required|date',
            'tanggal_selesai' => 'required|date',
            'status' => 'nullable|in:aktif,selesai',
        ]);

        $periode = MagangPeriode::create($validated + ['status' => $validated['status'] ?? 'aktif']);

        return response()->json([
            'success' => true,
            'message' => 'Periode dibuat.',
            'data' => new PeriodeMagangResource($periode),
        ], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $periode = MagangPeriode::findOrFail($id);

        $validated = $request->validate([
            'instansi' => 'sometimes|string',
            'tanggal_mulai' => 'sometimes|date',
            'tanggal_selesai' => 'sometimes|date',
            'status' => 'sometimes|in:aktif,selesai',
        ]);

        $periode->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Periode diperbarui.',
            'data' => new PeriodeMagangResource($periode),
        ]);
    }
}

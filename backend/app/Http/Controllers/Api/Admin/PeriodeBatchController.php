<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\PeriodeBatchResource;
use App\Models\MagangPeriode;
use App\Models\PeriodeBatch;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Throwable;

class PeriodeBatchController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = PeriodeBatch::withCount('mahasiswaPeriode');

        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        if ($request->filled('q')) {
            $q = $request->input('q');
            $query->where(function ($sub) use ($q) {
                $sub->where('nama_batch', 'like', "%{$q}%")
                    ->orWhere('instansi', 'like', "%{$q}%");
            });
        }

        $paginated = $query->orderByDesc('tanggal_mulai')->paginate($request->input('per_page', 10));

        return response()->json([
            'success' => true,
            'data' => PeriodeBatchResource::collection($paginated),
            'meta' => [
                'current_page' => $paginated->currentPage(),
                'last_page' => $paginated->lastPage(),
                'per_page' => $paginated->perPage(),
                'total' => $paginated->total(),
            ],
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'nama_batch' => 'required|string|max:255',
            'instansi' => 'required|string|max:255',
            'tanggal_mulai' => 'required|date',
            'tanggal_selesai' => 'required|date|after_or_equal:tanggal_mulai',
            'status' => 'nullable|in:aktif,selesai',
        ]);

        $batch = PeriodeBatch::create($validated + ['status' => $validated['status'] ?? 'aktif']);

        return response()->json([
            'success' => true,
            'message' => 'Periode batch dibuat.',
            'data' => new PeriodeBatchResource($batch),
        ], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $batch = PeriodeBatch::findOrFail($id);

        $validated = $request->validate([
            'nama_batch' => 'sometimes|string|max:255',
            'instansi' => 'sometimes|string|max:255',
            'tanggal_mulai' => 'sometimes|date',
            'tanggal_selesai' => 'sometimes|date|after_or_equal:tanggal_mulai',
            'status' => 'sometimes|in:aktif,selesai',
        ]);

        $batch->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Periode batch diperbarui.',
            'data' => new PeriodeBatchResource($batch),
        ]);
    }

    public function show(int $id): JsonResponse
    {
        $batch = PeriodeBatch::with(['mahasiswaPeriode.mahasiswa', 'mahasiswaPeriode.pembimbing'])->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => new PeriodeBatchResource($batch),
            'mahasiswa' => \App\Http\Resources\Admin\PeriodeMagangResource::collection($batch->mahasiswaPeriode),
        ]);
    }

    public function addMahasiswa(Request $request, int $id): JsonResponse
    {
        $batch = PeriodeBatch::findOrFail($id);

        $validated = $request->validate([
            'mahasiswa_id' => 'required|exists:users,id',
            'pembimbing_id' => 'required|exists:users,id',
        ]);

        try {
            $periode = MagangPeriode::create([
                'periode_batch_id' => $batch->id,
                'mahasiswa_id' => $validated['mahasiswa_id'],
                'pembimbing_id' => $validated['pembimbing_id'],
                'instansi' => $batch->instansi,
                'tanggal_mulai' => $batch->tanggal_mulai,
                'tanggal_selesai' => $batch->tanggal_selesai,
                'status' => $batch->status,
            ]);
        } catch (Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal menambahkan mahasiswa ke batch. Kemungkinan mahasiswa sudah punya periode aktif.',
            ], 422);
        }

        return response()->json([
            'success' => true,
            'message' => 'Mahasiswa ditambahkan ke batch.',
            'data' => new \App\Http\Resources\Admin\PeriodeMagangResource($periode),
        ], 201);
    }

    public function removeMahasiswa(int $id, int $periodeId): JsonResponse
    {
        $periode = MagangPeriode::where('periode_batch_id', $id)->findOrFail($periodeId);
        $periode->delete();

        return response()->json([
            'success' => true,
            'message' => 'Mahasiswa dikeluarkan dari batch.',
        ]);
    }
}

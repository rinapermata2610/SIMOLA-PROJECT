<?php

namespace App\Http\Controllers\Api\Mahasiswa;

use App\Http\Controllers\Controller;
use App\Http\Requests\Mahasiswa\StoreLogAktivitasRequest;
use App\Http\Resources\Mahasiswa\LogAktivitasResource;
use App\Models\LogAktivitas;
use App\Models\MagangPeriode;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Throwable;

class FormAktivitasController extends Controller
{
    public function check(Request $request): JsonResponse
    {
        $user = Auth::user();
        $tanggal = $request->query('tanggal');

        $exists = LogAktivitas::where('mahasiswa_id', $user->id)
            ->whereDate('tanggal', $tanggal)
            ->exists();

        return response()->json([
            'success' => true,
            'exists' => $exists
        ], 200);
    }

    public function store(StoreLogAktivitasRequest $request): JsonResponse
    {
        DB::beginTransaction();

        try {
            $user = Auth::user();

            // 1. Cek / Cari Periode Magang Mahasiswa
            $periodeId = $request->periode_id;
            if (!$periodeId) {
                $periode = MagangPeriode::where('mahasiswa_id', $user->id)->first();
                
                // Jika akun dummy belum memiliki data periode, otomatis buatkan
                if (!$periode) {
                    $periode = MagangPeriode::create([
                        'mahasiswa_id'    => $user->id,
                        'tanggal_mulai'   => '2026-01-01',
                        'tanggal_selesai' => '2026-12-31',
                        'status'          => 'aktif',
                    ]);
                }

                $periodeId = $periode->id;
            }

            $validated = $request->validated();

            // 2. Simpan Log Aktivitas (Tanpa Jam Mulai & Jam Selesai)
            $logAktivitas = LogAktivitas::create([
                'mahasiswa_id' => $user->id,
                'periode_id'   => $periodeId,
                'tanggal'      => $validated['tanggal'],
                'judul'        => $validated['judul'],
                'deskripsi'    => $validated['deskripsi'],
                'hasil'        => $validated['hasil'],
                'status'       => $validated['status'] ?? 'submitted',
                'submitted_at' => ($validated['status'] ?? 'submitted') === 'submitted' ? now() : null,
            ]);

            // 3. Simpan File Lampiran Bukti jika ada
            if ($request->hasFile('lampiran')) {
                $files = $request->file('lampiran');
                if (!is_array($files)) {
                    $files = [$files];
                }

                foreach ($files as $file) {
                    $path = $file->store('lampiran_bukti', 'public');
                    $logAktivitas->lampiran()->create([
                        'nama_file' => $file->getClientOriginalName(),
                        'file_path' => $path,
                        'file_size' => $file->getSize(),
                        'file_type' => $file->getClientOriginalExtension(),
                    ]);
                }
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Log aktivitas berhasil disimpan ke database.',
                'data'    => new LogAktivitasResource($logAktivitas->load(['periode', 'lampiran']))
            ], 201);

        } catch (Throwable $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Gagal menyimpan log aktivitas.',
                'error'   => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }
}
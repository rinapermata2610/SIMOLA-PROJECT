<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AssignPembimbingRequest;
use App\Http\Resources\Admin\PenugasanResource;
use App\Models\MagangPeriode;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Throwable;

class PenugasanController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $mahasiswas = User::where('role','mahasiswa')
            ->with(['periodeMagang' => function ($q) { $q->where('status','aktif'); }])
            ->get();

        return response()->json([
            'success' => true,
            'data' => PenugasanResource::collection($mahasiswas),
        ]);
    }

    public function assign(AssignPembimbingRequest $request): JsonResponse
    {
        $mahasiswa = User::where('id', $request->input('mahasiswa_id'))->where('role','mahasiswa')->firstOrFail();
        $pembimbing = User::where('id', $request->input('pembimbing_id'))->where('role','pembimbing')->firstOrFail();

        // ensure no active period for mahasiswa
        $existing = MagangPeriode::where('mahasiswa_id', $mahasiswa->id)->where('status','aktif')->first();
        if ($existing) {
            return response()->json(['success'=>false,'message'=>'Mahasiswa sudah punya pembimbing aktif.'],422);
        }

        $periode = MagangPeriode::create([
            'mahasiswa_id' => $mahasiswa->id,
            'pembimbing_id' => $pembimbing->id,
            'instansi' => $request->input('instansi') ?? '',
            'tanggal_mulai' => $request->input('tanggal_mulai') ?? now()->toDateString(),
            'tanggal_selesai' => $request->input('tanggal_selesai') ?? now()->addMonth()->toDateString(),
            'status' => 'aktif',
        ]);

        return response()->json(['success'=>true,'message'=>'Berhasil menugaskan pembimbing.','data'=> $periode],201);
    }

    public function reassign(AssignPembimbingRequest $request): JsonResponse
    {
        $mahasiswaId = $request->input('mahasiswa_id');
        $newPembimbingId = $request->input('pembimbing_id');

        $active = MagangPeriode::where('mahasiswa_id',$mahasiswaId)->where('status','aktif')->first();
        if ($active) {
            $active->status = 'selesai';
            $active->save();
        }

        $periode = MagangPeriode::create([
            'mahasiswa_id' => $mahasiswaId,
            'pembimbing_id' => $newPembimbingId,
            'instansi' => $request->input('instansi') ?? ($active? $active->instansi : ''),
            'tanggal_mulai' => $request->input('tanggal_mulai') ?? now()->toDateString(),
            'tanggal_selesai' => $request->input('tanggal_selesai') ?? now()->addMonth()->toDateString(),
            'status' => 'aktif',
        ]);

        return response()->json(['success'=>true,'message'=>'Pembimbing berhasil diganti.','data'=>$periode]);
    }
}

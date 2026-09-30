<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\PenilaianAkhirResource;
use App\Models\PenilaianAkhir;
use Illuminate\Http\JsonResponse;

class PenilaianAkhirController extends Controller
{
    public function index(): JsonResponse
    {
        $assessments = PenilaianAkhir::with(['mahasiswa', 'pembimbing', 'periode'])
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'data' => PenilaianAkhirResource::collection($assessments),
        ]);
    }
}
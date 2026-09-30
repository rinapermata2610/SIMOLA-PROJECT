<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\PengaturanAbsensi;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PengaturanAbsensiController extends Controller
{
    public function show(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => [
                'wfh_days' => PengaturanAbsensi::wfhDays(),
            ],
        ]);
    }

    public function update(Request $request): JsonResponse
    {
        $data = $request->validate([
            'wfh_days' => ['required', 'array', 'min:1', 'max:5'],
            'wfh_days.*' => ['required', 'integer', 'between:1,5', 'distinct:strict'],
        ]);

        $days = array_map('intval', $data['wfh_days']);
        sort($days);

        $settings = PengaturanAbsensi::query()->find(1);
        if (!$settings) {
            $settings = new PengaturanAbsensi();
            $settings->id = 1;
        }

        $settings->wfh_days = $days;
        $settings->save();

        return response()->json([
            'success' => true,
            'message' => 'Jadwal WFH berhasil diperbarui.',
            'data' => [
                'wfh_days' => $days,
            ],
        ]);
    }
}
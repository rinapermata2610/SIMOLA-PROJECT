<?php

namespace App\Http\Controllers\Api\Mahasiswa;

use App\Http\Controllers\Controller;
use App\Models\Absensi;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class AbsensiController extends Controller
{
    private const OFFICE_LATITUDE = -6.9138252;
    private const OFFICE_LONGITUDE = 107.6171926;
    private const ALLOWED_RADIUS_METERS = 100;
    private const CLOCK_IN_START = '06:00';
    private const CLOCK_IN_END = '07:30';
    private const CLOCK_OUT_START = '16:00';
    private const CLOCK_OUT_END = '18:00';

    public function today(): JsonResponse
    {
        $attendance = Absensi::where('mahasiswa_id', Auth::id())
            ->whereDate('tanggal', Carbon::today())
            ->first();

        $history = Absensi::where('mahasiswa_id', Auth::id())
            ->whereBetween('tanggal', [Carbon::today()->subDays(6), Carbon::today()])
            ->orderByDesc('tanggal')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $this->formatAttendance($attendance),
            'history' => $history->map(fn (Absensi $item) => $this->formatAttendance($item))->values(),
            'location' => [
                'name' => 'Balai Bahasa Provinsi Jawa Barat',
                'latitude' => self::OFFICE_LATITUDE,
                'longitude' => self::OFFICE_LONGITUDE,
                'radius_meters' => self::ALLOWED_RADIUS_METERS,
            ],
            'schedule' => [
                'masuk' => [self::CLOCK_IN_START, self::CLOCK_IN_END],
                'keluar' => [self::CLOCK_OUT_START, self::CLOCK_OUT_END],
            ],
        ]);
    }

    public function store(Request $request, string $type): JsonResponse
    {
        if (!in_array($type, ['masuk', 'keluar'], true)) {
            return response()->json(['success' => false, 'message' => 'Jenis absensi tidak valid.'], 422);
        }

        $now = Carbon::now();
        $currentTime = $now->format('H:i');
        [$startTime, $endTime] = $type === 'masuk'
            ? [self::CLOCK_IN_START, self::CLOCK_IN_END]
            : [self::CLOCK_OUT_START, self::CLOCK_OUT_END];

        if ($currentTime < $startTime || $currentTime > $endTime) {
            return response()->json([
                'success' => false,
                'message' => "Absen {$type} hanya dapat dilakukan pukul {$startTime} sampai {$endTime} WIB.",
            ], 422);
        }

        $validated = Validator::make($request->all(), [
            'latitude' => ['required', 'numeric', 'between:-90,90'],
            'longitude' => ['required', 'numeric', 'between:-180,180'],
        ])->validate();

        $distance = $this->distanceInMeters(
            (float) $validated['latitude'],
            (float) $validated['longitude']
        );

        if ($distance > self::ALLOWED_RADIUS_METERS) {
            return response()->json([
                'success' => false,
                'message' => 'Absensi hanya dapat dilakukan di area Balai Bahasa Provinsi Jawa Barat.',
                'distance_meters' => round($distance),
            ], 422);
        }

        $attendance = Absensi::where('mahasiswa_id', Auth::id())
            ->whereDate('tanggal', Carbon::today())
            ->first();

        if ($type === 'keluar' && !$attendance?->jam_masuk) {
            return response()->json([
                'success' => false,
                'message' => 'Silakan absen masuk terlebih dahulu.',
            ], 422);
        }

        $attendance ??= Absensi::firstOrCreate([
            'mahasiswa_id' => Auth::id(),
            'tanggal' => $now->toDateString(),
        ]);

        $column = $type === 'masuk' ? 'jam_masuk' : 'jam_keluar';
        $latitudeColumn = $type === 'masuk' ? 'latitude_masuk' : 'latitude_keluar';
        $longitudeColumn = $type === 'masuk' ? 'longitude_masuk' : 'longitude_keluar';

        if ($attendance->{$column}) {
            return response()->json([
                'success' => false,
                'message' => "Absen {$type} hari ini sudah tercatat.",
                'data' => $this->formatAttendance($attendance),
            ], 409);
        }

        $attendance->update([
            $column => $now,
            $latitudeColumn => $validated['latitude'],
            $longitudeColumn => $validated['longitude'],
        ]);

        return response()->json([
            'success' => true,
            'message' => "Absen {$type} berhasil dicatat pada {$now->format('H:i')} WIB.",
            'data' => $this->formatAttendance($attendance->fresh()),
        ]);
    }

    private function formatAttendance(?Absensi $attendance): ?array
    {
        if (!$attendance) {
            return null;
        }

        return [
            'id' => $attendance->id,
            'tanggal' => $attendance->tanggal?->format('Y-m-d'),
            'jam_masuk' => $attendance->jam_masuk?->format('H:i'),
            'jam_keluar' => $attendance->jam_keluar?->format('H:i'),
        ];
    }

    private function distanceInMeters(float $latitude, float $longitude): float
    {
        $earthRadius = 6371000;
        $latitudeDelta = deg2rad($latitude - self::OFFICE_LATITUDE);
        $longitudeDelta = deg2rad($longitude - self::OFFICE_LONGITUDE);
        $a = sin($latitudeDelta / 2) ** 2
            + cos(deg2rad(self::OFFICE_LATITUDE))
            * cos(deg2rad($latitude))
            * sin($longitudeDelta / 2) ** 2;

        return $earthRadius * 2 * asin(min(1, sqrt($a)));
    }
}

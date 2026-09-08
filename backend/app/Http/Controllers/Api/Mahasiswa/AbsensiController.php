<?php

namespace App\Http\Controllers\Api\Mahasiswa;

use App\Http\Controllers\Controller;
use App\Models\Absensi;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

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
        $today = Carbon::today();
        $attendance = Absensi::where('mahasiswa_id', Auth::id())
            ->whereDate('tanggal', $today)
            ->first();
        $history = Absensi::where('mahasiswa_id', Auth::id())
            ->whereBetween('tanggal', [$today->copy()->subDays(6), $today])
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
                'required' => $today->dayOfWeekIso >= 1 && $today->dayOfWeekIso <= 4,
            ],
            'schedule' => [
                'masuk' => [self::CLOCK_IN_START, self::CLOCK_IN_END],
                'keluar' => [self::CLOCK_OUT_START, self::CLOCK_OUT_END],
            ],
            'workday' => [
                'day' => $today->dayName,
                'is_wfh' => $today->dayOfWeekIso === 5,
                'requires_office_location' => $today->dayOfWeekIso >= 1 && $today->dayOfWeekIso <= 4,
            ],
        ]);
    }

    public function store(Request $request, string $type): JsonResponse
    {
        if (!in_array($type, ['masuk', 'keluar'], true)) {
            return response()->json(['success' => false, 'message' => 'Jenis absensi tidak valid.'], 422);
        }

        $now = Carbon::now();
        if ($now->dayOfWeekIso >= 6) {
            return response()->json(['success' => false, 'message' => 'Absensi hanya tersedia pada hari Senin sampai Jumat.'], 422);
        }

        $currentMinutes = ((int) $now->format('H') * 60) + (int) $now->format('i');
        [$startTime, $endTime] = $type === 'masuk'
            ? [self::CLOCK_IN_START, self::CLOCK_IN_END]
            : [self::CLOCK_OUT_START, self::CLOCK_OUT_END];
        $startMinutes = $this->timeToMinutes($startTime);
        $endMinutes = $this->timeToMinutes($endTime);
        $isOnTime = $currentMinutes >= $startMinutes && $currentMinutes <= $endMinutes;
        $latenessMinutes = $isOnTime ? 0 : min(abs($currentMinutes - $startMinutes), abs($currentMinutes - $endMinutes));
        $requiresOfficeLocation = $now->dayOfWeekIso >= 1 && $now->dayOfWeekIso <= 4;

        $validated = Validator::make($request->all(), [
            'latitude' => [$requiresOfficeLocation ? 'required' : 'nullable', 'numeric', 'between:-90,90'],
            'longitude' => [$requiresOfficeLocation ? 'required' : 'nullable', 'numeric', 'between:-180,180'],
        ])->validate();

        if ($requiresOfficeLocation) {
            $distance = $this->distanceInMeters((float) $validated['latitude'], (float) $validated['longitude']);
            if ($distance > self::ALLOWED_RADIUS_METERS) {
                return response()->json([
                    'success' => false,
                    'message' => 'Absensi Senin sampai Kamis hanya dapat dilakukan di area Balai Bahasa Provinsi Jawa Barat.',
                    'distance_meters' => round($distance),
                ], 422);
            }
        }

        $attendance = Absensi::where('mahasiswa_id', Auth::id())
            ->whereDate('tanggal', $now)
            ->first();
        if ($type === 'keluar' && !$attendance?->jam_masuk) {
            return response()->json(['success' => false, 'message' => 'Silakan absen masuk terlebih dahulu.'], 422);
        }
        $attendance ??= Absensi::firstOrCreate([
            'mahasiswa_id' => Auth::id(),
            'tanggal' => $now->toDateString(),
        ]);

        $column = $type === 'masuk' ? 'jam_masuk' : 'jam_keluar';
        $latitudeColumn = $type === 'masuk' ? 'latitude_masuk' : 'latitude_keluar';
        $longitudeColumn = $type === 'masuk' ? 'longitude_masuk' : 'longitude_keluar';
        $statusColumn = $type === 'masuk' ? 'status_masuk' : 'status_keluar';
        $latenessColumn = $type === 'masuk' ? 'keterlambatan_masuk_menit' : 'keterlambatan_keluar_menit';

        if ($attendance->{$column}) {
            return response()->json([
                'success' => false,
                'message' => "Absen {$type} hari ini sudah tercatat.",
                'data' => $this->formatAttendance($attendance),
            ], 409);
        }

        $attendance->update([
            $column => $now,
            $statusColumn => $isOnTime ? 'tepat_waktu' : 'terlambat',
            $latenessColumn => $latenessMinutes,
            $latitudeColumn => $validated['latitude'],
            $longitudeColumn => $validated['longitude'],
        ]);

        return response()->json([
            'success' => true,
            'message' => $isOnTime
                ? "Absen {$type} berhasil dicatat pada {$now->format('H:i')} WIB."
                : "Absen {$type} tercatat terlambat {$this->formatDuration($latenessMinutes)}.",
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
            'status_masuk' => $attendance->status_masuk,
            'keterlambatan_masuk_menit' => $attendance->keterlambatan_masuk_menit,
            'jam_keluar' => $attendance->jam_keluar?->format('H:i'),
            'status_keluar' => $attendance->status_keluar,
            'keterlambatan_keluar_menit' => $attendance->keterlambatan_keluar_menit,
        ];
    }

    private function timeToMinutes(string $time): int
    {
        [$hours, $minutes] = array_map('intval', explode(':', $time));
        return ($hours * 60) + $minutes;
    }

    private function formatDuration(int $minutes): string
    {
        $hours = intdiv($minutes, 60);
        $remainingMinutes = $minutes % 60;
        return trim(($hours ? "{$hours} jam " : '') . ($remainingMinutes ? "{$remainingMinutes} menit" : ''));
    }

    private function distanceInMeters(float $latitude, float $longitude): float
    {
        $earthRadius = 6371000;
        $latitudeDelta = deg2rad($latitude - self::OFFICE_LATITUDE);
        $longitudeDelta = deg2rad($longitude - self::OFFICE_LONGITUDE);
        $a = sin($latitudeDelta / 2) ** 2
            + cos(deg2rad(self::OFFICE_LATITUDE)) * cos(deg2rad($latitude)) * sin($longitudeDelta / 2) ** 2;
        return $earthRadius * 2 * asin(min(1, sqrt($a)));
    }
}

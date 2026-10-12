<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PenilaianAkhir extends Model
{
    public const WEIGHTS = [20, 15, 15, 15, 15, 20];

    protected $table = 'penilaian_akhir';

    protected $fillable = [
        'periode_id',
        'mahasiswa_id',
        'pembimbing_id',
        'scores',
        'nilai_akhir',
    ];

    protected $casts = [
        'scores' => 'array',
        'nilai_akhir' => 'decimal:2',
    ];

    public static function calculateScore(array $scores): float
    {
        $total = 0.0;
        foreach (self::WEIGHTS as $index => $weight) {
            $total += ($weight / 100) * (float) $scores[$index];
        }

        return round($total, 2);
    }

    public function getNilaiHurufAttribute(): string
    {
        return match (true) {
            (float) $this->nilai_akhir >= 80 => 'A',
            (float) $this->nilai_akhir >= 70 => 'B',
            (float) $this->nilai_akhir >= 60 => 'C',
            (float) $this->nilai_akhir >= 40 => 'D',
            default => 'E',
        };
    }

    public function mahasiswa()
    {
        return $this->belongsTo(User::class, 'mahasiswa_id');
    }

    public function pembimbing()
    {
        return $this->belongsTo(User::class, 'pembimbing_id');
    }

    public function periode()
    {
        return $this->belongsTo(MagangPeriode::class, 'periode_id');
    }
}
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PengaturanAbsensi extends Model
{
    protected $table = 'pengaturan_absensi';

    protected $fillable = ['wfh_days'];

    protected $casts = [
        'wfh_days' => 'array',
    ];

    public static function wfhDays(): array
    {
        $settings = static::query()->find(1);

        return array_map('intval', $settings?->wfh_days ?? [5]);
    }
}
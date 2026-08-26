<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Absensi extends Model
{
    protected $table = 'absensi';

    protected $fillable = [
        'mahasiswa_id',
        'tanggal',
        'jam_masuk',
        'status_masuk',
        'keterlambatan_masuk_menit',
        'jam_keluar',
        'status_keluar',
        'keterlambatan_keluar_menit',
        'latitude_masuk',
        'longitude_masuk',
        'latitude_keluar',
        'longitude_keluar',
    ];

    protected $casts = [
        'tanggal' => 'date:Y-m-d',
        'jam_masuk' => 'datetime:H:i',
        'jam_keluar' => 'datetime:H:i',
        'keterlambatan_masuk_menit' => 'integer',
        'keterlambatan_keluar_menit' => 'integer',
    ];

    public function mahasiswa()
    {
        return $this->belongsTo(User::class, 'mahasiswa_id');
    }
}

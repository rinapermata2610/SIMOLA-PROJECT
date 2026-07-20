<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PenilaianBulanan extends Model
{
    protected $table = 'penilaian_bulanan';

    protected $fillable = [
        'log_aktivitas_id',
        'pembimbing_id',
        'status',
        'komentar',
        'verified_at'
    ];

    protected $casts = [
        'verified_at' => 'datetime',
    ];

    public function logAktivitas()
    {
        return $this->belongsTo(LogAktivitas::class, 'log_aktivitas_id');
    }

    public function pembimbing()
    {
        return $this->belongsTo(User::class, 'pembimbing_id');
    }
}
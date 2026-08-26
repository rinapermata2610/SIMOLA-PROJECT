<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MagangPeriode extends Model
{
    use HasFactory;

    protected $table = 'magang_periode';

    protected $fillable = [
        'periode_batch_id',
        'mahasiswa_id',
        'tanggal_mulai',
        'tanggal_selesai',
        'status',
    ];

    public function mahasiswa()
    {
        return $this->belongsTo(User::class, 'mahasiswa_id');
    }

    public function pembimbing()
    {
        return $this->belongsTo(User::class, 'pembimbing_id');
    }

    public function batch()
    {
        return $this->belongsTo(PeriodeBatch::class, 'periode_batch_id');
    }

    public function logAktivitas()
    {
        return $this->hasMany(LogAktivitas::class, 'periode_id');
    }
}

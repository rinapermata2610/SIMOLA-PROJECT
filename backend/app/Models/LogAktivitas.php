<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class LogAktivitas extends Model
{
    use SoftDeletes;

    protected $table = 'log_aktivitas';

    protected $fillable = [
        'mahasiswa_id',
        'periode_id',
        'tanggal',
        'judul',
        'deskripsi',
        'hasil',
        'jam_mulai',
        'jam_selesai',
        'status',
        'submitted_at'
    ];

    protected $casts = [
        'tanggal' => 'date',
        'submitted_at' => 'datetime',
    ];

    /*
    |--------------------------------------------------------------------------
    | RELATIONSHIP
    |--------------------------------------------------------------------------
    */

    public function mahasiswa()
    {
        return $this->belongsTo(User::class, 'mahasiswa_id');
    }

    public function periode()
    {
        return $this->belongsTo(MagangPeriode::class, 'periode_id');
    }

    public function lampiran()
    {
        return $this->hasMany(LampiranBukti::class, 'log_aktivitas_id');
    }

    public function penilaian()
    {
        return $this->hasOne(PenilaianBulanan::class, 'log_aktivitas_id');
    }
}
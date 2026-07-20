<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MagangPeriode extends Model
{
    protected $table = 'magang_periode';

    protected $fillable = [
        'mahasiswa_id',
        'pembimbing_id',
        'instansi',
        'tanggal_mulai',
        'tanggal_selesai',
        'status'
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

    public function pembimbing()
    {
        return $this->belongsTo(User::class, 'pembimbing_id');
    }

    public function logAktivitas()
    {
        return $this->hasMany(LogAktivitas::class, 'periode_id');
    }
}
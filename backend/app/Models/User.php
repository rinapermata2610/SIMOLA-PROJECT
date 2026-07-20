<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $fillable = [
        'nama',
        'username',
        'email',
        'password',
        'nim',
        'role',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'password' => 'hashed',
        ];
    }

    /*
    |--------------------------------------------------------------------------
    | RELATIONSHIP
    |--------------------------------------------------------------------------
    */

    // Mahasiswa memiliki banyak periode magang
    public function periodeMagang()
    {
        return $this->hasMany(MagangPeriode::class, 'mahasiswa_id');
    }

    // Pembimbing membimbing banyak mahasiswa
    public function mahasiswaBimbingan()
    {
        return $this->hasMany(MagangPeriode::class, 'pembimbing_id');
    }

    // Mahasiswa memiliki banyak log aktivitas
    public function logAktivitas()
    {
        return $this->hasMany(LogAktivitas::class, 'mahasiswa_id');
    }

    // Pembimbing melakukan banyak verifikasi
    public function penilaian()
    {
        return $this->hasMany(PenilaianBulanan::class, 'pembimbing_id');
    }
}
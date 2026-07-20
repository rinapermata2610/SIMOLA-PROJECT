<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LampiranBukti extends Model
{
    protected $table = 'lampiran_bukti';

    protected $fillable = [
        'log_aktivitas_id',
        'nama_file',
        'file_path',
        'file_type',
        'file_size'
    ];

    public function logAktivitas()
    {
        return $this->belongsTo(LogAktivitas::class, 'log_aktivitas_id');
    }
}
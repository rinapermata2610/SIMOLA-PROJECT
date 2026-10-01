<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PeriodeBatch extends Model
{
    use HasFactory;

    protected $table = 'periode_batches';

    protected $fillable = [
        'nama_batch',
        'instansi',
        'tanggal_mulai',
        'tanggal_selesai',
        'status',
    ];

    public function mahasiswaPeriode()
    {
        return $this->hasMany(MagangPeriode::class, 'periode_batch_id');
    }
}

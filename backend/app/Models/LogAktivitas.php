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
        'submitted_at',
    ];

    protected $casts = [
        'tanggal'      => 'date:Y-m-d',
        'jam_mulai'    => 'datetime:H:i',
        'jam_selesai'  => 'datetime:H:i',
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

    /*
    |--------------------------------------------------------------------------
    | QUERY SCOPE
    |--------------------------------------------------------------------------
    */

    /**
     * Filter berdasarkan mahasiswa.
     */
    public function scopeMahasiswa($query, $mahasiswaId)
    {
        return $query->where('mahasiswa_id', $mahasiswaId);
    }

    /**
     * Filter berdasarkan periode magang.
     */
    public function scopePeriode($query, $periodeId)
    {
        return $query->where('periode_id', $periodeId);
    }

    /**
     * Filter berdasarkan tanggal.
     */
    public function scopeTanggal($query, $tanggal)
    {
        return $query->whereDate('tanggal', $tanggal);
    }

    /**
     * Filter berdasarkan bulan dan tahun.
     */
    public function scopeBulan($query, $bulan, $tahun)
    {
        return $query
            ->whereMonth('tanggal', $bulan)
            ->whereYear('tanggal', $tahun);
    }

    /**
     * Urutkan berdasarkan tanggal terbaru.
     */
    public function scopeLatestTanggal($query)
    {
        return $query->orderByDesc('tanggal');
    }

    /**
     * Hanya aktivitas draft.
     */
    public function scopeDraft($query)
    {
        return $query->where('status', 'draft');
    }

    /**
     * Hanya aktivitas yang sudah dikirim.
     */
    public function scopeSubmitted($query)
    {
        return $query->where('status', 'submitted');
    }

    /**
     * Hanya aktivitas yang disetujui.
     */
    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }

    /**
     * Hanya aktivitas revisi.
     */
    public function scopeRevision($query)
    {
        return $query->where('status', 'revision');
    }

    /*
    |--------------------------------------------------------------------------
    | ACCESSOR
    |--------------------------------------------------------------------------
    */

    /**
     * Apakah masih draft.
     */
    public function getIsDraftAttribute()
    {
        return $this->status === 'draft';
    }

    /**
     * Apakah sudah dikirim.
     */
    public function getIsSubmittedAttribute()
    {
        return $this->status === 'submitted';
    }

    /**
     * Apakah disetujui.
     */
    public function getIsApprovedAttribute()
    {
        return $this->status === 'approved';
    }

    /**
     * Apakah revisi.
     */
    public function getIsRevisionAttribute()
    {
        return $this->status === 'revision';
    }

    /**
     * Durasi aktivitas dalam menit.
     */
    public function getDurasiAttribute()
    {
        if (!$this->jam_mulai || !$this->jam_selesai) {
            return null;
        }

        return strtotime($this->jam_selesai) - strtotime($this->jam_mulai);
    }

    /**
     * Format tanggal Indonesia.
     */
    public function getTanggalFormatAttribute()
    {
        return $this->tanggal?->translatedFormat('d F Y');
    }
}
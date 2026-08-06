<?php

namespace App\Http\Resources\Pembimbing;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MahasiswaBimbinganResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        $logCount = $this->logAktivitas()->count();
        $waitingCount = $this->logAktivitas()->where('status', 'submitted')->count();
        $approvedCount = $this->logAktivitas()->where('status', 'approved')->count();
        $revisionCount = $this->logAktivitas()->where('status', 'revision')->count();

        $completion = $logCount > 0
            ? round((($approvedCount + $revisionCount + $waitingCount) / $logCount) * 100)
            : 0;

        return [
            'id' => $this->id,
            'nama' => $this->nama,
            'username' => $this->username,
            'email' => $this->email,
            'nim' => $this->nim,
            'role' => $this->role,
            'periode' => $this->periodeMagang()->where('status', 'aktif')->first()?->only([
                'id',
                'instansi',
                'tanggal_mulai',
                'tanggal_selesai',
                'status',
            ]),
            'log_summary' => [
                'total_entri' => $logCount,
                'menunggu_verifikasi' => $waitingCount,
                'disetujui' => $approvedCount,
                'revisi' => $revisionCount,
                'persentase_kelengkapan' => $completion,
            ],
        ];
    }
}

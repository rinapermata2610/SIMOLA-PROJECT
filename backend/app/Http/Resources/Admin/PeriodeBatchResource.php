<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PeriodeBatchResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nama_batch' => $this->nama_batch,
            'instansi' => $this->instansi,
            'tanggal_mulai' => $this->tanggal_mulai,
            'tanggal_selesai' => $this->tanggal_selesai,
            'status' => $this->status,
            'jumlah_mahasiswa' => $this->whenCounted('mahasiswaPeriode'),
            'created_at' => $this->created_at,
        ];
    }
}

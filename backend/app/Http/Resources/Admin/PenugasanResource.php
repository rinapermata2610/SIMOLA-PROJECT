<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PenugasanResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nama' => $this->nama,
            'email' => $this->email,
            'nim' => $this->nim,
            'has_active_pembimbing' => $this->periodeMagang->isNotEmpty(),
            'periode_aktif' => $this->periodeMagang->first()?->only(['id','pembimbing_id','instansi','tanggal_mulai','tanggal_selesai','status']),
        ];
    }
}

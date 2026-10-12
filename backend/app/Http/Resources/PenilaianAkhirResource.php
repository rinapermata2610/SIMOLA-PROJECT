<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PenilaianAkhirResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'scores' => $this->scores,
            'nilai_akhir' => (float) $this->nilai_akhir,
            'nilai_huruf' => $this->nilai_huruf,
            'updated_at' => $this->updated_at?->toDateTimeString(),
            'mahasiswa' => $this->mahasiswa?->only(['id', 'nama', 'nim', 'email', 'universitas']),
            'pembimbing' => $this->pembimbing?->only(['id', 'nama', 'email', 'nip']),
            'periode' => $this->periode?->only([
                'id',
                'instansi',
                'tanggal_mulai',
                'tanggal_selesai',
                'status',
            ]),
        ];
    }
}
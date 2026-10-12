<?php

namespace App\Http\Resources\Mahasiswa;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProfilResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        $periode = $this->relationLoaded('periodeMagang')
            ? ($this->periodeMagang->firstWhere('status', 'aktif')
                ?? $this->periodeMagang->first())
            : null;

        return [

            'id' => $this->id,

            'nama' => $this->nama,

            'username' => $this->username,

            'email' => $this->email,

            'nim' => $this->nim,

            'universitas' => $this->universitas,

            'role' => $this->role,

            'periode_magang' => $this->when($periode, function () use ($periode) {

                return [

                    'id' => $periode->id,

                    'tanggal_mulai' => $periode->tanggal_mulai,

                    'tanggal_selesai' => $periode->tanggal_selesai,

                    'instansi' => $periode->instansi,

                ];

            }),

            'pembimbing' => $this->when($periode?->relationLoaded('pembimbing') && $periode->pembimbing, function () use ($periode) {

                return [

                    'id' => $periode->pembimbing->id,

                    'nama' => $periode->pembimbing->nama,

                    'email' => $periode->pembimbing->email,

                    'username' => $periode->pembimbing->username,

                ];

            }),

            'penilaian_akhir' => $this->when($periode?->penilaianAkhir, function () use ($periode) {
                return [
                    'scores' => $periode->penilaianAkhir->scores,
                    'nilai_akhir' => (float) $periode->penilaianAkhir->nilai_akhir,
                    'nilai_huruf' => $periode->penilaianAkhir->nilai_huruf,
                    'updated_at' => $periode->penilaianAkhir->updated_at?->toDateTimeString(),
                ];
            }),

            'created_at' => optional($this->created_at)
                ->format('Y-m-d H:i:s'),

            'updated_at' => optional($this->updated_at)
                ->format('Y-m-d H:i:s'),

        ];
    }
}

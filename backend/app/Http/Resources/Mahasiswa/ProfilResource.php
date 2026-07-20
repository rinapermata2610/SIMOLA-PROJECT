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
        return [

            'id' => $this->id,

            'nama' => $this->nama,

            'username' => $this->username,

            'email' => $this->email,

            'nim' => $this->nim,

            'role' => $this->role,

            'periode_magang' => $this->whenLoaded('magangPeriode', function () {

                return [

                    'id' => $this->magangPeriode->id,

                    'tanggal_mulai' => $this->magangPeriode->tanggal_mulai,

                    'tanggal_selesai' => $this->magangPeriode->tanggal_selesai,

                    'instansi' => $this->magangPeriode->instansi,

                ];

            }),

            'pembimbing' => $this->whenLoaded('magangPeriode', function () {

                if (!$this->magangPeriode || !$this->magangPeriode->pembimbing) {
                    return null;
                }

                return [

                    'id' => $this->magangPeriode->pembimbing->id,

                    'nama' => $this->magangPeriode->pembimbing->nama,

                    'email' => $this->magangPeriode->pembimbing->email,

                    'username' => $this->magangPeriode->pembimbing->username,

                ];

            }),

            'created_at' => optional($this->created_at)
                ->format('Y-m-d H:i:s'),

            'updated_at' => optional($this->updated_at)
                ->format('Y-m-d H:i:s'),

        ];
    }
}
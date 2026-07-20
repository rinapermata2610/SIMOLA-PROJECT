<?php

namespace App\Http\Resources\Mahasiswa;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DashboardResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [

            'mahasiswa' => [

                'id' => $this['user']->id,
                'nama' => $this['user']->nama,
                'username' => $this['user']->username,
                'email' => $this['user']->email,
                'nim' => $this['user']->nim,
                'role' => $this['user']->role,

            ],

            'periode_magang' => $this['periode'] ? [

                'id' => $this['periode']->id,
                'tanggal_mulai' => $this['periode']->tanggal_mulai,
                'tanggal_selesai' => $this['periode']->tanggal_selesai,
                'instansi' => $this['periode']->instansi,

            ] : null,

            'pembimbing' => $this['periode'] && $this['periode']->pembimbing ? [

                'id' => $this['periode']->pembimbing->id,
                'nama' => $this['periode']->pembimbing->nama,
                'email' => $this['periode']->pembimbing->email,

            ] : null,

            'statistik' => [

                'total_aktivitas' => $this['statistik']['total_aktivitas'],
                'draft' => $this['statistik']['draft'],
                'submitted' => $this['statistik']['submitted'],
                'approved' => $this['statistik']['approved'],
                'revision' => $this['statistik']['revision'],

            ],

            'progress' => [

                'hari_terisi' => $this['progress']['hari_terisi'],
                'total_hari' => $this['progress']['total_hari'],
                'persentase' => $this['progress']['persentase'],

            ],

            'aktivitas_terbaru' => LogAktivitasResource::collection(
                $this['aktivitas_terbaru']
            ),

        ];
    }
}
<?php

namespace App\Http\Resources\Mahasiswa;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LogAktivitasResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [

            'id' => $this->id,

            'mahasiswa_id' => $this->mahasiswa_id,

            'periode_id' => $this->periode_id,

            'tanggal' => $this->tanggal,

            'judul' => $this->judul,

            'deskripsi' => $this->deskripsi,

            'hasil' => $this->hasil,

            'jam_mulai' => $this->jam_mulai,

            'jam_selesai' => $this->jam_selesai,

            'durasi' => $this->jam_mulai && $this->jam_selesai
                ? $this->jam_mulai . ' - ' . $this->jam_selesai
                : null,

            'status' => $this->status,

            'submitted_at' => $this->submitted_at,

            'created_at' => optional($this->created_at)
                ->format('Y-m-d H:i:s'),

            'updated_at' => optional($this->updated_at)
                ->format('Y-m-d H:i:s'),

            'periode' => $this->whenLoaded('periode', function () {

                return [

                    'id' => $this->periode->id,

                    'tanggal_mulai' => $this->periode->tanggal_mulai,

                    'tanggal_selesai' => $this->periode->tanggal_selesai,

                    'instansi' => $this->periode->instansi,

                ];

            }),

            'lampiran' => LampiranBuktiResource::collection(
                $this->whenLoaded('lampiran')
            ),

            'penilaian' => $this->whenLoaded('penilaian', function () {

                if (!$this->penilaian) {
                    return null;
                }

                return [

                    'id' => $this->penilaian->id,

                    'status' => $this->penilaian->status,

                    'catatan' => $this->penilaian->catatan,

                    'tanggal_penilaian' => $this->penilaian->tanggal_penilaian,

                ];

            }),

        ];
    }
}
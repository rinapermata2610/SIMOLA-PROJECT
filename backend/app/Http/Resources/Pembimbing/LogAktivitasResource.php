<?php

namespace App\Http\Resources\Pembimbing;

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
            'mahasiswa' => [
                'id' => $this->mahasiswa->id,
                'nama' => $this->mahasiswa->nama,
                'username' => $this->mahasiswa->username,
                'email' => $this->mahasiswa->email,
                'nim' => $this->mahasiswa->nim,
            ],
            'periode' => $this->periode?->only([
                'id',
                'instansi',
                'tanggal_mulai',
                'tanggal_selesai',
                'status',
            ]),
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
            'lampiran' => $this->whenLoaded('lampiran', function () {
                return $this->lampiran->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'nama_file' => $item->nama_file,
                        'file_path' => $item->file_path,
                        'file_url' => $item->file_path ? \Illuminate\Support\Facades\Storage::disk('public')->url($item->file_path) : null,
                        'tipe_file' => $item->tipe_file,
                        'ukuran_file' => $item->ukuran_file,
                    ];
                })->values();
            }) ?? [],
            'penilaian' => $this->whenLoaded('penilaian', function () {
                if (!$this->penilaian) {
                    return null;
                }

                return [
                    'id' => $this->penilaian->id,
                    'status' => $this->penilaian->status,
                    'komentar' => $this->penilaian->komentar,
                    'verified_at' => $this->penilaian->verified_at,
                ];
            }),
            'created_at' => optional($this->created_at)->format('Y-m-d H:i:s'),
            'updated_at' => optional($this->updated_at)->format('Y-m-d H:i:s'),
        ];
    }
}

<?php

namespace App\Http\Resources\Mahasiswa;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LogAktivitasResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'           => $this->id,
            'tanggal'      => $this->tanggal ? $this->tanggal->format('Y-m-d') : null,
            'judul'        => $this->judul,
            'deskripsi'    => $this->deskripsi,
            'hasil'        => $this->hasil,
            'status'       => $this->status,
            'submitted_at' => $this->submitted_at ? $this->submitted_at->format('Y-m-d H:i:s') : null,
            'periode'      => $this->whenLoaded('periode', function () {
                return [
                    'id'   => $this->periode->id,
                    'nama' => $this->periode->nama ?? null,
                ];
            }),
            'lampiran'     => $this->whenLoaded('lampiran', function () {
                return $this->lampiran->map(function ($file) {
                    return [
                        'id'        => $file->id,
                        'nama_file' => $file->nama_file,
                        'url'       => $file->file_path ? asset('storage/' . $file->file_path) : null,
                        'file_type' => $file->file_type,
                        'file_size' => $file->file_size,
                    ];
                });
            }),
        ];
    }
}
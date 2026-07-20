<?php

namespace App\Http\Resources\Mahasiswa;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class LampiranBuktiResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [

            'id' => $this->id,

            'log_aktivitas_id' => $this->log_aktivitas_id,

            'nama_file' => $this->nama_file,

            'file_path' => $this->file_path,

            'file_url' => $this->file_path
                ? Storage::disk('public')->url($this->file_path)
                : null,

            'tipe_file' => $this->tipe_file,

            'ukuran_file' => $this->ukuran_file,

            'ukuran_file_kb' => round($this->ukuran_file / 1024, 2),

            'ukuran_file_mb' => round($this->ukuran_file / 1024 / 1024, 2),

            'created_at' => optional($this->created_at)
                ->format('Y-m-d H:i:s'),

            'updated_at' => optional($this->updated_at)
                ->format('Y-m-d H:i:s'),

        ];
    }
}
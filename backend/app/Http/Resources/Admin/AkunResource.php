<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AkunResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nama' => $this->nama,
            'username' => $this->username,
            'email' => $this->email,
            'nim' => $this->nim,
            'role' => $this->role,
            'is_active' => (bool) $this->is_active,
            'created_at' => optional($this->created_at)->toDateTimeString(),
            'has_active_period' => $this->whenLoaded(
                'periodeMagang',
                fn () => $this->periodeMagang->isNotEmpty(),
            ),
            'periode_aktif' => $this->whenLoaded('periodeMagang', function () {
                $period = $this->periodeMagang->first();

                if (! $period) {
                    return null;
                }

                return [
                    'id' => $period->id,
                    'pembimbing_id' => $period->pembimbing_id,
                    'periode_batch_id' => $period->periode_batch_id,
                    'pembimbing' => $period->pembimbing?->only(['id', 'nama']),
                ];
            }),
        ];
    }
}

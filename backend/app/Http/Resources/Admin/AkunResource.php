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
        ];
    }
}

<?php

namespace App\Http\Requests\Mahasiswa;

use Illuminate\Foundation\Http\FormRequest;

class UpdateLogAktivitasRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'tanggal'    => 'required|date',
            'judul'      => 'required|string|max:255',
            'deskripsi'  => 'required|string',
            'hasil'      => 'required|string',
            'status'     => 'required|in:draft,submitted',
            'lampiran'   => 'nullable|array',
            'lampiran.*' => 'file|mimes:png,jpg,jpeg,pdf,docx,doc|max:5120',
            'periode_id' => 'nullable|exists:magang_periode,id',
        ];
    }
}
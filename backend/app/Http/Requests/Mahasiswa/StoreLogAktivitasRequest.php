<?php

namespace App\Http\Requests\Mahasiswa;

use Illuminate\Foundation\Http\FormRequest;

class StoreLogAktivitasRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'periode_id' => 'nullable|exists:magang_periode,id',
            'tanggal'    => 'required|date',
            'judul'      => 'required|string|max:255',
            'deskripsi'  => 'required|string',
            'hasil'      => 'required|string',
            'status'     => 'nullable|in:draft,submitted',
            'lampiran.*' => 'nullable|file|mimes:jpg,jpeg,png,pdf,doc,docx|max:5120',
        ];
    }
}
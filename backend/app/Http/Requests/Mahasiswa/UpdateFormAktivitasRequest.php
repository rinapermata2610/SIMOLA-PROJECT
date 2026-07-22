<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateFormAktivitasRequest extends FormRequest
{
    /**
     * Determine if the user is authorized.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Validation Rules
     */
    public function rules(): array
    {
        return [
            'judul' => [
                'required',
                'string',
                'max:255',
            ],

            'deskripsi' => [
                'required',
                'string',
            ],

            'hasil' => [
                'required',
                'string',
            ],

            'jam_mulai' => [
                'nullable',
                'date_format:H:i',
            ],

            'jam_selesai' => [
                'nullable',
                'date_format:H:i',
                'after:jam_mulai',
            ],
        ];
    }

    /**
     * Custom Messages
     */
    public function messages(): array
    {
        return [

            'judul.required' => 'Judul aktivitas wajib diisi.',
            'judul.max' => 'Judul maksimal 255 karakter.',

            'deskripsi.required' => 'Deskripsi aktivitas wajib diisi.',

            'hasil.required' => 'Hasil aktivitas wajib diisi.',

            'jam_mulai.date_format' => 'Format jam mulai tidak valid.',

            'jam_selesai.date_format' => 'Format jam selesai tidak valid.',
            'jam_selesai.after' => 'Jam selesai harus setelah jam mulai.',

        ];
    }
}
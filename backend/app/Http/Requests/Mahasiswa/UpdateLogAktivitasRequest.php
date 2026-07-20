<?php

namespace App\Http\Requests\Mahasiswa;

use Illuminate\Foundation\Http\FormRequest;

class UpdateLogAktivitasRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Validation rules.
     */
    public function rules(): array
    {
        return [

            'periode_id' => [
                'required',
                'integer',
                'exists:magang_periode,id',
            ],

            'tanggal' => [
                'required',
                'date',
                'before_or_equal:today',
            ],

            'judul' => [
                'required',
                'string',
                'max:255',
            ],

            'deskripsi' => [
                'required',
                'string',
                'min:10',
            ],

            'hasil' => [
                'required',
                'string',
                'min:5',
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

            // Mahasiswa hanya boleh mengubah menjadi Draft atau Submitted
            'status' => [
                'required',
                'in:draft,submitted',
            ],

        ];
    }

    /**
     * Custom validation messages.
     */
    public function messages(): array
    {
        return [

            'periode_id.required' => 'Periode magang wajib dipilih.',
            'periode_id.integer'  => 'Periode magang tidak valid.',
            'periode_id.exists'   => 'Periode magang tidak ditemukan.',

            'tanggal.required'         => 'Tanggal aktivitas wajib diisi.',
            'tanggal.date'             => 'Format tanggal tidak valid.',
            'tanggal.before_or_equal'  => 'Tanggal aktivitas tidak boleh melebihi hari ini.',

            'judul.required' => 'Judul aktivitas wajib diisi.',
            'judul.max'      => 'Judul aktivitas maksimal 255 karakter.',

            'deskripsi.required' => 'Deskripsi aktivitas wajib diisi.',
            'deskripsi.min'      => 'Deskripsi aktivitas minimal 10 karakter.',

            'hasil.required' => 'Hasil aktivitas wajib diisi.',
            'hasil.min'      => 'Hasil aktivitas minimal 5 karakter.',

            'jam_mulai.date_format' => 'Format jam mulai harus HH:MM.',

            'jam_selesai.date_format' => 'Format jam selesai harus HH:MM.',
            'jam_selesai.after'       => 'Jam selesai harus lebih besar dari jam mulai.',

            'status.required' => 'Status aktivitas wajib dipilih.',
            'status.in'       => 'Status hanya boleh Draft atau Submitted.',

        ];
    }

    /**
     * Custom attribute names.
     */
    public function attributes(): array
    {
        return [

            'periode_id' => 'periode magang',

            'tanggal' => 'tanggal',

            'judul' => 'judul aktivitas',

            'deskripsi' => 'deskripsi aktivitas',

            'hasil' => 'hasil aktivitas',

            'jam_mulai' => 'jam mulai',

            'jam_selesai' => 'jam selesai',

            'status' => 'status aktivitas',

        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        $this->merge([

            'judul' => trim((string) $this->judul),

            'deskripsi' => trim((string) $this->deskripsi),

            'hasil' => trim((string) $this->hasil),

        ]);
    }
}
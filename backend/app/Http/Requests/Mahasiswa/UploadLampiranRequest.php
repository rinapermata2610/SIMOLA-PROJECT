<?php

namespace App\Http\Requests\Mahasiswa;

use Illuminate\Foundation\Http\FormRequest;

class UploadLampiranRequest extends FormRequest
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

            'log_aktivitas_id' => [
                'required',
                'integer',
                'exists:log_aktivitas,id',
            ],

            'file' => [
                'required',
                'file',
                'mimes:jpg,jpeg,png,pdf,doc,docx,xls,xlsx',
                'max:5120', // 5 MB
            ],

        ];
    }

    /**
     * Custom validation messages.
     */
    public function messages(): array
    {
        return [

            'log_aktivitas_id.required' => 'Log aktivitas wajib dipilih.',
            'log_aktivitas_id.integer'  => 'Log aktivitas tidak valid.',
            'log_aktivitas_id.exists'   => 'Log aktivitas tidak ditemukan.',

            'file.required' => 'File lampiran wajib diunggah.',
            'file.file'     => 'File yang dipilih tidak valid.',
            'file.mimes'    => 'Format file harus JPG, JPEG, PNG, PDF, DOC, DOCX, XLS, atau XLSX.',
            'file.max'      => 'Ukuran file maksimal 5 MB.',

        ];
    }

    /**
     * Custom attribute names.
     */
    public function attributes(): array
    {
        return [

            'log_aktivitas_id' => 'log aktivitas',

            'file' => 'lampiran',

        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        $this->merge([

            'log_aktivitas_id' => (int) $this->log_aktivitas_id,

        ]);
    }
}
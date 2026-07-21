<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreAkunRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nama' => 'required|string|max:100',
            'email' => 'required|email|unique:users,email,' . ($this->route('id') ?? 'NULL'),
            'username' => 'nullable|string|unique:users,username,' . ($this->route('id') ?? 'NULL'),
            'nim' => 'nullable|string|unique:users,nim,' . ($this->route('id') ?? 'NULL'),
            'role' => 'required|in:mahasiswa,pembimbing,admin',
            'password' => 'nullable|string|min:6',
        ];
    }
}

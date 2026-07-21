<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ImportAkunRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class ImportAkunController extends Controller
{
    public function import(ImportAkunRequest $request): JsonResponse
    {
        // For simplicity: expect JSON array `data` with user items
        $rows = $request->input('data', []);
        $created = 0;

        foreach ($rows as $r) {
            $email = $r['email'] ?? null;
            if (!$email) continue;

            $username = $r['username'] ?? explode('@', $email)[0];
            $password = Str::random(10);

            User::updateOrCreate([
                'email' => $email,
            ], [
                'nama' => $r['nama'] ?? $username,
                'username' => $username,
                'password' => Hash::make($password),
                'nim' => $r['nim'] ?? null,
                'role' => $r['role'] ?? 'mahasiswa',
                'is_active' => true,
            ]);

            $created++;
        }

        return response()->json([
            'success' => true,
            'message' => 'Import selesai.',
            'created' => $created,
        ]);
    }
}

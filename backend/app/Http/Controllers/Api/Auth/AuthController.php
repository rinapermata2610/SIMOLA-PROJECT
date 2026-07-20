<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Data tidak valid',
                'errors' => $validator->errors(),
            ], 422);
        }

        $user = User::where('username', $request->username)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Username atau password salah',
            ], 401);
        }

        $token = $user->createToken('simola-token')->plainTextToken;

        return response()->json([
            'message' => 'Login berhasil',
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'nama' => $user->nama,
                'username' => $user->username,
                'email' => $user->email,
                'nim' => $user->nim,
                'role' => $user->role,
            ],
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logout berhasil',
        ]);
    }

    public function me(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'id' => $user->id,
            'nama' => $user->nama,
            'username' => $user->username,
            'email' => $user->email,
            'nim' => $user->nim,
            'role' => $user->role,
        ]);
    }
}

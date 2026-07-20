<?php

use App\Http\Controllers\Api\Auth\AuthController;
use Illuminate\Support\Facades\Route;

// ============ AUTH ============
Route::post('/auth/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);

    // Endpoint lain (mahasiswa/pembimbing/laporan) akan ditambahkan bertahap
    // sesuai fitur yang sedang dikerjakan.
});

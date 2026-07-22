<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\Auth\AuthController;

use App\Http\Controllers\Api\Mahasiswa\DashboardController;
use App\Http\Controllers\Api\Mahasiswa\FormAktivitasController;
use App\Http\Controllers\Api\Mahasiswa\LogAktivitasController;
use App\Http\Controllers\Api\Mahasiswa\LampiranBuktiController;
use App\Http\Controllers\Api\Mahasiswa\ProfilController;

/*
|--------------------------------------------------------------------------
| Authentication
|--------------------------------------------------------------------------
*/

Route::prefix('auth')->group(function () {

    Route::post('/login', [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {

        Route::post('/logout', [AuthController::class, 'logout']);

        Route::get('/me', [AuthController::class, 'me']);

    });

});

/*
|--------------------------------------------------------------------------
| Mahasiswa
|--------------------------------------------------------------------------
*/

Route::middleware(['auth:sanctum'])
    ->prefix('mahasiswa')
    ->group(function () {

    /*
    |--------------------------------------------------------------------------
    | Dashboard
    |--------------------------------------------------------------------------
    */

    Route::controller(DashboardController::class)
        ->prefix('dashboard')
        ->group(function () {

            Route::get('/', 'index');

        });

    /*
    |--------------------------------------------------------------------------
    | Form Aktivitas
    |--------------------------------------------------------------------------
    */

    Route::controller(FormAktivitasController::class)
        ->prefix('form-aktivitas')
        ->group(function () {

            /*
            |--------------------------------------------------------------
            | Cek tanggal yang dipilih
            |--------------------------------------------------------------
            */

            Route::get('/check', 'check');

            /*
            |--------------------------------------------------------------
            | Simpan aktivitas
            |--------------------------------------------------------------
            */

            Route::post('/', 'store');

            /*
            |--------------------------------------------------------------
            | Update aktivitas
            |--------------------------------------------------------------
            */

            Route::put('/{id}', 'update');

            /*
            |--------------------------------------------------------------
            | Hapus aktivitas
            |--------------------------------------------------------------
            */

            Route::delete('/{id}', 'destroy');

        });

    /*
    |--------------------------------------------------------------------------
    | Log Aktivitas (History)
    |--------------------------------------------------------------------------
    */

    Route::controller(LogAktivitasController::class)
        ->prefix('log-aktivitas')
        ->group(function () {

            /*
            |--------------------------------------------------------------
            | Daftar Log
            |--------------------------------------------------------------
            */

            Route::get('/', 'index');

            /*
            |--------------------------------------------------------------
            | Detail Log
            |--------------------------------------------------------------
            */

            Route::get('/{id}', 'show');

        });

    /*
    |--------------------------------------------------------------------------
    | Lampiran Bukti
    |--------------------------------------------------------------------------
    */

    Route::controller(LampiranBuktiController::class)
        ->prefix('lampiran')
        ->group(function () {

            Route::get('/{logId}', 'index');

            Route::post('/', 'store');

            Route::get('/detail/{id}', 'show');

            Route::get('/download/{id}', 'download');

            Route::delete('/{id}', 'destroy');

        });

    /*
    |--------------------------------------------------------------------------
    | Profil Mahasiswa
    |--------------------------------------------------------------------------
    */

    Route::controller(ProfilController::class)
        ->group(function () {

            Route::get('/profile', 'show');

            Route::put('/profile', 'update');

            Route::put('/profile/password', 'changePassword');

        });

});
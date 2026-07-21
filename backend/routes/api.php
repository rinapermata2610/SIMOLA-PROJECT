<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\Auth\AuthController;

use App\Http\Controllers\Api\Mahasiswa\DashboardController;
use App\Http\Controllers\Api\Mahasiswa\LogAktivitasController;
use App\Http\Controllers\Api\Mahasiswa\LampiranBuktiController;
use App\Http\Controllers\Api\Mahasiswa\ProfilController;
use App\Http\Controllers\Api\Pembimbing\DashboardController as PembimbingDashboardController;
use App\Http\Controllers\Api\Pembimbing\LogAktivitasController as PembimbingLogAktivitasController;

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

Route::middleware(['auth:sanctum', 'role:mahasiswa'])->prefix('mahasiswa')->group(function () {

    /*
    |--------------------------------------------------------------------------
    | Dashboard
    |--------------------------------------------------------------------------
    */

    Route::get('/dashboard', [DashboardController::class, 'index']);

    /*
    |--------------------------------------------------------------------------
    | Log Aktivitas
    |--------------------------------------------------------------------------
    */

    Route::controller(LogAktivitasController::class)
        ->prefix('log-aktivitas')
        ->group(function () {

            Route::get('/', 'index');

            Route::post('/', 'store');

            Route::get('/{id}', 'show');

            Route::put('/{id}', 'update');

            Route::delete('/{id}', 'destroy');

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

/*
|--------------------------------------------------------------------------
| Pembimbing
|--------------------------------------------------------------------------
*/

Route::middleware(['auth:sanctum', 'role:pembimbing'])
    ->prefix('pembimbing')
    ->group(function () {

        Route::get('/dashboard', [PembimbingDashboardController::class, 'index']);

        Route::controller(PembimbingLogAktivitasController::class)
            ->prefix('log-aktivitas')
            ->group(function () {

                Route::get('/', 'index');

                Route::get('/{id}', 'show');

                Route::put('/{id}/verify', 'verify');

            });

    });
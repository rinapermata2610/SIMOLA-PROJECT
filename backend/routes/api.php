<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\Auth\AuthController;

use App\Http\Controllers\Api\Mahasiswa\DashboardController;
use App\Http\Controllers\Api\Mahasiswa\LogAktivitasController;
use App\Http\Controllers\Api\Mahasiswa\LampiranBuktiController;
use App\Http\Controllers\Api\Mahasiswa\ProfilController;
use App\Http\Controllers\Api\Pembimbing\DashboardController as PembimbingDashboardController;
use App\Http\Controllers\Api\Pembimbing\LogAktivitasController as PembimbingLogAktivitasController;
use App\Http\Controllers\Api\Admin\AkunController as AdminAkunController;
use App\Http\Controllers\Api\Admin\ImportAkunController as AdminImportAkunController;
use App\Http\Controllers\Api\Admin\PeriodeMagangController as AdminPeriodeController;
use App\Http\Controllers\Api\Admin\PenugasanController as AdminPenugasanController;
use App\Http\Controllers\Api\Admin\DashboardController as AdminDashboardController;

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

/*
|--------------------------------------------------------------------------
| Admin
|--------------------------------------------------------------------------
*/

Route::middleware(['auth:sanctum', 'role:admin'])
    ->prefix('admin')
    ->group(function () {

        // Akun
        Route::get('/akun', [AdminAkunController::class, 'index']);
        Route::post('/akun', [AdminAkunController::class, 'store']);
        Route::put('/akun/{id}', [AdminAkunController::class, 'update']);
        Route::put('/akun/{id}/deactivate', [AdminAkunController::class, 'deactivate']);
        Route::post('/akun/{id}/reset-password', [AdminAkunController::class, 'resetPassword']);

        Route::post('/akun/import', [AdminImportAkunController::class, 'import']);

        // Periode
        Route::get('/periode', [AdminPeriodeController::class, 'index']);
        Route::post('/periode', [AdminPeriodeController::class, 'store']);
        Route::put('/periode/{id}', [AdminPeriodeController::class, 'update']);

        // Penugasan
        Route::get('/penugasan', [AdminPenugasanController::class, 'index']);
        Route::post('/penugasan/assign', [AdminPenugasanController::class, 'assign']);
        Route::post('/penugasan/reassign', [AdminPenugasanController::class, 'reassign']);

        // Dashboard admin
        Route::get('/dashboard', [AdminDashboardController::class, 'index']);

    });
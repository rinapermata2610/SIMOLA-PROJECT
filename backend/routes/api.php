<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\Auth\AuthController;
use App\Http\Controllers\Api\Mahasiswa\DashboardController;
use App\Http\Controllers\Api\Mahasiswa\FormAktivitasController;
use App\Http\Controllers\Api\Mahasiswa\LogAktivitasController;
use App\Http\Controllers\Api\Mahasiswa\LampiranBuktiController;
use App\Http\Controllers\Api\Mahasiswa\ProfilController;
use App\Http\Controllers\Api\Pembimbing\DashboardController as PembimbingDashboardController;
use App\Http\Controllers\Api\Pembimbing\LogAktivitasController as PembimbingLogAktivitasController;
use App\Http\Controllers\Api\Admin\AkunController as AdminAkunController;
use App\Http\Controllers\Api\Admin\ImportAkunController as AdminImportAkunController;
use App\Http\Controllers\Api\Admin\PeriodeBatchController as AdminPeriodeBatchController;
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
Route::middleware(['auth:sanctum'])
    ->prefix('mahasiswa')
    ->group(function () {

    /*
    |--------------------------------------------------------------------------
    | Dashboard
    |--------------------------------------------------------------------------
    */
    Route::get('/dashboard', [DashboardController::class, 'index']);

    /*
    |--------------------------------------------------------------------------
    | Form Aktivitas (Pencecekan Tanggal)
    |--------------------------------------------------------------------------
    */
    Route::get('/form-aktivitas/check', [FormAktivitasController::class, 'check']);

    /*
    |--------------------------------------------------------------------------
    | Log Aktivitas & Form Aktivitas (CRUD)
    |--------------------------------------------------------------------------
    */
    Route::controller(LogAktivitasController::class)
        ->prefix('log-aktivitas')
        ->group(function () {
            Route::get('/', 'index');          // Ambil daftar log
            Route::post('/', 'store');         // Simpan log baru
            Route::get('/{id}', 'show');       // Detail log
            Route::put('/{id}', 'update');     // Update log
            Route::delete('/{id}', 'destroy'); // Hapus log
        });

    // Alias route untuk kompatibilitas jika Frontend masih menembak ke '/form-aktivitas'
    Route::controller(LogAktivitasController::class)
        ->prefix('form-aktivitas')
        ->group(function () {
            Route::post('/', 'store');
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
        ->prefix('profile')
        ->group(function () {
            Route::get('/', 'show');
            Route::put('/', 'update');
            Route::put('/password', 'changePassword');
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
        Route::put('/akun/{id}/activate', [AdminAkunController::class, 'activate']);
        Route::put('/akun/{id}/deactivate', [AdminAkunController::class, 'deactivate']);
        Route::post('/akun/{id}/reset-password', [AdminAkunController::class, 'resetPassword']);
        Route::delete('/akun/{id}', [AdminAkunController::class, 'destroy']);

        Route::post('/akun/import', [AdminImportAkunController::class, 'import']);

        // Periode
        Route::get('/periode', [AdminPeriodeController::class, 'index']);
        Route::post('/periode', [AdminPeriodeController::class, 'store']);
        Route::put('/periode/{id}', [AdminPeriodeController::class, 'update']);

        // Periode Batch
        Route::get('/periode-batch', [AdminPeriodeBatchController::class, 'index']);
        Route::post('/periode-batch', [AdminPeriodeBatchController::class, 'store']);
        Route::put('/periode-batch/{id}', [AdminPeriodeBatchController::class, 'update']);
        Route::get('/periode-batch/{id}', [AdminPeriodeBatchController::class, 'show']);
        Route::post('/periode-batch/{id}/mahasiswa', [AdminPeriodeBatchController::class, 'addMahasiswa']);
        Route::delete('/periode-batch/{id}/mahasiswa/{periodeId}', [AdminPeriodeBatchController::class, 'removeMahasiswa']);

        // Penugasan
        Route::get('/penugasan', [AdminPenugasanController::class, 'index']);
        Route::post('/penugasan/assign', [AdminPenugasanController::class, 'assign']);
        Route::post('/penugasan/reassign', [AdminPenugasanController::class, 'reassign']);

        // Dashboard admin
        Route::get('/dashboard', [AdminDashboardController::class, 'index']);
    });
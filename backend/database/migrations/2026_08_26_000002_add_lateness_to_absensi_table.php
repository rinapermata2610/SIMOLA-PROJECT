<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('absensi', function (Blueprint $table) {
            $table->enum('status_masuk', ['tepat_waktu', 'terlambat'])->nullable()->after('jam_masuk');
            $table->unsignedInteger('keterlambatan_masuk_menit')->default(0)->after('status_masuk');
            $table->enum('status_keluar', ['tepat_waktu', 'terlambat'])->nullable()->after('jam_keluar');
            $table->unsignedInteger('keterlambatan_keluar_menit')->default(0)->after('status_keluar');
        });
    }

    public function down(): void
    {
        Schema::table('absensi', function (Blueprint $table) {
            $table->dropColumn([
                'status_masuk',
                'keterlambatan_masuk_menit',
                'status_keluar',
                'keterlambatan_keluar_menit',
            ]);
        });
    }
};

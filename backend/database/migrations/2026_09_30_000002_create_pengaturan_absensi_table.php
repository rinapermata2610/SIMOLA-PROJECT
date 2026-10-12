<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pengaturan_absensi', function (Blueprint $table) {
            $table->id();
            $table->json('wfh_days');
            $table->timestamps();
        });

        DB::table('pengaturan_absensi')->insert([
            'id' => 1,
            'wfh_days' => json_encode([5]),
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('pengaturan_absensi');
    }
};
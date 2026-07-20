<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('penilaian_bulanan', function (Blueprint $table) {

            $table->id();

            // Log aktivitas yang dinilai
            $table->foreignId('log_aktivitas_id')
                ->constrained('log_aktivitas')
                ->cascadeOnUpdate()
                ->cascadeOnDelete();

            // Pembimbing yang melakukan verifikasi
            $table->foreignId('pembimbing_id')
                ->constrained('users')
                ->cascadeOnUpdate()
                ->cascadeOnDelete();

            // Hasil verifikasi
            $table->enum('status', [
                'approved',
                'revision'
            ]);

            // Catatan pembimbing
            $table->text('komentar')->nullable();

            // Waktu verifikasi
            $table->timestamp('verified_at')->nullable();

            $table->timestamps();

            // Index
            $table->index('status');
            $table->index('verified_at');

            // Satu log hanya memiliki satu data verifikasi
            $table->unique('log_aktivitas_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('penilaian_bulanan');
    }
};
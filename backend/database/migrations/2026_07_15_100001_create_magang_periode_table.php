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
        Schema::create('magang_periode', function (Blueprint $table) {

            $table->id();

            // Mahasiswa
            $table->foreignId('mahasiswa_id')
                ->constrained('users')
                ->cascadeOnUpdate()
                ->cascadeOnDelete();

            // Pembimbing
            $table->foreignId('pembimbing_id')
                ->constrained('users')
                ->cascadeOnUpdate()
                ->cascadeOnDelete();

            // Informasi magang
            $table->string('instansi', 150);

            $table->date('tanggal_mulai');

            $table->date('tanggal_selesai');

            $table->enum('status', [
                'aktif',
                'selesai'
            ])->default('aktif');

            $table->timestamps();

            // Satu mahasiswa tidak boleh memiliki
            // dua periode magang aktif sekaligus.
            $table->unique(
                ['mahasiswa_id', 'status'],
                'unique_mahasiswa_status'
            );
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('magang_periode');
    }
};
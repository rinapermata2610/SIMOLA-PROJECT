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
        Schema::create('log_aktivitas', function (Blueprint $table) {

            $table->id();

            // Mahasiswa yang membuat log
            $table->foreignId('mahasiswa_id')
                ->constrained('users')
                ->cascadeOnUpdate()
                ->cascadeOnDelete();

            // Periode magang
            $table->foreignId('periode_id')
                ->constrained('magang_periode')
                ->cascadeOnUpdate()
                ->cascadeOnDelete();

            // Tanggal aktivitas
            $table->date('tanggal');

            // Informasi aktivitas
            $table->string('judul',255);

            $table->text('deskripsi');

            $table->text('hasil');

            // Waktu pengerjaan
            $table->time('jam_mulai')->nullable();

            $table->time('jam_selesai')->nullable();

            // Status aktivitas
            $table->enum('status',[
                'draft',
                'submitted',
                'approved',
                'revision'
            ])->default('draft');

            // Waktu dikirim ke pembimbing
            $table->timestamp('submitted_at')->nullable();

            $table->timestamps();

            // Soft Delete
            $table->softDeletes();

            // Index
            $table->index('tanggal');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('log_aktivitas');
    }
};
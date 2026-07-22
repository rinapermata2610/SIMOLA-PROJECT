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

            /*
            |--------------------------------------------------------------------------
            | Relasi
            |--------------------------------------------------------------------------
            */

            $table->foreignId('mahasiswa_id')
                ->constrained('users')
                ->cascadeOnUpdate()
                ->cascadeOnDelete();

            $table->foreignId('periode_id')
                ->constrained('magang_periode')
                ->cascadeOnUpdate()
                ->cascadeOnDelete();

            /*
            |--------------------------------------------------------------------------
            | Informasi Aktivitas
            |--------------------------------------------------------------------------
            */

            $table->date('tanggal');

            $table->string('judul', 255);

            $table->text('deskripsi');

            $table->text('hasil');

            /*
            |--------------------------------------------------------------------------
            | Waktu Pengerjaan
            |--------------------------------------------------------------------------
            */

            $table->time('jam_mulai')->nullable();

            $table->time('jam_selesai')->nullable();

            /*
            |--------------------------------------------------------------------------
            | Status
            |--------------------------------------------------------------------------
            */

            $table->enum('status', [
                'draft',
                'submitted',
                'approved',
                'revision',
            ])->default('draft');

            $table->timestamp('submitted_at')->nullable();

            /*
            |--------------------------------------------------------------------------
            | Timestamp
            |--------------------------------------------------------------------------
            */

            $table->timestamps();

            $table->softDeletes();

            /*
            |--------------------------------------------------------------------------
            | Index
            |--------------------------------------------------------------------------
            */

            $table->index('tanggal');

            $table->index('status');

            $table->index('mahasiswa_id');

            $table->index('periode_id');

            $table->index(['mahasiswa_id', 'tanggal']);

            $table->index(['periode_id', 'tanggal']);

            /*
            |--------------------------------------------------------------------------
            | Constraint
            |--------------------------------------------------------------------------
            */

            // Satu mahasiswa hanya boleh memiliki
            // satu log aktivitas pada satu tanggal.
            $table->unique(
                ['mahasiswa_id', 'tanggal'],
                'unique_mahasiswa_tanggal'
            );
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
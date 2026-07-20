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
        Schema::create('lampiran_bukti', function (Blueprint $table) {

            $table->id();

            // Relasi ke log aktivitas
            $table->foreignId('log_aktivitas_id')
                ->constrained('log_aktivitas')
                ->cascadeOnUpdate()
                ->cascadeOnDelete();

            // Informasi file
            $table->string('nama_file',255);

            // Nama file yang tersimpan di storage
            $table->string('file_path',255);

            // Mime type
            $table->string('file_type',100);

            // Ukuran file (Byte)
            $table->unsignedBigInteger('file_size');

            $table->timestamps();

            // Index
            $table->index('log_aktivitas_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lampiran_bukti');
    }
};
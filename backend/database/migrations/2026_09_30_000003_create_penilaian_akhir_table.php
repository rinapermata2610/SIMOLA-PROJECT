<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('penilaian_akhir', function (Blueprint $table) {
            $table->id();
            $table->foreignId('periode_id')->unique()->constrained('magang_periode')->cascadeOnDelete();
            $table->foreignId('mahasiswa_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('pembimbing_id')->constrained('users')->cascadeOnDelete();
            $table->json('scores');
            $table->decimal('nilai_akhir', 5, 2);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('penilaian_akhir');
    }
};
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
        // ===========================
        // USERS
        // ===========================
        Schema::create('users', function (Blueprint $table) {

            $table->id();

            // Informasi pengguna
            $table->string('nama', 100);
            $table->string('username', 100)->unique();
            $table->string('email', 100)->unique();
            $table->string('password', 255);

            // Hanya mahasiswa yang memiliki NIM
            $table->string('nim', 30)->nullable()->unique();

            // Role pengguna
            $table->enum('role', [
                'mahasiswa',
                'pembimbing',
                'admin'
            ])->default('mahasiswa');

            $table->rememberToken();

            $table->timestamps();

            // Index pencarian
            $table->index('nama');
        });

        // ===========================
        // PASSWORD RESET
        // ===========================
        Schema::create('password_reset_tokens', function (Blueprint $table) {

            $table->string('email')->primary();

            $table->string('token');

            $table->timestamp('created_at')->nullable();
        });

        // ===========================
        // SESSIONS
        // ===========================
        Schema::create('sessions', function (Blueprint $table) {

            $table->string('id')->primary();

            $table->foreignId('user_id')
                ->nullable()
                ->index();

            $table->string('ip_address', 45)
                ->nullable();

            $table->text('user_agent')
                ->nullable();

            $table->longText('payload');

            $table->integer('last_activity')
                ->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sessions');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('users');
    }
};
<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // ==========================
        // ADMIN
        // ==========================
        User::updateOrCreate(
            [
                'username' => 'admin',
            ],
            [
                'nama'     => 'Administrator SIMOLA',
                'email'    => 'admin@simola.id',
                'password' => Hash::make('admin123'),
                'nim'      => null,
                'role'     => 'admin',
            ]
        );

        // ==========================
        // PEMBIMBING
        // ==========================
        User::updateOrCreate(
            [
                'username' => 'budisantoso',
            ],
            [
                'nama'     => 'Budi Santoso, M.Kom',
                'email'    => 'budi.santoso@simola.id',
                'password' => Hash::make('password123'),
                'nim'      => null,
                'role'     => 'pembimbing',
            ]
        );

        // ==========================
        // MAHASISWA
        // ==========================
        User::updateOrCreate(
            [
                'username' => 'ahmadfauzi',
            ],
            [
                'nama'     => 'Ahmad Fauzi',
                'email'    => 'ahmad.fauzi@simola.id',
                'password' => Hash::make('password123'),
                'nim'      => '202401001',
                'role'     => 'mahasiswa',
            ]
        );

        $this->command->info('UserSeeder berhasil dijalankan.');
    }
}
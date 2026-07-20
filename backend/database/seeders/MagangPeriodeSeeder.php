<?php

namespace Database\Seeders;

use App\Models\MagangPeriode;
use App\Models\User;
use Illuminate\Database\Seeder;

class MagangPeriodeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Ambil user berdasarkan role
        $mahasiswa = User::where('role', 'mahasiswa')->first();
        $pembimbing = User::where('role', 'pembimbing')->first();

        // Pastikan user tersedia
        if (!$mahasiswa || !$pembimbing) {
            $this->command->error('Mahasiswa atau Pembimbing belum tersedia.');
            return;
        }

        // Buat atau perbarui periode magang
        MagangPeriode::updateOrCreate(
            [
                'mahasiswa_id' => $mahasiswa->id,
                'status' => 'aktif',
            ],
            [
                'pembimbing_id'   => $pembimbing->id,
                'instansi'        => 'Balai Bahasa Provinsi Jawa Barat',
                'tanggal_mulai'   => '2026-07-15',
                'tanggal_selesai' => '2026-08-13',
                'status'          => 'aktif',
            ]
        );

        $this->command->info('MagangPeriodeSeeder berhasil dijalankan.');
    }
}
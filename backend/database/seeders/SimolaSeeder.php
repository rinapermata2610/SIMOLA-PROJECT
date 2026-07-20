<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class SimolaSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            MagangPeriodeSeeder::class,
        ]);

        $this->command->info('=======================================');
        $this->command->info('SIMOLA Seeder berhasil dijalankan');
        $this->command->info('=======================================');
    }
}
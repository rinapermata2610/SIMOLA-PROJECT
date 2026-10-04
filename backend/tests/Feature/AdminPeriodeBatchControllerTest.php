<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\PeriodeBatch;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminPeriodeBatchControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_fetch_periode_batches(): void
    {
        $admin = User::factory()->create([
            'role' => 'admin',
            'is_active' => true,
        ]);

        $this->actingAs($admin, 'sanctum');

        $response = $this->getJson('/api/admin/periode-batch');

        $response->assertOk()
            ->assertJsonStructure([
                'success',
                'data',
                'meta',
            ]);
    }

    public function test_admin_dashboard_uses_the_same_periode_batch_data_as_management(): void
    {
        $admin = User::factory()->create([
            'role' => 'admin',
            'is_active' => true,
        ]);

        $batch = PeriodeBatch::create([
            'nama_batch' => 'Batch Oktober',
            'instansi' => 'Balai Bahasa',
            'tanggal_mulai' => '2026-10-01',
            'tanggal_selesai' => '2026-12-31',
            'status' => 'aktif',
        ]);

        $this->actingAs($admin, 'sanctum');

        $dashboard = $this->getJson('/api/admin/dashboard');
        $management = $this->getJson('/api/admin/periode-batch');

        $dashboard->assertOk()
            ->assertJsonPath('data.periode_terbaru.0.id', $batch->id)
            ->assertJsonPath('data.periode_terbaru.0.nama_batch', 'Batch Oktober')
            ->assertJsonPath('data.periode_terbaru.0.jumlah_mahasiswa', 0);

        $management->assertOk()
            ->assertJsonPath('data.0.id', $batch->id)
            ->assertJsonPath('data.0.nama_batch', 'Batch Oktober')
            ->assertJsonPath('data.0.jumlah_mahasiswa', 0);
    }
}

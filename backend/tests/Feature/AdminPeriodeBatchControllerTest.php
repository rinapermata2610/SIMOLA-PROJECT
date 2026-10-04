<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\MagangPeriode;
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

    public function test_legacy_active_period_is_attached_to_batch_without_creating_duplicate(): void
    {
        $admin = User::factory()->create(['role' => 'admin', 'is_active' => true]);
        $mahasiswa = User::factory()->create(['role' => 'mahasiswa']);
        $pembimbingLama = User::factory()->create(['role' => 'pembimbing', 'nim' => null]);
        $pembimbingBaru = User::factory()->create(['role' => 'pembimbing', 'nim' => null]);
        $batch = PeriodeBatch::create([
            'nama_batch' => 'Batch Baru',
            'instansi' => 'Balai Bahasa',
            'tanggal_mulai' => '2026-10-01',
            'tanggal_selesai' => '2026-12-31',
            'status' => 'aktif',
        ]);
        $legacyPeriod = MagangPeriode::create([
            'mahasiswa_id' => $mahasiswa->id,
            'pembimbing_id' => $pembimbingLama->id,
            'instansi' => '',
            'tanggal_mulai' => '2026-09-01',
            'tanggal_selesai' => '2026-09-30',
            'status' => 'aktif',
        ]);

        $this->actingAs($admin, 'sanctum')
            ->postJson("/api/admin/periode-batch/{$batch->id}/mahasiswa", [
                'mahasiswa_id' => $mahasiswa->id,
                'pembimbing_id' => $pembimbingBaru->id,
            ])
            ->assertCreated()
            ->assertJsonPath('data.id', $legacyPeriod->id);

        $this->assertDatabaseCount('magang_periode', 1);
        $this->assertDatabaseHas('magang_periode', [
            'id' => $legacyPeriod->id,
            'periode_batch_id' => $batch->id,
            'pembimbing_id' => $pembimbingBaru->id,
            'instansi' => 'Balai Bahasa',
        ]);
    }

    public function test_admin_can_change_active_period_supervisor_from_batch_management(): void
    {
        $admin = User::factory()->create(['role' => 'admin', 'is_active' => true]);
        $mahasiswa = User::factory()->create(['role' => 'mahasiswa']);
        $pembimbingLama = User::factory()->create(['role' => 'pembimbing', 'nim' => null]);
        $pembimbingBaru = User::factory()->create(['role' => 'pembimbing', 'nim' => null]);
        $batch = PeriodeBatch::create([
            'nama_batch' => 'Batch Aktif',
            'instansi' => 'Balai Bahasa',
            'tanggal_mulai' => '2026-10-01',
            'tanggal_selesai' => '2026-12-31',
            'status' => 'aktif',
        ]);
        $period = MagangPeriode::create([
            'periode_batch_id' => $batch->id,
            'mahasiswa_id' => $mahasiswa->id,
            'pembimbing_id' => $pembimbingLama->id,
            'instansi' => $batch->instansi,
            'tanggal_mulai' => $batch->tanggal_mulai,
            'tanggal_selesai' => $batch->tanggal_selesai,
            'status' => 'aktif',
        ]);

        $this->actingAs($admin, 'sanctum')
            ->putJson("/api/admin/periode-batch/{$batch->id}/mahasiswa/{$period->id}", [
                'pembimbing_id' => $pembimbingBaru->id,
            ])
            ->assertOk()
            ->assertJsonPath('data.pembimbing.id', $pembimbingBaru->id);

        $this->assertDatabaseCount('magang_periode', 1);
        $this->assertDatabaseHas('magang_periode', [
            'id' => $period->id,
            'pembimbing_id' => $pembimbingBaru->id,
        ]);
    }

    public function test_admin_account_list_shows_active_supervisor_as_information(): void
    {
        $admin = User::factory()->create(['role' => 'admin', 'is_active' => true]);
        $mahasiswa = User::factory()->create(['role' => 'mahasiswa']);
        $pembimbing = User::factory()->create(['role' => 'pembimbing', 'nim' => null]);
        MagangPeriode::create([
            'mahasiswa_id' => $mahasiswa->id,
            'pembimbing_id' => $pembimbing->id,
            'instansi' => 'Balai Bahasa',
            'tanggal_mulai' => '2026-09-01',
            'tanggal_selesai' => '2026-12-31',
            'status' => 'aktif',
        ]);

        $this->actingAs($admin, 'sanctum')
            ->getJson('/api/admin/akun?role=mahasiswa')
            ->assertOk()
            ->assertJsonPath('data.0.has_active_period', true)
            ->assertJsonPath('data.0.periode_aktif.pembimbing.nama', $pembimbing->nama);
    }

    public function test_account_statistics_count_all_filtered_users_across_pages(): void
    {
        $admin = User::factory()->create(['role' => 'admin', 'is_active' => true]);
        User::factory()->count(18)->create(['role' => 'mahasiswa', 'is_active' => true]);
        User::factory()->count(2)->create(['role' => 'pembimbing', 'is_active' => true, 'nim' => null]);

        $this->actingAs($admin, 'sanctum')
            ->getJson('/api/admin/akun')
            ->assertOk()
            ->assertJsonPath('meta.total', 21)
            ->assertJsonCount(20, 'data')
            ->assertJsonPath('stats.total', 21)
            ->assertJsonPath('stats.mahasiswaAktif', 18)
            ->assertJsonPath('stats.pembimbingAktif', 2);
    }
}

<?php

namespace Tests\Feature;

use App\Models\MagangPeriode;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class PenilaianAkhirSyncTest extends TestCase
{
    use RefreshDatabase;

    public function test_supervisor_saved_scores_are_shared_with_student_and_admin(): void
    {
        $student = $this->createUser('mahasiswa', 'student');
        $supervisor = $this->createUser('pembimbing', 'supervisor');
        $supervisor->nip = '198001012010011001';
        $supervisor->save();
        $admin = $this->createUser('admin', 'admin');
        Sanctum::actingAs($admin);
        $this->postJson('/api/admin/periode', [
            'mahasiswa_id' => $student->id,
            'pembimbing_id' => $supervisor->id,
            'instansi' => 'Instansi Test',
            'tanggal_mulai' => '2026-07-01',
            'tanggal_selesai' => '2026-08-31',
            'status' => 'aktif',
        ])->assertCreated();

        Sanctum::actingAs($supervisor);
        $this->putJson("/api/pembimbing/penilaian-akhir/{$student->id}", [
            'scores' => [90, 80, 80, 80, 80, 90],
        ])
            ->assertOk()
            ->assertJsonPath('data.nilai_akhir', 84)
            ->assertJsonPath('data.nilai_huruf', 'A');

        Sanctum::actingAs($student);
        $this->getJson('/api/mahasiswa/profile')
            ->assertOk()
            ->assertJsonPath('data.penilaian_akhir.nilai_akhir', 84)
            ->assertJsonPath('data.universitas', null);

        Sanctum::actingAs($admin);
        $this->getJson('/api/admin/penilaian-akhir')
            ->assertOk()
            ->assertJsonPath('data.0.mahasiswa.id', $student->id)
            ->assertJsonPath('data.0.pembimbing.id', $supervisor->id)
            ->assertJsonPath('data.0.pembimbing.nip', '198001012010011001')
            ->assertJsonPath('data.0.periode.instansi', 'Instansi Test');
    }

    private function createUser(string $role, string $suffix): User
    {
        return User::query()->create([
            'nama' => ucfirst($suffix),
            'username' => $suffix,
            'email' => "{$suffix}@example.test",
            'password' => 'password',
            'role' => $role,
        ]);
    }
}
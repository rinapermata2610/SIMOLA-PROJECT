<?php

namespace Tests\Feature;

use App\Models\Absensi;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ClockOutScheduleTest extends TestCase
{
    use RefreshDatabase;

    protected function tearDown(): void
    {
        Carbon::setTestNow();

        parent::tearDown();
    }

    public function test_clock_out_is_rejected_before_four_pm(): void
    {
        Carbon::setTestNow(Carbon::parse('2026-10-02 15:59:59', 'Asia/Jakarta'));
        $student = $this->createStudent();
        Sanctum::actingAs($student);
        $this->createAttendance($student, '2026-10-02');

        $this->postJson('/api/mahasiswa/absensi/keluar')
            ->assertUnprocessable()
            ->assertJsonPath('message', 'Absen keluar hanya dapat dilakukan pukul 16.00 sampai 18.00 WIB.');

        $this->assertDatabaseHas('absensi', [
            'mahasiswa_id' => $student->id,
            'tanggal' => '2026-10-02',
            'jam_keluar' => null,
        ]);
    }

    public function test_clock_out_is_allowed_at_four_pm(): void
    {
        Carbon::setTestNow(Carbon::parse('2026-10-02 16:00:00', 'Asia/Jakarta'));
        $student = $this->createStudent();
        Sanctum::actingAs($student);
        $this->createAttendance($student, '2026-10-02');

        $this->postJson('/api/mahasiswa/absensi/keluar')
            ->assertOk()
            ->assertJsonPath('success', true);
    }

    public function test_clock_out_is_allowed_at_six_pm(): void
    {
        Carbon::setTestNow(Carbon::parse('2026-10-02 18:00:00', 'Asia/Jakarta'));
        $student = $this->createStudent();
        Sanctum::actingAs($student);
        $this->createAttendance($student, '2026-10-02');

        $this->postJson('/api/mahasiswa/absensi/keluar')
            ->assertOk()
            ->assertJsonPath('success', true);
    }

    public function test_clock_out_is_rejected_after_six_pm(): void
    {
        Carbon::setTestNow(Carbon::parse('2026-10-02 18:00:01', 'Asia/Jakarta'));
        $student = $this->createStudent();
        Sanctum::actingAs($student);
        $this->createAttendance($student, '2026-10-02');

        $this->postJson('/api/mahasiswa/absensi/keluar')
            ->assertUnprocessable()
            ->assertJsonPath('message', 'Absen keluar hanya dapat dilakukan pukul 16.00 sampai 18.00 WIB.');
    }

    private function createStudent(): User
    {
        return User::query()->create([
            'nama' => 'Mahasiswa Test',
            'username' => 'mahasiswa-test',
            'email' => 'mahasiswa-test@example.test',
            'password' => 'password',
            'role' => 'mahasiswa',
        ]);
    }

    private function createAttendance(User $student, string $date): void
    {
        Absensi::query()->create([
            'mahasiswa_id' => $student->id,
            'tanggal' => $date,
            'jam_masuk' => '09:00:00',
        ]);
    }
}
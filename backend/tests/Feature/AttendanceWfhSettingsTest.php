<?php

namespace Tests\Feature;

use App\Models\PengaturanAbsensi;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AttendanceWfhSettingsTest extends TestCase
{
    use RefreshDatabase;

    protected function tearDown(): void
    {
        Carbon::setTestNow();

        parent::tearDown();
    }

    public function test_admin_can_select_any_weekday_for_wfh(): void
    {
        $admin = $this->createUser('admin');
        Sanctum::actingAs($admin);

        $this->putJson('/api/admin/pengaturan-absensi', [
            'wfh_days' => [1, 3],
        ])
            ->assertOk()
            ->assertJsonPath('data.wfh_days', [1, 3]);

        $this->assertSame([1, 3], PengaturanAbsensi::wfhDays());
    }

    public function test_selected_wfh_day_does_not_require_office_location(): void
    {
        Carbon::setTestNow(Carbon::parse('2026-09-30 08:00:00', 'Asia/Jakarta'));
        PengaturanAbsensi::query()->find(1)->update(['wfh_days' => [3]]);
        Sanctum::actingAs($this->createUser('mahasiswa'));

        $this->getJson('/api/mahasiswa/absensi')
            ->assertOk()
            ->assertJsonPath('workday.is_wfh', true)
            ->assertJsonPath('workday.requires_office_location', false)
            ->assertJsonPath('location.required', false);
    }

    public function test_non_wfh_weekday_requires_office_location(): void
    {
        Carbon::setTestNow(Carbon::parse('2026-10-01 08:00:00', 'Asia/Jakarta'));
        PengaturanAbsensi::query()->find(1)->update(['wfh_days' => [3]]);
        Sanctum::actingAs($this->createUser('mahasiswa'));

        $this->getJson('/api/mahasiswa/absensi')
            ->assertOk()
            ->assertJsonPath('workday.is_wfh', false)
            ->assertJsonPath('workday.requires_office_location', true)
            ->assertJsonPath('location.required', true);
    }

    private function createUser(string $role): User
    {
        return User::query()->create([
            'nama' => ucfirst($role) . ' Test',
            'username' => $role . '-test',
            'email' => $role . '-test@example.test',
            'password' => 'password',
            'role' => $role,
        ]);
    }
}
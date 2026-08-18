<?php

namespace Tests\Feature;

use App\Models\User;
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
}

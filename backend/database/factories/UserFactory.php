<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<User>
 */
class UserFactory extends Factory
{
    protected $model = User::class;

    public function definition(): array
    {
        $name = fake()->name();

        return [
            'nama' => $name,
            'username' => Str::slug($name) . '-' . fake()->unique()->numerify('###'),
            'email' => fake()->unique()->safeEmail(),
            'password' => bcrypt('password'),
            'nim' => fake()->unique()->numerify('2024########'),
            'role' => 'mahasiswa',
            'is_active' => true,
        ];
    }
}

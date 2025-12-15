<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create admin user
        User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Admin User',
                'password' => bcrypt('admin123'),
                'role' => 'admin',
                'status' => true,
            ]
        );

        // Create regular user
        User::firstOrCreate(
            ['email' => 'user@example.com'],
            [
                'name' => 'Regular User',
                'password' => bcrypt('user123'),
                'role' => 'user',
                'status' => true,
            ]
        );

        // Create test user (old)
        User::firstOrCreate(
            ['email' => 'andika@example.com'],
            [
                'name' => 'Test User',
                'password' => bcrypt('123123'),
                'role' => 'user',
                'status' => true,
            ]
        );

        // Seed sensor data
        $this->call(\Database\Seeders\SensorDataSeeder::class);
    }
}

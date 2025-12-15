<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\SensorData;

class SensorDataSeeder extends Seeder
{
    public function run(): void
    {
        // create 10 sample sensor data records
        SensorData::factory()->count(10)->create();
    }
}

<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\SensorData;

class SensorDataFactory extends Factory
{
    protected $model = SensorData::class;

    public function definition()
    {
        return [
            'device_id'    => 'DEV-' . $this->faker->bothify('???-#####'),
            'voltage'      => $this->faker->randomFloat(2, 200, 250),
            'current'      => $this->faker->randomFloat(2, 0, 100),
            'frequency'    => $this->faker->randomFloat(2, 45, 55),
            'raw1'         => $this->faker->randomFloat(2, 0, 1023),
            'raw2'         => $this->faker->randomFloat(2, 0, 1023),
            'raw3'         => $this->faker->randomFloat(2, 0, 1023),
            'measured_at'  => $this->faker->dateTimeBetween('-7 days', 'now'),
        ];
    }
}

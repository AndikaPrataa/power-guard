<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Device; 
use App\Models\RealtimeParameter;
use App\Models\SensorData;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $sensorData = SensorData::orderBy('measured_at', 'desc')->limit(10)->get();

        return Inertia::render('Dashboard', [
            'totalUsers'     => User::count(),
            // 'totalDevices'   => Device::count(),
            // 'latestRealtime' => RealtimeParameter::latest()->first(),
            'sensorData'     => $sensorData,
        ]);

    }
}

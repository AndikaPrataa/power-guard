<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\NotificationLog;
use App\Models\SensorData;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    public function index()
    {
        // Get the single latest sensor_data row (by measured_at)
        $latestSensor = SensorData::orderBy('measured_at', 'desc')->first();

        /** @var \App\Models\User|null $authUser */
        $authUser = Auth::user();
        if (!$authUser) {
            return Inertia::render('Notification', [
                'latest' => collect([]),
                'history' => collect([]),
            ]);
        }
        $userId = $authUser->id;

        // Fetch history (recent notifications for the current user)
        $historyNotifications = NotificationLog::with(['event.threshold','user','event.sensor'])
            ->where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->limit(200)
            ->get();

        // Fetch latest notifications (for the single latest sensor_data) if present
        $latestNotifications = collect([]);
        if ($latestSensor) {
            $latestSensorId = $latestSensor->id;
            $latestNotifications = NotificationLog::with(['event.threshold','user','event.sensor'])
                ->where('user_id', $userId)
                ->whereHas('event', function($q) use ($latestSensorId) {
                    $q->where('sensor_data_id', $latestSensorId);
                })
                ->orderBy('created_at', 'desc')
                ->limit(100)
                ->get()
                ->unique('event_id')
                ->values();
        }

        // Normalizer function for frontend payload
        $normalize = function($n) {
            $event = $n->event;
            $sensor = $event->sensor ?? null;
            $threshold = $event->threshold ?? null;

            return [
                'id' => $n->id,
                'title' => $threshold->name ?? $event->event_type ?? 'Event',
                'event_type' => $event->event_type ?? null,
                'device_id' => $sensor->device_id ?? ($n->payload['device_id'] ?? null),
                'value' => $event->value ?? ($n->payload['event']['value'] ?? null),
                'sensor_voltage' => $sensor->voltage ?? null,
                'sensor_current' => $sensor->current ?? null,
                'sensor_frequency' => $sensor->frequency ?? null,
                'threshold' => $threshold ? $threshold->only(['id','name']) : null,
                'created_at' => $n->created_at,
                'raw_payload' => $n->payload,
            ];
        };

        // Avoid duplicate display: exclude events that are included in `latest`
        $latestEventIds = $latestNotifications->pluck('event_id')->toArray();

        $historyNotifications = $historyNotifications->reject(function($n) use ($latestEventIds) {
            return in_array($n->event_id, $latestEventIds);
        })->unique('event_id')->values();

        $latest = $latestNotifications->map($normalize)->values();
        $history = $historyNotifications->map($normalize)->values();

        return Inertia::render('Notification', [
            'latest' => $latest,
            'history' => $history,
        ]);
    }
}

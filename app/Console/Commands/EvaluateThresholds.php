<?php
namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\SensorData;
use App\Models\Threshold;
use App\Models\EventLog;
use App\Models\NotificationLog;
use App\Models\User;
use Carbon\Carbon;

class EvaluateThresholds extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'thresholds:evaluate';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Evaluate threshold rules against latest sensor data and create events/notifications.';

    public function handle()
    {
        $this->info('Evaluating thresholds...');

        $thresholds = Threshold::where('active', true)->get();
        if ($thresholds->isEmpty()) {
            $this->info('No active thresholds.');
            return Command::SUCCESS;
        }

        // Process latest sensor data per device
        $deviceIds = SensorData::select('device_id')->distinct()->pluck('device_id');

        foreach ($deviceIds as $deviceId) {
            $sd = SensorData::where('device_id', $deviceId)->orderBy('measured_at', 'desc')->first();
            if (!$sd) continue;

            foreach ($thresholds as $t) {
                $breach = null;
                $value = null;

                // Voltage checks
                if (!is_null($t->voltage_min) && !is_null($sd->voltage) && $sd->voltage < $t->voltage_min) {
                    $breach = 'undervoltage';
                    $value = $sd->voltage;
                }

                if (!is_null($t->voltage_max) && !is_null($sd->voltage) && $sd->voltage > $t->voltage_max) {
                    $breach = 'overvoltage';
                    $value = $sd->voltage;
                }

                // Current checks
                if (!is_null($t->current_min) && !is_null($sd->current) && $sd->current < $t->current_min) {
                    // no dedicated event type for low current; use custom
                    $breach = 'custom';
                    $value = $sd->current;
                }

                if (!is_null($t->current_max) && !is_null($sd->current) && $sd->current > $t->current_max) {
                    $breach = 'overcurrent';
                    $value = $sd->current;
                }

                // Frequency checks
                if (!is_null($t->frequency_min) && !is_null($sd->frequency) && $sd->frequency < $t->frequency_min) {
                    $breach = 'frequency_anomaly';
                    $value = $sd->frequency;
                }

                if (!is_null($t->frequency_max) && !is_null($sd->frequency) && $sd->frequency > $t->frequency_max) {
                    $breach = 'frequency_anomaly';
                    $value = $sd->frequency;
                }

                // only proceed if a breach was detected and value is valid
                if ($breach) {
                    // skip if value is null or not numeric — not a real measurable breach
                    if (is_null($value) || (!is_numeric($value) && !is_int($value) && !is_float($value))) {
                        continue;
                    }
                    // avoid duplicate for same sensor reading & threshold & event_type
                    $exists = EventLog::where('sensor_data_id', $sd->id)
                        ->where('threshold_id', $t->id)
                        ->where('event_type', $breach)
                        ->exists();

                    if ($exists) continue;

                    $event = EventLog::create([
                        'sensor_data_id' => $sd->id,
                        'event_type' => $breach,
                        'value' => $value,
                        'level' => 'critical',
                        'threshold_id' => $t->id,
                        'detected_at' => Carbon::now(),
                        'notified' => false,
                        'status' => 'unread',
                    ]);

                    // notify admins
                    $admins = User::where('role', 'admin')->get();
                    $payload = [
                        'device_id' => $sd->device_id,
                        'sensor_data_id' => $sd->id,
                        'threshold' => $t->toArray(),
                        'event' => $event->toArray(),
                    ];

                    foreach ($admins as $admin) {
                        NotificationLog::create([
                            'event_id' => $event->id,
                            'user_id' => $admin->id,
                            'channel' => 'webpush',
                            'payload' => $payload,
                            'sent_at' => Carbon::now(),
                            'status' => 'sent',
                        ]);
                    }

                    $event->notified = true;
                    $event->save();
                    $this->info("Event created: {$breach} device={$sd->device_id} threshold={$t->id}");
                }
            }
        }

        $this->info('Threshold evaluation completed.');
        return Command::SUCCESS;
    }
}

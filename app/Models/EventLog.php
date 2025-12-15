<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class EventLog extends Model
{
    protected $table = 'event_log';
    protected $fillable = ['sensor_data_id','event_type','value','level','threshold_id','detected_at','notified','status'];
    protected $casts = ['detected_at' => 'datetime'];

    public function sensor()
    {
        return $this->belongsTo(SensorData::class, 'sensor_data_id');
    }

    public function threshold()
    {
        return $this->belongsTo(Threshold::class, 'threshold_id');
    }
}

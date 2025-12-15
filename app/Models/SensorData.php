<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SensorData extends Model
{
    use HasFactory;
    protected $table = 'sensor_data';
    protected $fillable = ['device_id','voltage','current','frequency','raw1','raw2','raw3','measured_at'];
    protected $casts = [
        'measured_at' => 'datetime',
        'voltage' => 'double',
        'current' => 'double',
        'frequency' => 'double',
    ];

    public function events()
    {
        return $this->hasMany(EventLog::class, 'sensor_data_id');
    }
}

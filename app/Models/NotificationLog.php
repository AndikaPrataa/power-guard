<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class NotificationLog extends Model
{
    protected $table = 'notification_logs';
    protected $fillable = ['event_id','user_id','channel','payload','sent_at','status'];
    protected $casts = ['payload'=>'array','sent_at'=>'datetime'];

    public function event()
    {
        return $this->belongsTo(EventLog::class, 'event_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}

<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Report extends Model
{
    protected $fillable = ['code', 'data', 'start_date', 'end_date', 'user_id', 'type'];
    protected $casts = ['start_date' => 'date', 'end_date' => 'date', 'created_at' => 'datetime'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

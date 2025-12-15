<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Threshold extends Model
{
    use HasFactory;

    protected $table = 'threshold_rules';

    protected $fillable = [
        'name',
        'voltage_min',
        'voltage_max',
        'current_min',
        'current_max',
        'frequency_min',
        'frequency_max',
        'active',
        'created_by'
    ];

    protected $casts = [
        'voltage_min' => 'float',
        'voltage_max' => 'float',
        'current_min' => 'float',
        'current_max' => 'float',
        'frequency_min' => 'float',
        'frequency_max' => 'float',
        'active' => 'boolean',
    ];

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}

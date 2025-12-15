<?php

namespace App\Http\Controllers;

use App\Models\Report;
use Inertia\Inertia;

class DataProvenController extends Controller
{
    // Public page to view report data by code (no authentication needed)
    public function show($code)
    {
        $report = Report::where('code', $code)->firstOrFail();

        $data = json_decode($report->data, true);

        return Inertia::render('DataProven', [
            'reportCode' => $report->code,
            'startDate' => $report->start_date,
            'endDate' => $report->end_date,
            'generatedAt' => $report->created_at->format('Y-m-d H:i:s'),
            'sensorData' => $data,
            'type' => $report->type,
        ]);
    }
}

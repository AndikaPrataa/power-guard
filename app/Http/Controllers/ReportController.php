<?php

namespace App\Http\Controllers;

use App\Models\SensorData;
use App\Models\Report;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;

class ReportController extends Controller
{
    // Show report page
    public function index()
    {
        return Inertia::render('Report', [
            'sensorData' => SensorData::all(),
        ]);
    }

    // Generate and export Excel
    public function exportExcel(Request $request)
    {
        $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);

        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');

        // Get sensor data in date range
        $sensorData = SensorData::whereBetween('measured_at', [
            $startDate . ' 00:00:00',
            $endDate . ' 23:59:59'
        ])->orderBy('measured_at', 'desc')->get();

        // Generate unique report code
        $reportCode = strtoupper(Str::random(8));

        // Store report metadata
        $report = Report::create([
            'code' => $reportCode,
            'data' => json_encode($sensorData->toArray()),
            'start_date' => $startDate,
            'end_date' => $endDate,
            'user_id' => Auth::id(),
            'type' => 'excel',
        ]);

        // Create CSV content
        $csv = "Report Code: $reportCode\n";
        $csv .= "Date Range: $startDate to $endDate\n";
        $csv .= "Generated: " . now()->format('Y-m-d H:i:s') . "\n";
        $csv .= "Scan barcode or visit: " . route('data-proven.show', $reportCode) . "\n";
        $csv .= "\n";
        $csv .= "Device ID,Voltage (V),Current (A),Frequency (Hz),Measured At\n";

        foreach ($sensorData as $data) {
            $csv .= "{$data->device_id},{$data->voltage},{$data->current},{$data->frequency},{$data->measured_at}\n";
        }

        // Save and download
        $filename = "Report_{$reportCode}_" . now()->format('Y-m-d_H-i-s') . '.csv';
        Storage::put("reports/$filename", $csv);

        return response()->download(Storage::path("reports/$filename"))->deleteFileAfterSend(true);
    }

    // Generate and export PDF
    public function exportPDF(Request $request)
    {
        $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);

        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');

        // Get sensor data in date range
        $sensorData = SensorData::whereBetween('measured_at', [
            $startDate . ' 00:00:00',
            $endDate . ' 23:59:59'
        ])->orderBy('measured_at', 'desc')->get();

        // Generate unique report code
        $reportCode = strtoupper(Str::random(8));

        // Store report metadata
        $report = Report::create([
            'code' => $reportCode,
            'data' => json_encode($sensorData->toArray()),
            'start_date' => $startDate,
            'end_date' => $endDate,
            'user_id' => Auth::id(),
            'type' => 'pdf',
        ]);

        // Precompute values to insert into HEREDOC (avoid complex interpolation)
        $generatedAt = $report->created_at ? $report->created_at->format('Y-m-d H:i:s') : now()->format('Y-m-d H:i:s');
        $totalCount = $sensorData->count();

        // Create HTML content for PDF
        $html = <<<HTML
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .header { text-align: center; margin-bottom: 30px; }
                .info { margin-bottom: 20px; font-size: 14px; }
                .barcode { text-align: center; margin: 20px 0; padding: 20px; border: 1px solid #ccc; }
                .barcode-text { font-family: monospace; font-size: 16px; letter-spacing: 2px; margin-top: 10px; }
                .link { text-align: center; margin: 10px 0; color: #0066cc; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th { background-color: #f0f0f0; padding: 10px; text-align: left; border: 1px solid #ddd; }
                td { padding: 8px; border: 1px solid #ddd; }
                tr:nth-child(even) { background-color: #f9f9f9; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>Power Guard Report</h1>
                <p>Sensor Data Report</p>
            </div>
            
            <div class="info">
                <p><strong>Report Code:</strong> {$reportCode}</p>
                <p><strong>Date Range:</strong> {$startDate} to {$endDate}</p>
                <p><strong>Generated:</strong> {$generatedAt}</p>
                <p><strong>Total Records:</strong> {$totalCount}</p>
            </div>

            <div class="barcode">
                <div style="text-align: center;">
                    <svg style="width: 200px; height: 100px;">
                        <rect x="0" y="0" width="200" height="100" fill="white" stroke="black" stroke-width="1"/>
                        <text x="100" y="50" text-anchor="middle" font-size="20" font-family="monospace" font-weight="bold">
                            {$reportCode}
                        </text>
                    </svg>
                </div>
                <p class="barcode-text">{$reportCode}</p>
            </div>

            <div class="link">
                <p>Scan barcode or visit: <strong>{$report->code}</strong></p>
                <p style="font-size: 12px; color: #666;">To view original data, scan the barcode or visit the public link</p>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Device ID</th>
                        <th>Voltage (V)</th>
                        <th>Current (A)</th>
                        <th>Frequency (Hz)</th>
                        <th>Measured At</th>
                    </tr>
                </thead>
                <tbody>
HTML;

        foreach ($sensorData as $data) {
            $html .= <<<HTML
                    <tr>
                        <td>{$data->device_id}</td>
                        <td>{$data->voltage}</td>
                        <td>{$data->current}</td>
                        <td>{$data->frequency}</td>
                        <td>{$data->measured_at}</td>
                    </tr>
HTML;
        }

        $html .= <<<HTML
                </tbody>
            </table>
        </body>
        </html>
HTML;

        // Try to generate a real PDF if DOMPDF is available, otherwise save HTML as fallback
        // Try to generate a real PDF via available options: facade, PDF alias, or Dompdf library
        try {
            // If barryvdh facade is available
            if (class_exists('Barryvdh\\DomPDF\\Facade\\Pdf')) {
                $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadHTML($html)->setPaper('a4');
                return $pdf->download("Report_{$reportCode}.pdf");
            }

            // Note: do not rely on an untyped 'PDF' alias to avoid static analysis warnings

            // As a last resort, use Dompdf directly if present
            if (class_exists('Dompdf\\Dompdf')) {
                $options = new \Dompdf\Options();
                $options->set('isRemoteEnabled', true);
                $dompdf = new \Dompdf\Dompdf($options);
                $dompdf->loadHtml($html);
                $dompdf->setPaper('A4', 'portrait');
                $dompdf->render();

                $output = $dompdf->output();
                return response($output, 200, [
                    'Content-Type' => 'application/pdf',
                    'Content-Disposition' => "attachment; filename=Report_{$reportCode}.pdf",
                ]);
            }
        } catch (\Throwable $e) {
            // If any PDF generation attempt fails, fall through to HTML fallback
        }

        // Fallback: save HTML file and return it (named .pdf for convenience)
        $filename = "Report_{$reportCode}_" . now()->format('Y-m-d_H-i-s') . '.html';
        Storage::put("reports/$filename", $html);

        // Return download with .pdf name (file content is HTML - user can open in browser)
        $downloadName = str_replace('.html', '.pdf', $filename);
        return response()->download(Storage::path("reports/$filename"), $downloadName)->deleteFileAfterSend(true);
    }
}

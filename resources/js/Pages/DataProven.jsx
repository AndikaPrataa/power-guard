import { usePage } from "@inertiajs/react";

export default function DataProven() {
    const { reportCode, startDate, endDate, generatedAt, sensorData, type } = usePage().props;

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow p-8 mb-8">
                    <div className="text-center mb-6">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">Power Guard Report - Data Proven</h1>
                        <p className="text-gray-600">Verified sensor data report</p>
                    </div>

                    {/* Report Info */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-blue-50 p-4 rounded">
                            <p className="text-sm text-gray-600">Report Code</p>
                            <p className="text-lg font-bold text-blue-600">{reportCode}</p>
                        </div>
                        <div className="bg-green-50 p-4 rounded">
                            <p className="text-sm text-gray-600">Date Range</p>
                            <p className="text-sm font-bold text-green-600">{startDate} to {endDate}</p>
                        </div>
                        <div className="bg-purple-50 p-4 rounded">
                            <p className="text-sm text-gray-600">Generated</p>
                            <p className="text-sm font-bold text-purple-600">{generatedAt}</p>
                        </div>
                        <div className="bg-orange-50 p-4 rounded">
                            <p className="text-sm text-gray-600">Total Records</p>
                            <p className="text-lg font-bold text-orange-600">{sensorData?.length || 0}</p>
                        </div>
                    </div>

                    {/* Barcode Display */}
                    <div className="border-t pt-6">
                        <p className="text-center text-sm text-gray-600 mb-4">Report Verification Code</p>
                        <div className="flex justify-center mb-4">
                            <svg style={{ width: '250px', height: '120px' }} viewBox="0 0 250 120">
                                <rect x="0" y="0" width="250" height="120" fill="white" stroke="black" strokeWidth="1"/>
                                <text x="125" y="55" textAnchor="middle" fontSize="24" fontFamily="monospace" fontWeight="bold">
                                    {reportCode}
                                </text>
                                <text x="125" y="90" textAnchor="middle" fontSize="10" fill="#666">
                                    Scan to verify
                                </text>
                            </svg>
                        </div>
                        <p className="text-center text-lg font-mono font-bold tracking-widest">{reportCode}</p>
                    </div>
                </div>

                {/* Sensor Data Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="p-6 border-b">
                        <h2 className="text-2xl font-bold text-gray-800">Sensor Data</h2>
                        <p className="text-sm text-gray-600 mt-1">All readings from {startDate} to {endDate}</p>
                    </div>

                    {sensorData && sensorData.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-100 border-b">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Device ID</th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Voltage (V)</th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Current (A)</th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Frequency (Hz)</th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Measured At</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {sensorData.map((data, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50 transition">
                                            <td className="px-6 py-4 text-sm text-gray-700">{data.device_id}</td>
                                            <td className="px-6 py-4 text-sm text-gray-700 font-mono">{parseFloat(data.voltage).toFixed(2)}</td>
                                            <td className="px-6 py-4 text-sm text-gray-700 font-mono">{parseFloat(data.current).toFixed(2)}</td>
                                            <td className="px-6 py-4 text-sm text-gray-700 font-mono">{parseFloat(data.frequency).toFixed(2)}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {new Date(data.measured_at).toLocaleString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="p-6 text-center text-gray-500">
                            No data available
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="mt-8 text-center text-xs text-gray-600">
                    <p>This document is automatically generated and verified.</p>
                    <p>For questions about this report, contact your administrator.</p>
                </div>
            </div>
        </div>
    );
}

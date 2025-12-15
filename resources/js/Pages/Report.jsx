import React, { useState } from "react";
import { usePage } from "@inertiajs/react";
import MainLayout from "../Layouts/MainLayout";
import axios from "axios";

export default function Report() {
    const { sensorData } = usePage().props;
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    const handleExportExcel = async () => {
        if (!startDate || !endDate) {
            setError("Please select both start and end dates");
            return;
        }
        setError("");
        setSuccess("");

        try {
            const response = await axios.post(
                route("report.export-excel"),
                { start_date: startDate, end_date: endDate },
                { responseType: "blob" }
            );

            // Create download link
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `Report_${new Date().getTime()}.csv`);
            document.body.appendChild(link);
            link.click();
            link.parentElement.removeChild(link);

            setSuccess("Excel file exported successfully!");
            setStartDate("");
            setEndDate("");
        } catch (err) {
            setError("Failed to export Excel file");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleExportPDF = async () => {
        if (!startDate || !endDate) {
            setError("Please select both start and end dates");
            return;
        }

        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const response = await axios.post(
                route("report.export-pdf"),
                { start_date: startDate, end_date: endDate },
                { responseType: "blob" }
            );

            // Create download link
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `Report_${new Date().getTime()}.html`);
            document.body.appendChild(link);
            link.click();
            link.parentElement.removeChild(link);

            setSuccess("PDF file exported successfully!");
            setStartDate("");
            setEndDate("");
        } catch (err) {
            setError("Failed to export PDF file");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <MainLayout title="Report">
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Export Form */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h1 className="text-2xl font-bold mb-4">Generate Report</h1>
                    
                    {success && (
                        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
                            {success}
                        </div>
                    )}

                    {error && (
                        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Start Date
                            </label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                End Date
                            </label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={handleExportExcel}
                            disabled={loading}
                            className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition"
                        >
                            {loading ? "Processing..." : "Export as Excel (CSV)"}
                        </button>

                        <button
                            onClick={handleExportPDF}
                            disabled={loading}
                            className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition"
                        >
                            {loading ? "Processing..." : "Export as PDF"}
                        </button>
                    </div>

                    <p className="text-xs text-gray-500 mt-3">
                        ✓ Both formats include a unique barcode code that allows anyone to access the verified report data without login
                    </p>
                </div>

                {/* All Sensor Data Table */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-lg font-bold mb-4">All Sensor Data</h2>
                    {sensorData && sensorData.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-2 text-left">Device</th>
                                        <th className="px-4 py-2 text-left">Voltage (V)</th>
                                        <th className="px-4 py-2 text-left">Current (A)</th>
                                        <th className="px-4 py-2 text-left">Frequency (Hz)</th>
                                        <th className="px-4 py-2 text-left">Measured At</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {sensorData.map((data) => (
                                        <tr key={data.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-2">{data.device_id}</td>
                                            <td className="px-4 py-2">{data.voltage?.toFixed(2)}</td>
                                            <td className="px-4 py-2">{data.current?.toFixed(2)}</td>
                                            <td className="px-4 py-2">{data.frequency?.toFixed(2)}</td>
                                            <td className="px-4 py-2 text-xs text-gray-600">
                                                {new Date(data.measured_at).toLocaleString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-4">No sensor data available</p>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}

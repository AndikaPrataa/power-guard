import { usePage } from "@inertiajs/react";
import { useState, useEffect } from "react";
import MainLayout from "../Layouts/MainLayout";
import {
    LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
} from "recharts";

export default function Dashboard() {
    const { totalUsers, totalDevices, latestRealtime, sensorData } = usePage().props;
    const [animatedValues, setAnimatedValues] = useState({
        voltage: 0,
        current: 0,
        frequency: 0
    });

    // Get latest sensor data or fallback to dummy
    const latestSensorData = (sensorData && sensorData.length > 0) 
        ? sensorData[0] 
        : (latestRealtime ?? {
            voltage: 220,
            current: 5,
            frequency: 50
        });

    // Animate gauge values
    useEffect(() => {
        const targetValues = {
            voltage: latestSensorData.voltage || 0,
            current: latestSensorData.current || 0,
            frequency: latestSensorData.frequency || 0
        };

        const animationDuration = 800; // ms
        const steps = 60;
        let currentStep = 0;

        const animationInterval = setInterval(() => {
            currentStep++;
            const progress = Math.min(currentStep / steps, 1);

            setAnimatedValues({
                voltage: animatedValues.voltage + (targetValues.voltage - animatedValues.voltage) * progress,
                current: animatedValues.current + (targetValues.current - animatedValues.current) * progress,
                frequency: animatedValues.frequency + (targetValues.frequency - animatedValues.frequency) * progress
            });

            if (currentStep >= steps) {
                clearInterval(animationInterval);
                setAnimatedValues(targetValues);
            }
        }, animationDuration / steps);

        return () => clearInterval(animationInterval);
    }, [latestSensorData]);

    // Build chart data from sensorData (fallback to dummy series if not provided)
    const chartData = (sensorData && sensorData.length > 0)
        ? sensorData.slice().reverse().map(s => ({
            time: new Date(s.measured_at).toLocaleString(),
            voltage: s.voltage,
            current: s.current,
            frequency: s.frequency,
        }))
        : [
            { time: "00:00", voltage: latestSensorData.voltage, current: latestSensorData.current, frequency: latestSensorData.frequency },
            { time: "01:00", voltage: latestSensorData.voltage + 1, current: latestSensorData.current + 0.2, frequency: latestSensorData.frequency },
            { time: "02:00", voltage: latestSensorData.voltage - 2, current: latestSensorData.current + 0.5, frequency: latestSensorData.frequency },
            { time: "03:00", voltage: latestSensorData.voltage + 3, current: latestSensorData.current - 0.3, frequency: latestSensorData.frequency },
            { time: "04:00", voltage: latestSensorData.voltage, current: latestSensorData.current, frequency: latestSensorData.frequency },
        ];

    const statCards = [
        { label: "Latest Voltage", value: latestSensorData.voltage?.toFixed(2), unit: "V" },
        { label: "Latest Current", value: latestSensorData.current?.toFixed(2), unit: "A" },
        { label: "Latest Frequency", value: latestSensorData.frequency?.toFixed(2), unit: "Hz" },
    ];

    const charts = [
        { key: "voltage", label: "Voltage", stroke: "#3b82f6", unit: "V", min: 100, max: 500, showGauge: true },
        { key: "current", label: "Current", stroke: "#f97316", unit: "A", min: 0, max: 100, showGauge: true },
        { key: "frequency", label: "Frequency", stroke: "#16a34a", unit: "Hz", showGauge: false },
    ];

    // Circular Gauge component
    const CircularGauge = ({ value, min, max, stroke, unit }) => {
        const percentage = ((value - min) / (max - min)) * 100;
        const clampedPercentage = Math.max(0, Math.min(100, percentage));
        const circumference = 2 * Math.PI * 45; // radius = 45
        const strokeDashoffset = circumference - (clampedPercentage / 100) * circumference;
        
        return (
            <div className="mt-3 flex flex-col items-center">
                <div className="relative w-32 h-32">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        {/* Background circle */}
                        <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="4" />
                        {/* Progress circle */}
                        <circle 
                            cx="50" cy="50" r="45" 
                            fill="none" 
                            stroke={stroke} 
                            strokeWidth="4"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                            className="transition-all duration-700"
                        />
                    </svg>
                    {/* Center text */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="text-2xl font-bold" style={{ color: stroke }}>
                            {value.toFixed(0)}
                        </div>
                        <div className="text-xs text-gray-600">{unit}</div>
                    </div>
                </div>
                <div className="text-xs text-gray-600 mt-2">
                    {min} - {max} {unit}
                </div>
            </div>
        );
    };

    // Frequency card component (number only)
    const NumberCard = ({ value, label, unit, stroke }) => {
        return (
            <div className="mt-3 bg-white p-4 rounded-lg border-2 flex flex-col items-center"
                 style={{ borderColor: stroke }}>
                <div className="text-sm text-gray-600 mb-2">{label}</div>
                <div className="text-3xl font-bold" style={{ color: stroke }}>
                    {value.toFixed(2)}
                </div>
                <div className="text-xs text-gray-600">{unit}</div>
            </div>
        );
    };

    return (
        <MainLayout title="Dashboard">
            <div className="space-y-6">
                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {charts.map((chart, i) => (
                        <div key={i} className="bg-white p-4 rounded-lg shadow">
                            <h2 className="text-base font-semibold mb-3">{chart.label} Chart</h2>
                            <div className="w-full h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="time" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line type="monotone" dataKey={chart.key} stroke={chart.stroke} strokeWidth={3} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Gauge - Circular for Voltage and Current, Number card for Frequency */}
                        {chart.showGauge ? (
                            <CircularGauge 
                                value={animatedValues[chart.key]} 
                                min={chart.min}
                                max={chart.max}
                                stroke={chart.stroke}
                                unit={chart.unit}
                            />
                        ) : (
                            <NumberCard
                                value={animatedValues[chart.key]}
                                label={chart.label}
                                unit={chart.unit}
                                stroke={chart.stroke}
                            />
                        )}
                    </div>
                ))}
                </div>

                {/* Recent sensor data table */}
                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-base font-semibold mb-3">Recent Sensor Data</h2>
                    {sensorData && sensorData.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-xs">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-3 py-2 text-left">Device</th>
                                        <th className="px-3 py-2 text-left">Voltage</th>
                                        <th className="px-3 py-2 text-left">Current</th>
                                        <th className="px-3 py-2 text-left">Frequency</th>
                                        <th className="px-3 py-2 text-left">Measured At</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {sensorData.map(s => (
                                        <tr key={s.id} className="hover:bg-gray-50">
                                            <td className="px-3 py-2">{s.device_id}</td>
                                            <td className="px-3 py-2">{s.voltage?.toFixed(2)}</td>
                                            <td className="px-3 py-2">{s.current?.toFixed(2)}</td>
                                            <td className="px-3 py-2">{s.frequency?.toFixed(2)}</td>
                                            <td className="px-3 py-2">{new Date(s.measured_at).toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-gray-500">No sensor data available.</p>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}

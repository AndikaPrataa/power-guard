import MainLayout from "../Layouts/MainLayout";
import { usePage } from "@inertiajs/react";

function renderNotificationItem(n) {
    const value = n.event_type && (n.event_type.includes('volt') || n.event_type === 'undervoltage' || n.event_type === 'overvoltage')
        ? (n.sensor_voltage ?? n.value ?? '')
        : n.event_type && n.event_type.includes('current')
            ? (n.sensor_current ?? n.value ?? '')
            : n.event_type && n.event_type.includes('frequency')
                ? (n.sensor_frequency ?? n.value ?? '')
                : (n.value ?? '');

    return (
        <li key={n.id} className="p-4 border rounded-xl shadow">
            <div className="flex items-center justify-between">
                <div>
                    <p className="font-semibold">{n.title}</p>
                    <p className="text-sm text-gray-600">Device: {n.device_id ?? 'N/A'}</p>
                    <p className="text-sm text-gray-600">Value: {value}</p>
                </div>
                <div className="text-xs text-gray-400">{new Date(n.created_at).toLocaleString()}</div>
            </div>
        </li>
    );
}

export default function Notification() {
    const { latest, history } = usePage().props;

    return (
        <MainLayout title="Notification">
            <section className="mb-6">
                <h2 className="text-lg font-semibold mb-3">Latest</h2>
                <ul className="space-y-4">
                    {latest && latest.length > 0 ? (
                        latest.map(n => renderNotificationItem(n))
                    ) : (
                        <li className="p-4 border rounded-xl shadow text-gray-500">No latest notifications</li>
                    )}
                </ul>
            </section>

            <section>
                <h2 className="text-lg font-semibold mb-3">History</h2>
                <ul className="space-y-4">
                    {history && history.length > 0 ? (
                        history.map(n => renderNotificationItem(n))
                    ) : (
                        <li className="p-4 border rounded-xl shadow text-gray-500">No history</li>
                    )}
                </ul>
            </section>
        </MainLayout>
    );
}

import React, { useState } from "react";
import MainLayout from "../Layouts/MainLayout";
import { router, usePage } from "@inertiajs/react";

export default function Threshold() {
    const { thresholds } = usePage().props;

    const [editing, setEditing] = useState(null);
    const presetOptions = [
        'Low Voltage Alert',
        'High Voltage Alert',
        'Low Current Alert',
        'High Current Alert',
        'Low Frequency Alert',
        'High Frequency Alert'
    ];

    const [form, setForm] = useState({ 
        name: "", 
        voltage_min: "", 
        voltage_max: "",
        current_min: "",
        current_max: "",
        frequency_min: "",
        frequency_max: "",
        active: true
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const isPresetSelected = form.name !== '' || editing;

    const submit = (e) => {
        e.preventDefault();
        if (editing) {
            router.put(`/api/threshold/${editing}`, form, {
                onSuccess: () => {
                    resetForm();
                    window.location.reload();
                }
            });
        } else {
            router.post(`/api/threshold`, form, {
                onSuccess: () => {
                    resetForm();
                    window.location.reload();
                }
            });
        }
    };

    const resetForm = () => {
        setEditing(null);
        setForm({ 
            name: "", 
            voltage_min: "", 
            voltage_max: "",
            current_min: "",
            current_max: "",
            frequency_min: "",
            frequency_max: "",
            active: true
        });
    };

    const editThreshold = (t) => {
        setEditing(t.id);
        setForm({
            name: t.name,
            voltage_min: t.voltage_min,
            voltage_max: t.voltage_max,
            current_min: t.current_min || '',
            current_max: t.current_max,
            frequency_min: t.frequency_min,
            frequency_max: t.frequency_max,
            active: t.active
        });
    };

    const deleteThreshold = (t) => {
        if (confirm(`Are you sure you want to delete ${t.name}?`)) {
            router.delete(`/api/threshold/${t.id}`);
        }
    };

    return (
        <MainLayout title="Threshold Management">
            <div className="space-y-4">
                
                {/* Form */}
                <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-gray-800">
                            {editing ? "Edit Threshold Rule" : "Create New Threshold Rule"}
                        </h3>
                        {editing && (
                            <button 
                                type="button" 
                                onClick={resetForm} 
                                className="text-sm text-gray-500 hover:text-gray-700"
                            >
                                ✕ Clear
                            </button>
                        )}
                    </div>
                    
                    <form onSubmit={submit} className="space-y-4">
                        {/* Row 1: Name */}
                        <div>
                            <label className="block text-gray-700 text-sm font-semibold mb-2">Threshold Type *</label>
                            <select
                                name="name"
                                className="w-full border border-gray-300 p-3 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                value={presetOptions.includes(form.name) ? form.name : (editing && form.name ? form.name : '')}
                                onChange={(e) => setForm(prev => ({...prev, name: e.target.value}))}
                                required
                                disabled={editing}
                            >
                                <option value="">-- Select Threshold Type --</option>
                                {presetOptions.map(opt => (
                                    <option key={opt} value={opt}>{opt}</option>
                                ))}
                            </select>
                            {/* If editing and name isn't a preset, show it as custom */}
                            {editing && form.name && !presetOptions.includes(form.name) && (
                                <div className="mt-2">
                                    <label className="block text-gray-700 text-sm font-semibold mb-2">Custom Name</label>
                                    <input type="text" name="name" value={form.name} onChange={handleChange} className="w-full border border-gray-300 p-3 rounded-lg text-sm"/>
                                </div>
                            )}
                        </div>

                        {/* If no preset selected and not editing, show hint */}
                        {!isPresetSelected && (
                            <div className="p-3 bg-yellow-50 border border-yellow-100 text-yellow-800 rounded">
                                Please select a Threshold Type to enable create/update.
                            </div>
                        )}

                        {isPresetSelected && (
                            <div className="grid grid-cols-3 gap-4">
                                {form.name === 'Low Voltage Alert' && (
                                    <div>
                                        <label className="block text-gray-700 text-sm font-semibold mb-2">Voltage Min (V)</label>
                                        <input
                                            type="number"
                                            name="voltage_min"
                                            step="0.01"
                                            className="w-full border border-gray-300 p-3 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                            placeholder="200"
                                            value={form.voltage_min}
                                            onChange={handleChange}
                                        />
                                    </div>
                                )}

                                {form.name === 'High Voltage Alert' && (
                                    <div>
                                        <label className="block text-gray-700 text-sm font-semibold mb-2">Voltage Max (V)</label>
                                        <input
                                            type="number"
                                            name="voltage_max"
                                            step="0.01"
                                            className="w-full border border-gray-300 p-3 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                            placeholder="240"
                                            value={form.voltage_max}
                                            onChange={handleChange}
                                        />
                                    </div>
                                )}

                                {form.name === 'Low Current Alert' && (
                                    <div>
                                        <label className="block text-gray-700 text-sm font-semibold mb-2">Current Min (A)</label>
                                        <input
                                            type="number"
                                            name="current_min"
                                            step="0.01"
                                            className="w-full border border-gray-300 p-3 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                            placeholder="0"
                                            value={form.current_min}
                                            onChange={handleChange}
                                        />
                                    </div>
                                )}

                                {form.name === 'High Current Alert' && (
                                    <div>
                                        <label className="block text-gray-700 text-sm font-semibold mb-2">Current Max (A)</label>
                                        <input
                                            type="number"
                                            name="current_max"
                                            step="0.01"
                                            className="w-full border border-gray-300 p-3 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                            placeholder="100"
                                            value={form.current_max}
                                            onChange={handleChange}
                                        />
                                    </div>
                                )}

                                {form.name === 'Low Frequency Alert' && (
                                    <div>
                                        <label className="block text-gray-700 text-sm font-semibold mb-2">Frequency Min (Hz)</label>
                                        <input
                                            type="number"
                                            name="frequency_min"
                                            step="0.01"
                                            className="w-full border border-gray-300 p-3 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                            placeholder="45"
                                            value={form.frequency_min}
                                            onChange={handleChange}
                                        />
                                    </div>
                                )}

                                {form.name === 'High Frequency Alert' && (
                                    <div>
                                        <label className="block text-gray-700 text-sm font-semibold mb-2">Frequency Max (Hz)</label>
                                        <input
                                            type="number"
                                            name="frequency_max"
                                            step="0.01"
                                            className="w-full border border-gray-300 p-3 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                            placeholder="55"
                                            value={form.frequency_max}
                                            onChange={handleChange}
                                        />
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Row 4: Active Status & Buttons */}
                        <div className="flex items-end justify-between pt-2">
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    name="active"
                                    id="active"
                                    checked={form.active}
                                    onChange={handleChange}
                                    className="w-4 h-4 rounded"
                                />
                                <label htmlFor="active" className="text-gray-700 text-sm font-medium">Active</label>
                            </div>
                            
                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    disabled={!isPresetSelected}
                                    className={`bg-blue-600 text-white px-6 py-2 rounded-lg transition font-medium text-sm ${!isPresetSelected ? 'opacity-50 cursor-not-allowed hover:bg-blue-600' : 'hover:bg-blue-700'}`}
                                >
                                    {editing ? "Update Threshold" : "Create Threshold"}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Table */}
                <div className="bg-white p-4 rounded-lg shadow overflow-x-auto">
                    <h2 className="text-lg font-bold mb-3 text-gray-700">Threshold List</h2>
                    <table className="min-w-full border border-gray-200 divide-y divide-gray-200 text-xs">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-3 py-2 text-left text-gray-600 font-medium">Name</th>
                                <th className="px-3 py-2 text-left text-gray-600 font-medium">Voltage Min</th>
                                <th className="px-3 py-2 text-left text-gray-600 font-medium">Voltage Max</th>
                                <th className="px-3 py-2 text-left text-gray-600 font-medium">Current Min</th>
                                <th className="px-3 py-2 text-left text-gray-600 font-medium">Current Max</th>
                                <th className="px-3 py-2 text-left text-gray-600 font-medium">Frequency Min</th>
                                <th className="px-3 py-2 text-left text-gray-600 font-medium">Frequency Max</th>
                                <th className="px-3 py-2 text-left text-gray-600 font-medium">Active</th>
                                <th className="px-3 py-2 text-left text-gray-600 font-medium">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {thresholds?.length > 0 ? thresholds.map(t => (
                                <tr key={t.id} className="hover:bg-gray-50">
                                    <td className="px-3 py-2">{t.name}</td>
                                    <td className="px-3 py-2">{t.voltage_min}</td>
                                    <td className="px-3 py-2">{t.voltage_max}</td>
                                    <td className="px-3 py-2">{t.current_min}</td>
                                    <td className="px-3 py-2">{t.current_max}</td>
                                    <td className="px-3 py-2">{t.frequency_min}</td>
                                    <td className="px-3 py-2">{t.frequency_max}</td>
                                    <td className="px-3 py-2">{t.active ? "Yes" : "No"}</td>
                                    <td className="px-3 py-2 flex gap-1">
                                        <button
                                            onClick={() => editThreshold(t)}
                                            className="bg-yellow-400 px-2 py-1 rounded text-white hover:bg-yellow-500 transition text-xs"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => deleteThreshold(t)}
                                            className="bg-red-500 px-2 py-1 rounded text-white hover:bg-red-600 transition text-xs"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={8} className="text-center px-3 py-2 text-gray-500">
                                        No thresholds found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </MainLayout>
    );
}

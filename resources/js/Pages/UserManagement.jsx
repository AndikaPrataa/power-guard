import React, { useState } from "react";
import MainLayout from "../Layouts/MainLayout";
import { router } from "@inertiajs/react";

export default function UserManagement({ users }) {
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ name: "", email: "", password: "", role: "user", status: true });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const submit = (e) => {
        e.preventDefault();
        if (editing) {
            router.put(`/users/${editing}`, form, {
                onSuccess: () => {
                    resetForm();
                    window.location.reload();
                }
            });
        } else {
            router.post("/users", form, {
                onSuccess: () => resetForm()
            });
        }
    };

    const resetForm = () => {
        setEditing(null);
        setForm({ name: "", email: "", password: "", role: "user", status: true });
    };

    const editUser = (u) => {
        setEditing(u.id);
        setForm({ 
            name: u.name, 
            email: u.email, 
            password: "", 
            role: u.role,
            status: u.status
        });
    };

    const toggleStatus = (u) => {
        router.put(`/users/${u.id}`, {
            name: u.name,
            email: u.email,
            role: u.role,
            status: !u.status
        }, {
            onSuccess: () => window.location.reload()
        });
    };

    const deleteUser = (id) => {
        if (confirm("Are you sure?")) router.delete(`/users/${id}`);
    };

    return (
        <MainLayout title="User Management">
            <div className="space-y-6">
                {/* Form */}
                <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-gray-800">
                            {editing ? "Edit User" : "Create New User"}
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
                        {/* Row 1: Name & Email */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-700 text-sm font-semibold mb-2">Full Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    className="w-full border border-gray-300 p-3 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                    placeholder="John Doe"
                                    value={form.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-semibold mb-2">Email *</label>
                                <input
                                    type="email"
                                    name="email"
                                    className="w-full border border-gray-300 p-3 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                    placeholder="john@example.com"
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                    disabled={editing}
                                />
                            </div>
                        </div>

                        {/* Row 2: Password & Role */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-700 text-sm font-semibold mb-2">
                                    {editing ? "Password (Leave empty to keep current)" : "Password *"}
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    className="w-full border border-gray-300 p-3 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                    placeholder="••••••••"
                                    value={form.password}
                                    onChange={handleChange}
                                    required={!editing}
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-semibold mb-2">Role *</label>
                                <select
                                    name="role"
                                    className="w-full border border-gray-300 p-3 rounded-lg text-sm focus:outline-none focus:border-blue-500 bg-white"
                                    value={form.role}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                        </div>

                        {/* Row 3: Status Checkbox */}
                        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50">
                            <input
                                type="checkbox"
                                name="status"
                                id="status"
                                checked={form.status}
                                onChange={(e) => setForm(prev => ({ ...prev, status: e.target.checked }))}
                                className="w-4 h-4 rounded"
                            />
                            <label htmlFor="status" className="text-gray-700 text-sm font-medium cursor-pointer">
                                User is Active
                            </label>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end pt-2">
                            <button 
                                type="submit" 
                                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-medium text-sm"
                            >
                                {editing ? "Update User" : "Create User"}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Table */}
                <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
                    <h2 className="text-lg font-bold mb-4 text-gray-800">User List</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-4 py-3 text-left text-gray-700 font-semibold">Name</th>
                                    <th className="px-4 py-3 text-left text-gray-700 font-semibold">Email</th>
                                    <th className="px-4 py-3 text-left text-gray-700 font-semibold">Role</th>
                                    <th className="px-4 py-3 text-left text-gray-700 font-semibold">Status</th>
                                    <th className="px-4 py-3 text-left text-gray-700 font-semibold">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {users?.length > 0 ? users.map(u => (
                                    <tr key={u.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 font-medium">{u.name}</td>
                                        <td className="px-4 py-3">{u.email}</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                u.role === 'admin' 
                                                    ? 'bg-purple-100 text-purple-800' 
                                                    : 'bg-blue-100 text-blue-800'
                                            }`}>
                                                {u.role === 'admin' ? 'Admin' : 'User'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <button 
                                                onClick={() => toggleStatus(u)}
                                                className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition ${
                                                    u.status 
                                                        ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                                                        : 'bg-red-100 text-red-800 hover:bg-red-200'
                                                }`}
                                            >
                                                {u.status ? 'Active' : 'Inactive'}
                                            </button>
                                        </td>
                                        <td className="px-4 py-3 flex gap-2">
                                            <button 
                                                onClick={() => editUser(u)} 
                                                className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-xs font-medium transition"
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                onClick={() => deleteUser(u.id)} 
                                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs font-medium transition"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={5} className="text-center p-4 text-gray-500">No users found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}

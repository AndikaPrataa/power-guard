import React, { useState } from "react";
import { router, usePage } from "@inertiajs/react";

export default function Login() {
    const [form, setForm] = useState({ email:"", password:"" });
    const { props } = usePage();
    const errors = props.errors || {};

    const submit = e=>{
        e.preventDefault();
        router.post("/login", form);
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
                <form className="space-y-4" onSubmit={submit}>
                    {errors.email && (
                        <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded">
                            {errors.email}
                        </div>
                    )}
                    {errors.password && (
                        <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded">
                            {errors.password}
                        </div>
                    )}
                    <input type="email" placeholder="Email" className="w-full p-2 border rounded" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required/>
                    <input type="password" placeholder="Password" className="w-full p-2 border rounded" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required/>
                    <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Login</button>
                </form>
            </div>
        </div>
    );
}

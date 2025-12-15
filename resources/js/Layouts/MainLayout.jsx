import React, { useState } from "react";
import { Head, Link, usePage, router } from "@inertiajs/react";

export default function MainLayout({ title, children }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const page = usePage();
    const { url } = page;
    const { auth } = page.props;

    // Debug: log ALL props
    console.log("All usePage props:", page.props);
    console.log("Auth data:", auth);
    console.log("User role:", auth?.user?.role);

    // Menu items dengan role requirement
    const allMenuItems = [
        { name: "Dashboard", href: "/dashboard", role: null }, // accessible to all
        { name: "Users", href: "/user-management", role: "admin" },
        { name: "Threshold", href: "/threshold", role: "admin" },
        // { name: "Report", href: "/report", role: null }, // accessible to all
        { name: "Notification", href: "/notification", role: null }, // accessible to all
        // { name: "Data Proven", href: "/data-proven", role: "admin" },
    ];

    // Filter menu items berdasarkan role user
    const menuItems = allMenuItems.filter(item => 
        item.role === null || (auth?.user?.role === item.role)
    );

    console.log("Filtered menu items:", menuItems);

    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            <Head title={title} />

            {/* Top Bar */}
            <header className="bg-white shadow-md sticky top-0 z-50">
                <div className="flex items-center justify-between px-4 md:px-6 py-4">
                    {/* Logo */}
                    <div className="font-bold text-xl text-blue-600">PowerGuard</div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-1">
                        {menuItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`px-4 py-2 rounded text-sm font-medium transition ${
                                    url === item.href
                                        ? "bg-blue-100 text-blue-600"
                                        : "text-gray-700 hover:bg-gray-100"
                                }`}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </nav>

                    {/* User Profile & Actions */}
                    <div className="flex items-center gap-4">
                        {auth?.user && (
                            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-lg bg-gray-50">
                                <div>
                                    <p className="text-sm font-semibold">{auth.user.name}</p>
                                    <p className="text-xs text-gray-500 capitalize">{auth.user.role}</p>
                                </div>
                            </div>
                        )}
                        
                        {/* Logout Button */}
                        <button
                            onClick={() => router.post('/logout')}
                            title="Logout"
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                        </button>

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {mobileMenuOpen && (
                    <nav className="md:hidden border-t bg-white px-4 py-3 space-y-2">
                        {menuItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`block px-4 py-2 rounded text-sm font-medium ${
                                    url === item.href
                                        ? "bg-blue-100 text-blue-600"
                                        : "text-gray-700 hover:bg-gray-50"
                                }`}
                            >
                                {item.name}
                            </Link>
                        ))}
                        {auth?.user && (
                            <div className="px-4 py-2 border-t text-sm">
                                <p className="font-semibold">{auth.user.name}</p>
                                <p className="text-xs text-gray-500 capitalize">{auth.user.role}</p>
                            </div>
                        )}
                    </nav>
                )}
            </header>

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-6">
                {children}
            </main>
        </div>
    );
}

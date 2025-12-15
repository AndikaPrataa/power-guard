import { Link } from "@inertiajs/react";

export default function Navbar() {
    return (
        <nav className="bg-blue-900 text-white px-10 py-4 flex items-center justify-between shadow">
            <h1 className="text-xl font-semibold">PowerGuard</h1>

            <div className="flex gap-6">
                <Link href="/dashboard" className="hover:text-gray-300">Dashboard</Link>
                <Link href="/user-management" className="hover:text-gray-300">User</Link>
                <Link href="/threshold" className="hover:text-gray-300">Threshold</Link>
                <Link href="/report" className="hover:text-gray-300">Report</Link>
                <Link href="/notification" className="hover:text-gray-300">Notification</Link>
                <Link href="/data-proven" className="hover:text-gray-300">Data Proven</Link>
            </div>

            <form method="POST" action="/logout">
                <button className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-xl text-sm">
                    Logout
                </button>
            </form>
        </nav>
    );
}

<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    // -----------------------------
    // LOGIN
    // -----------------------------
    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string|min:6',
        ]);

        // Ambil user berdasarkan email
        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return back()->withErrors([
                'email' => 'Email tidak terdaftar.'
            ]);
        }

        // Cek password dengan hash (pastikan password di DB sudah di-hash)
        if (!Hash::check($request->password, $user->password)) {
            return back()->withErrors([
                'password' => 'Password salah.'
            ]);
        }

        // Pastikan akun user aktif. Kolom di model adalah `status` (boolean).
        if (!$user->status) {
            return back()->withErrors([
                'email' => 'Akun Anda tidak aktif. Hubungi admin.'
            ]);
        }

        // Login user
        Auth::login($user);

        // Regenerate session untuk keamanan
        $request->session()->regenerate();

        return redirect()->route('dashboard');
    }

    // -----------------------------
    // LOGOUT
    // -----------------------------
    public function logout(Request $request)
    {
        Auth::logout();

        // Hapus semua session lama
        $request->session()->invalidate();

        // Buat CSRF token baru
        $request->session()->regenerateToken();

        return redirect()->route('login'); // arahkan ke halaman login
    }
}

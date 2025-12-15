<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ThresholdController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\DataProvenController;

// ----------------------------
// Halaman Login
// ----------------------------
Route::get('/', fn() => inertia('Login'))->name('login');
Route::post('/login', [AuthController::class, 'login'])->name('auth.login');

// ----------------------------
// ROUTE YANG BUTUH LOGIN
// ----------------------------
Route::middleware('auth')->group(function () {

    // ----------------------------
    // Dashboard Page (available untuk semua user)
    // ----------------------------
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // ----------------------------
    // Report & Notification (available untuk semua user)
    // ----------------------------
    Route::get('/report', [ReportController::class, 'index'])->name('report');
    Route::post('/report/export-excel', [ReportController::class, 'exportExcel'])->name('report.export-excel');
    Route::post('/report/export-pdf', [ReportController::class, 'exportPDF'])->name('report.export-pdf');
    Route::get('/notification', [\App\Http\Controllers\NotificationController::class, 'index'])->name('notification');

    // ----------------------------
    // ADMIN ONLY ROUTES
    // ----------------------------
    Route::middleware(['role:admin'])->group(function () {

        // USER MANAGEMENT
        Route::get('/user-management', [UserController::class, 'index'])->name('user-management');
        Route::get('/users', [UserController::class, 'index'])->name('users.index');
        Route::post('/users', [UserController::class, 'store'])->name('users.store');
        Route::put('/users/{user}', [UserController::class, 'update'])->name('users.update');
        Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('users.destroy');

        // Threshold (CRUD)
        Route::get('/threshold', [ThresholdController::class, 'index'])->name('threshold');
        Route::prefix('api')->group(function () {
            Route::post('/threshold', [ThresholdController::class, 'store'])->name('threshold.store');
            Route::put('/threshold/{threshold}', [ThresholdController::class, 'update'])->name('threshold.update');
            Route::delete('/threshold/{threshold}', [ThresholdController::class, 'destroy'])->name('threshold.destroy');
        });

        // Data Proven
        Route::get('/data-proven', fn() => inertia('DataProven'))->name('data-proven');
    });

    // Logout
    Route::post('/logout', [AuthController::class, 'logout'])->name('auth.logout');
});

// ----------------------------
// PUBLIC ROUTES (No Authentication)
// ----------------------------
// Route::get('/data-proven/{code}', [DataProvenController::class, 'show'])->name('data-proven.show');
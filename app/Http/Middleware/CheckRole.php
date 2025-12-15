<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  string  ...$roles
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        // Check if user is authenticated
        if (!Auth::check()) {
            return redirect('/');
        }

        // Check if user role is in allowed roles
        if (in_array(Auth::user()->role, $roles)) {
            return $next($request);
        }

        // Deny access - redirect to dashboard
        return redirect('/dashboard')->with('error', 'Unauthorized access');
    }
}

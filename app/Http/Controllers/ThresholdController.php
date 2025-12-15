<?php

namespace App\Http\Controllers;

use App\Models\Threshold;
use Illuminate\Http\Request;

class ThresholdController extends Controller
{
    public function index()
    {
        $thresholds = Threshold::all();
        
        return inertia('Threshold', [
            'thresholds' => $thresholds
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'voltage_min' => 'nullable|numeric',
            'voltage_max' => 'nullable|numeric',
            'current_min' => 'nullable|numeric',
            'current_max' => 'nullable|numeric',
            'frequency_min' => 'nullable|numeric',
            'frequency_max' => 'nullable|numeric',
            'active' => 'boolean',
        ]);

        Threshold::create($validated);

        return back()->with('success', 'Threshold created');
    }

    public function update(Request $request, Threshold $threshold)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'voltage_min' => 'nullable|numeric',
            'voltage_max' => 'nullable|numeric',
            'current_min' => 'nullable|numeric',
            'current_max' => 'nullable|numeric',
            'frequency_min' => 'nullable|numeric',
            'frequency_max' => 'nullable|numeric',
            'active' => 'boolean',
        ]);

        $threshold->update($validated);

        return back()->with('success', 'Threshold updated');
    }

    public function destroy(Threshold $threshold)
    {
        $threshold->delete();

        return redirect()->route('threshold')->with('success', 'Threshold deleted successfully');
    }
}

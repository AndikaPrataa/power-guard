<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('reports', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique(); // Report unique code (barcode)
            $table->longText('data'); // JSON data of sensor readings
            $table->date('start_date'); // Report period start
            $table->date('end_date'); // Report period end
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade'); // User who generated report
            $table->enum('type', ['excel', 'pdf'])->default('excel'); // Report type
            $table->timestamps();
            
            $table->index('code'); // Index for fast lookups
            $table->index('created_at'); // Index for recent reports
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reports');
    }
};

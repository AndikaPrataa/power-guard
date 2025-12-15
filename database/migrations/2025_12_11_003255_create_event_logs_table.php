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
    Schema::create('event_log', function (Blueprint $table) {
        $table->bigIncrements('id');
        $table->unsignedBigInteger('sensor_data_id')->nullable()->index();
        $table->enum('event_type', ['undervoltage','overvoltage','overcurrent','frequency_anomaly','custom'])->default('custom');
        $table->double('value')->nullable();
        $table->enum('level', ['warning','critical'])->default('warning');
        $table->unsignedBigInteger('threshold_id')->nullable()->index();
        $table->timestamp('detected_at')->nullable()->index();
        $table->boolean('notified')->default(false);
        $table->enum('status', ['unread','acknowledged'])->default('unread');
        $table->timestamps();

        $table->foreign('sensor_data_id')->references('id')->on('sensor_data')->onDelete('set null');
        $table->foreign('threshold_id')->references('id')->on('threshold_rules')->onDelete('set null');
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('event_logs');
    }
};

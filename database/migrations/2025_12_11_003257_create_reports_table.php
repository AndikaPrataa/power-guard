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
        $table->bigIncrements('id');
        $table->string('report_id')->unique();
        $table->string('title')->nullable();
        $table->timestamp('period_start')->nullable();
        $table->timestamp('period_end')->nullable();
        $table->unsignedBigInteger('generated_by')->nullable();
        $table->string('file_path_pdf')->nullable();
        $table->string('file_path_excel')->nullable();
        $table->text('notes')->nullable();
        $table->timestamps();

        $table->foreign('generated_by')->references('id')->on('users')->onDelete('set null');
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

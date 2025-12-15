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
        Schema::table('threshold_rules', function (Blueprint $table) {
            $table->double('current_min')->nullable()->after('current_max');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('threshold_rules', function (Blueprint $table) {
            $table->dropColumn('current_min');
        });
    }
};

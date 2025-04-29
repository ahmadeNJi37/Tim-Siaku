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
        Schema::create('study_result_grades', function (Blueprint $table) {
            $table->id();
            $table->foreignId(column: 'study_result_id')->constrained()->cascadeOnDelete();
            $table->foreignId(column: 'course_id')->constrained()->cascadeOnDelete();
            $table->char(column: 'letter', length: 2);
            $table->double('weihgt_of_value',5,2)->default(value: 0);
            $table->double('grade',5,2);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('study_result_grades');
    }
};

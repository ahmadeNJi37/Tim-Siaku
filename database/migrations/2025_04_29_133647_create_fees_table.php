<?php

use App\Enums\FeeStatus;
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
        Schema::create('fees', function (Blueprint $table) {
            $table->id();
            $table->string('fee_code');
            $table->foreignId(column: 'student_id')->constrained()->cascadeOnDelete();
            $table->foreignId(column: 'fee_group_id')->constrained()->cascadeOnDelete();
            $table->foreignId(column: 'academic_year_id')->constrained()->cascadeOnDelete();
            $table->unsignedInteger(column: 'semester');
            $table->string('status')->default(value: FeeStatus::PENDNG->value);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('fees');
    }
};

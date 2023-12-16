<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // ตารางประเภทห้อง
        Schema::create('tbPrename', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('gendar');
            $table->string('abname')->nullable();
            $table->string('order'); // man, woman

            // $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('tbPrename');
    }
};

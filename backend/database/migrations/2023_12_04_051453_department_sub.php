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
        Schema::create('tbDepartmentSub', function (Blueprint $table) {
            $table->id();
            $table->integer('department_main_id'); // แผนกหลัก
            $table->integer('department_sub_id'); // แผนกย่อย

            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        // Schema::dropIfExists('tbDepartmentSub');
    }
};

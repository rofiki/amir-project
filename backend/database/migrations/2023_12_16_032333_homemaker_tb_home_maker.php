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
        Schema::create('homemaker_tbHomemaker', function (Blueprint $table) {
            $table->id();
            $table->integer('user_id');
            // $table->string('homemaker_code')->unique(); // รหัสพนักงาน (เผื่อต้องใช้)
            $table->integer('prename_id'); // คำนำหน้าชื่อ
            $table->string('firstname')->nullable();
            $table->string('lastname')->nullable();
            $table->string('nickname')->nullable();
            $table->string('gendar'); // man, woman
            $table->string('address')->nullable();
            $table->string('idcard')->unique();
            $table->string('lineId')->nullable();
            $table->string('phoneNumber')->nullable();
            $table->string('email')->nullable();

            $table->timestamp('date_of_sign')->nullable();; // วันที่บรรจุ
            $table->timestamp('date_of_resign')->nullable();; // วันที่ลาออก
            $table->string('active')->default('active'); // active, deactive

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
        Schema::dropIfExists('homemaker_tbHomemaker');
    }
};

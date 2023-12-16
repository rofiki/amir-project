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
        Schema::create('tbEmployee', function (Blueprint $table) {
            $table->id();
            $table->integer('users_login_id');
            $table->string('employee_code')->unique(); // รหัสพนักงาน
            $table->integer('prename_id'); // คำนำหน้าชื่อ
            $table->string('firstname')->nullable();
            $table->string('lastname')->nullable();
            $table->string('nickname')->nullable();
            $table->string('gendar'); // man, woman
            $table->date('date_of_birth')->nullable();
            $table->string('idcard')->unique();
            $table->date('date_of_sign'); // วันที่บรรจุ
            $table->date('date_of_resign'); // วันที่ลาออก
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
        //
    }
};

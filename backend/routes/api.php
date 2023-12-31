<?php

use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\AuthAdminController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CompanyController;
use App\Http\Controllers\Api\DepartmentController;
use App\Http\Controllers\Api\HomeMaker\ChecklistController;
use App\Http\Controllers\Api\HomeMaker\ChecklistSubController;
use App\Http\Controllers\Api\JobPositionController;
use App\Http\Controllers\Api\ProvinceController;
use App\Http\Controllers\Api\HomeMaker\HomemakerController;
use App\Http\Controllers\Api\HomeMaker\RoomAddChecklistController;
use App\Http\Controllers\Api\HomeMaker\RoomAddHomemakerController;
use App\Http\Controllers\Api\HomeMaker\RoomAddPersonnelController;
use App\Http\Controllers\Api\HomeMaker\RoomController;
use App\Http\Controllers\Api\HomeMaker\RoomTypeController;
use App\Http\Controllers\Api\PersonnelController;
use App\Http\Controllers\PrenameController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });

##### ระบบสิทธิ์ผู้ใช้งานระบบ #####
Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('personnel', PersonnelController::class); // บุคลากร หรือ ผู้ดูแลแม่บ้าน

    // auth
    Route::prefix('auth')->group(function () {
        Route::delete('logout', [AuthController::class, 'logoff']);
        Route::put('/reset/password/{id}', [AuthController::class, 'updatePassword']);
    });

    // tbAdmin
    Route::prefix('admin')->group(function () {
        Route::get('/', [AdminController::class, 'index']);
        Route::get('/{id}', [AdminController::class, 'show']);
        Route::put('/', [AdminController::class, 'update']);
        Route::delete('/{id}', [AdminController::class, 'destroy']);
        Route::post('/register', [AdminController::class, 'store']);
    });

    // tbCompanies บริษัท/องค์กร
    Route::apiResource('company', CompanyController::class);

    // tbDepartment แผนก
    Route::apiResource('department', DepartmentController::class);
    Route::get('/departmenttree', [DepartmentController::class, 'showDepartmentTree']);

    // tbJobPosition ตำแหน่งงาน
    Route::apiResource('jobposition', JobPositionController::class);

    // Route::apiResource('admin', EmployeeController::class);

    // personnel
    Route::post('register', [AuthController::class, 'register']); // ค่อยมาทำ เพราะมีเปลี่ยนแปลง
});


##### ระบบติดตามแม่บ้าน #####
Route::middleware('auth:sanctum')->group(function () {

    Route::prefix('homemaker')->group(function () {
        // ประเภทห้อง
        Route::apiResource('roomtype', RoomTypeController::class);

        // แม่บ้าน
        Route::apiResource('homemaker', HomemakerController::class);
        Route::put('/reset/password/{id}', [HomemakerController::class, 'updatePassword']);

        // ห้อง
        Route::apiResource('room', RoomController::class);
    });
});

// ห้อง เพิ่มแม่บ้าน
Route::apiResource('homemaker/roomhomemaker', RoomAddHomemakerController::class);

// ห้อง เพิ่มผู้ดูแล
Route::apiResource('homemaker/roompersonnel', RoomAddPersonnelController::class);

// ห้อง เพิ่ม checklist
Route::apiResource('homemaker/roomchecklist', RoomAddChecklistController::class);

// checklist
Route::apiResource('homemaker/checklist', ChecklistController::class);
Route::apiResource('homemaker/checklistsub', ChecklistSubController::class);
Route::get('/homemaker/checklistsubbychecklist/{id}', [ChecklistSubController::class, 'showByChecklistId']);

//Login เข้าสู่ระบบ สำหรับ Admin และ บุคลากร
Route::post('login', [AuthController::class, 'login']);
// Route::post('loginadmin', [AuthAdminController::class, 'login']);

// คำนำหน้าชื่อ
Route::apiResource('prename', PrenameController::class);

// province & amphur
Route::apiResource('province', ProvinceController::class)->only(['index', 'show']);
Route::apiResource('amphur', ProvinceController::class)->only(['show']);

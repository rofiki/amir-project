<?php

use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\AuthAdminController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CompanyController;
use App\Http\Controllers\Api\DepartmentController;
use App\Http\Controllers\Api\JobPositionController;
use App\Http\Controllers\Api\ProvinceController;
use App\Http\Controllers\Api\EmployeeController;
use App\Http\Controllers\Api\HomeMaker\HomemakerController;
use App\Http\Controllers\Api\HomeMaker\RoomTypeController;
use Illuminate\Http\Request;
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

Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('employee', EmployeeController::class); // รอลบ

    // auth
    Route::prefix('auth')->group(function () {
        Route::delete('logout', [AuthController::class, 'logoff']);
        Route::put('/', [AuthController::class, 'updatePassword']);
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

    // tbJobPosition ตำแหน่งงาน
    Route::apiResource('jobposition', JobPositionController::class);

    // province & amphur
    Route::apiResource('province', ProvinceController::class)->only(['index', 'show']);
    Route::apiResource('amphur', ProvinceController::class)->only(['show']);

    // Route::apiResource('admin', EmployeeController::class);

    // employee
    Route::post('register', [AuthController::class, 'register']); // ค่อยมาทำ เพราะมีเปลี่ยนแปลง
});

//Login เข้าสู่ระบบ สำหรับ Admin และ บุคลากร
Route::post('login', [AuthController::class, 'login']);
// Route::post('loginadmin', [AuthAdminController::class, 'login']);

##### ระบบติดตามแม่บ้าน #####
Route::middleware('auth:sanctum')->group(function () {

    // tbRoomType ประเภทห้อง
    Route::prefix('homemaker')->group(function () {
        Route::apiResource('roomtype', RoomTypeController::class);
        Route::apiResource('homemaker', HomemakerController::class);
    });
    
});




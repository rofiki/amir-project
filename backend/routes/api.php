<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CompanyController;
use App\Http\Controllers\Api\DepartmentController;
use App\Http\Controllers\Api\JobPositionController;
use App\Http\Controllers\Api\ProvinceController;
use App\Http\Controllers\Api\EmployeeController;
use App\Models\DepartmentSub;
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

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('login', [AuthController::class, 'login']);  
Route::post('register', [AuthController::class, 'register']);  


Route::apiResource('company', CompanyController::class);
Route::apiResource('department', DepartmentController::class);
// Route::apiResource('departmentsub', DepartmentSub::class)->only(['store', 'show', 'update', 'destroy']);
Route::apiResource('jobposition', JobPositionController::class);
Route::apiResource('province', ProvinceController::class)->only(['index', 'show']);
Route::apiResource('amphur', ProvinceController::class)->only(['show']);
// Route::apiResource('employee', EmployeeController::class);


// Route::prefix('company')->group(function () {
//     Route::get('/', [CompanyController::class, 'index']);  
// });
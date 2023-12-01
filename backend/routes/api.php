<?php

use App\Http\Controllers\Api\CompanyController;
use App\Http\Controllers\Api\DepartmentController;
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

Route::get('/test', function () {

    $test = [
        "users_id" => 1,
        "firstname" => 'Rofiki Harong'
    ];

    return $test;
});

Route::apiResource('company', CompanyController::class);
Route::apiResource('department', DepartmentController::class);


    // ->only(['index', 'show']);
// Route::prefix('company')->group(function () {
//     Route::get('/', [CompanyController::class, 'index']);  

// });
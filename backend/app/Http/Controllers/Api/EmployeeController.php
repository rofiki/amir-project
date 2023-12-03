<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\EmployeeCollection;
use App\Http\Resources\EmployeeResource;
use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class EmployeeController extends Controller
{
    public function index(Request $request) // show all
    {
        $db = new Employee;
        // $start = $request->input('start') ?? 0;
        $limit = $request->input('limit') ?? 25;
        $search = $request->input('search');

        $items = $db->paginate((int)$limit); 

        try {
            return new EmployeeCollection($items);
        } catch (\Exception $e) {
            return $this->returnError($e->getMessage());
        }
    }
}

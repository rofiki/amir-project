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

    public function show(Request $request, Employee $employee) //show by id
    {
        return new EmployeeResource($employee);
    }

    public function store(Request $request) // add
    {
        $validated = Validator::make($request->all(), [
            // 'department_id' => 'required',
            'employee_code' => 'required|min:2|max:255',
            'prefix_id' => 'required',
            'firstname' => 'required|min:2|max:255',
            'lastname' => 'required|min:2|max:255',
            // 'nickname' => 'required|min:2|max:255',
            'gender' => 'required',
            'date_of_birth' => 'required|min:2|max:255',
            'idcard' => 'required|min:2|max:255',
            'date_of_sign' => 'required|min:2|max:255',
            // 'date_of_resign' => 'required|min:2|max:255',
           
        ]);
        
        if ($validated->fails()) {
            $response = response()->json(['status' => false, 'error' => $validated->messages()], 422);
        } else {
            $employee = Employee::create([
                'users_id' => $request->users_login_id,
                'employee_code' => $request->employee_code,
                'prefix_id' => $request->prefix_id,
                'firstname' => $request->firstname,
                'lastname' => $request->lastname,
                'nickname' => $request->nickname,
                'gender' => $request->gender,
                'date_of_birth' => $request->date_of_birth,
                'idcard' => $request->idcard,
                'date_of_sign' => $request->date_of_sign,
                'date_of_resign' => $request->date_of_resign,
                'active' => $request->active,
            ]);
            $response =new EmployeeResource($employee);
            
        }
        return $response;

        // users_login_id
        // employee_code
        // prefix_id
        // firstname
        // lastname
        // nickname
        // gender
        // date_of_birth
        // idcard
        // date_of_sign
        // date_of_resign
        // active
    }

    public function update(Request $request, Employee $employee) // update
    {
        $validated = Validator::make($request->all(), [
            'name' => 'required|min:2|max:255'
        ]);
        
        if ($validated->fails()) {
            $response = response()->json(['status' => false, 'error' => $validated->messages()], 422);
        } else {

            $employee->update([
                'department_id' => $request->department_id,
                'name' => $request->name,
                'description' => $request->description
            ]);

            $response = new EmployeeResource($employee);
        }
        return $response;
    }

    public function destroy(Request $request, Employee $employee) // delete
    {
        try {
            $employee->delete();
            return response()->json(['status' => true,], 200);
        }catch(\Exception $e){
            return response()->json(['status' => false,], 404);
        }
        return response()->json(['status' => false,], 500);
    }
}

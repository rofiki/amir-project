<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\DepartmentCollection;
use App\Http\Resources\DepartmentResource;
use App\Models\Department;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class DepartmentController extends Controller
{
    public function index(Request $request) // show all
    {
        $db = new Department;
        // $start = $request->input('start') ?? 0;
        $limit = $request->input('limit') ?? 10;
        $search = $request->input('search');

        $items = $db->paginate((int)$limit); 

        try {
            return new DepartmentCollection($items);
        } catch (\Exception $e) {
            return $this->returnError($e->getMessage());
        }
    }

    public function show(Request $request, Department $department) //show by id
    {
        return new DepartmentResource($department);
    }

    public function condition()
    {

    }

    public function store(Request $request) // add
    {
        $validated = Validator::make($request->all(), [
            'company_id' => 'required',
            'name' => 'required|min:2|max:255',
        ]);
        
        if ($validated->fails()) {
            $response = response()->json(['status' => false, 'error' => $validated->messages()], 422);
        } else {
            $department = Department::create([
                'company_id' => $request->company_id,
                'name' => $request->name,
                'description' => $request->description
            ]);
            $response =new DepartmentResource($department);
        }
        return $response;
    }

    public function update(Request $request, Department $department) // update
    {
        $validated = Validator::make($request->all(), [
            'name' => 'required|min:2|max:255'
        ]);
        
        if ($validated->fails()) {
            $response = response()->json(['status' => false, 'error' => $validated->messages()], 422);
        } else {

            $department->update([
                'company_id' => $request->company_id,
                'name' => $request->name,
                'description' => $request->description
            ]);
            $response =new DepartmentResource($department);
        }
        return $response;
    }

    public function destroy(Request $request, Department $department) // delete
    {
        try {
            $department->delete();
            return response()->json(['status' => true,], 200);
        }catch(\Exception $e){
            return response()->json(['status' => false,], 404);
        }
        return response()->json(['status' => false,], 500);
    }

}

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\DepartmentCollection;
use App\Http\Resources\DepartmentResource;
use App\Models\Department;
use App\Models\DepartmentSub;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class DepartmentController extends Controller
{

    public $sub2;
    public function index(Request $request) // show all
    {
        $departmentSub = new DepartmentSub;
        $db = new Department;


        $limit = $request->input('limit') ?? 10;
        $search = $request->input('search');

        $items = $db->paginate((int)$limit);

        foreach ($items as $key => $value) {
            $items_2[$key] = $value;
            $items_2[$key]['department_sub'] = $this->getSub($value->id);
        }
        return new DepartmentCollection($items_2);
    }

    function getSub($id)
    {
        

        $items_2 = null;
        // $query = $this->db->leftJoin('tb_users_detail', 'tb_users.users_id', '=', 'tb_users_detail.users_id');
        // $query->where('users_usersname', 'LIKE', '%' . $search . '%')
        //     ->where('isActive', 1);
        // $count = $query->count();
        // $item = $query
        //     ->offset($start)
        //     ->limit($limit)
        //     ->orderBy('users_usersname', 'ASC')->get();


        $items = DepartmentSub::leftJoin('departments', 'department_sub.department_sub_id', '=', 'departments.id')
            ->where('department_sub.department_main_id', $id)->get();

        foreach ($items as $key => $value) {
            $items_2[$key] = $value;
            // $items_2[$key]['department_sub'] = $this->getSub($value->id);
            $this->sub2[$key] = $value;
        }

        // $sub = DepartmentSub::where('department_main_id', $id)->get();
        // $main = Department::where('', '')->get();
        return $items_2;
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
        // default param
        $dep_main_id = $request->input('department_main_id') ?? 0;

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
            $updateDepSub = DepartmentSub::create([
                'department_main_id' => $dep_main_id,
                'department_sub_id' => $department->id
            ]);
            $response = new DepartmentResource($department);
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
            $response = new DepartmentResource($department);
        }
        return $response;
    }

    public function destroy(Request $request, Department $department) // delete
    {
        try {
            $department->delete();
            return response()->json(['status' => true,], 200);
        } catch (\Exception $e) {
            return response()->json(['status' => false,], 404);
        }
        return response()->json(['status' => false,], 500);
    }
}

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

    public function aindex(Request $request) // show all
    {
        $departmentSub = new DepartmentSub;
        $db = new Department;

        $limit = $request->input('limit') ?? 10;
        $search = $request->input('search');

        // แผนกหลักขึ้นก่อน
        $dep_sub = $departmentSub
            ->leftJoin('tbDepartments', 'tbDepartmentSub.department_sub_id', '=', 'tbDepartments.id')
            ->where('department_main_id', '=', '0')->paginate((int)$limit);

        //แทรกแผนกย่อย
        foreach ($dep_sub as $key => $value) {
            $items[$key] = $value;
            $items[$key]['department_sub'] = $this->getSub($value->id);
        }
        return new DepartmentCollection($items);
    }

    public function index(Request $request)
    {
        
        $limit = $request->input('limit') ?? 25;
        $search = $request->input('search');

        $items = Department::where('name', 'Like', '%' . $search . '%')
            ->whereNull('deleted_at')
            ->paginate((int)$limit);
        try {
            return new DepartmentCollection($items); 
        } catch (\Exception $e) {
            return response()->json(['message' => 'Bad request'], 400);
        }
    }

    public function showDepartmentTree(Request $request) // show all
    {
        $departmentSub = new DepartmentSub;
        $db = new Department;

        $limit = $request->input('limit') ?? 10;
        $search = $request->input('search');

        // แผนกหลักขึ้นก่อน
        $dep_sub = $departmentSub
            ->leftJoin('tbDepartments', 'tbDepartmentSub.department_sub_id', '=', 'tbDepartments.id')
            ->where('department_main_id', '=', '0')->paginate((int)$limit);

        //แทรกแผนกย่อย
        foreach ($dep_sub as $key => $value) {
            $items[$key] = $value;
            $items[$key]['department_sub'] = $this->getSub($value->id);
        }
        return new DepartmentCollection($items);
    }

    function getSub($id)
    {
        $items = null;
        $dep_sub = DepartmentSub::leftJoin('tbDepartments', 'tbDepartmentSub.department_sub_id', '=', 'tbDepartments.id')
            ->where('tbDepartmentSub.department_main_id', $id)->get();

        foreach ($dep_sub as $key => $value) {
            $items[$key] = $value;
            $items[$key]['department_sub'] = $this->getSub($value->id) ?? [];
        }
        return $items;
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
        $dep_main_id = $request->input('dep_main') ?? 0;
        $company_id = 1; // default เป็น 1 = บริษัทแรก บริษัทเดียว

        $validated = Validator::make($request->all(), [
            // 'company_id' => 'required', บริษัท กรณีใช้งานกับหลายบริษัท สามารสร้างบริษัทอื่น ๆ ได้
            'name' => 'required|min:2|max:255',
        ]);

        if ($validated->fails()) {
            $response = response()->json(['status' => false, 'error' => $validated->messages()], 422);
        } else {
            $department = Department::create([
                // 'company_id' => $request->company_id,
                'company_id' => $company_id,
                'name' => $request->name,
                'description' => $request->description
            ]);
            DepartmentSub::create([
                'department_main_id' => $dep_main_id,
                'department_sub_id' => $department->id
            ]);
            $response = response()->json(['status' => true, 'data' => $department], 200);
        }
        return $response;
    }

    public function update(Request $request, Department $department) // update
    {
        $dep_sub = new DepartmentSub;
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

            // update ใน department_usb
            DepartmentSub::where('department_sub_id', $department->id)
                ->update([
                    'department_main_id' => $request->department_main_id
                ]);

            $response = new DepartmentResource($department);
        }
        return $response;
    }

    public function destroy(Request $request, Department $department) // delete
    {
        // 1. ตรวจสอบ location_job มีค้างใน department ไหม
        // 2. ถ้ามี location_job ลบไม่ได้
        // 3. ถ้าไม่มีลบได้ และลบใน department_sub ด้วย

        try {
            $department->delete();
            return response()->json(['status' => true,], 200);
        } catch (\Exception $e) {
            return response()->json(['status' => false,], 404);
        }
        return response()->json(['status' => false,], 500);
    }
}

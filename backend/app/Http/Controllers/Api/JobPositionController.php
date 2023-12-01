<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\JobPositionCollaction;
use App\Http\Resources\JobPositionResource;
use App\Models\JobPosition;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class JobPositionController extends Controller
{
    public function index(Request $request) // show all
    {
        $db = new JobPosition;
        // $start = $request->input('start') ?? 0;
        $limit = $request->input('limit') ?? 10;
        $search = $request->input('search');

        $items = $db->paginate((int)$limit); 

        try {
            return new JobPositionCollaction($items);
        } catch (\Exception $e) {
            return $this->returnError($e->getMessage());
        }
    }

    public function show(Request $request, JobPosition $jobposition) //show by id
    {
        return new JobPositionResource($jobposition);
    }

    public function store(Request $request) // add
    {
        $validated = Validator::make($request->all(), [
            'department_id' => 'required',
            'name' => 'required|min:2|max:255',
        ]);
        
        if ($validated->fails()) {
            $response = response()->json(['status' => false, 'error' => $validated->messages()], 422);
        } else {
            $jobPosition = JobPosition::create([
                'department_id' => $request->department_id,
                'name' => $request->name,
                'description' => $request->description
            ]);
            $response =new JobPositionResource($jobPosition);
            
        }
        return $response;
    }

    public function update(Request $request, JobPosition $jobposition) // update
    {
        $validated = Validator::make($request->all(), [
            'name' => 'required|min:2|max:255'
        ]);
        
        if ($validated->fails()) {
            $response = response()->json(['status' => false, 'error' => $validated->messages()], 422);
        } else {

            $jobposition->update([
                'department_id' => $request->department_id,
                'name' => $request->name,
                'description' => $request->description
            ]);

            $response = new JobPositionResource($jobposition);
        }
        return $response;
    }

    public function destroy(Request $request, JobPosition $jobposition) // delete
    {
        try {
            $jobposition->delete();
            return response()->json(['status' => true,], 200);
        }catch(\Exception $e){
            return response()->json(['status' => false,], 404);
        }
        return response()->json(['status' => false,], 500);
    }
}

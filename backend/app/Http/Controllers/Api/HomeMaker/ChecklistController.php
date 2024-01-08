<?php

namespace App\Http\Controllers\Api\HomeMaker;

use App\Http\Controllers\Controller;
use App\Http\Resources\HomeMaker\ChecklistCollection;
use App\Http\Resources\HomeMaker\ChecklistResource;
use App\Models\HomeMaker\tbChecklist;
use App\Models\HomeMaker\tbChecklistSub;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ChecklistController extends Controller
{

    public function index(Request $request) // show all
    {
        $limit = 25;
        $search = $request->input('search');

        $items = tbChecklist::where('checklistName', 'Like', '%' . $search . '%')
            // ->orWhere('note', 'Like', '%' . $search . '%')
            ->whereNull('deleted_at')
            ->paginate((int)$limit);

        try {
            return new ChecklistCollection($items);
        } catch (\Exception $e) {
            return $this->returnError($e->getMessage());
        }
    }

    public function show($id) //show by id
    {

        $item = tbChecklist::where('checklist_id', $id)
            ->whereNull('deleted_at')->get()->first();

        if ($item) {
            return new ChecklistResource($item);
        }
        return response()->json(['message' => 'Not Found!'], 404);
    }

    public function store(Request $request)
    {
        $validated = Validator::make($request->all(), [
            'name' => 'required',
        ]);

        if ($validated->fails()) {
            $response = response()->json(['status' => false, 'error' => $validated->messages()], 422);
        } else {

            $create = tbChecklist::create([
                'checklistName' => $request->name,
            ]);

            $response = response()->json(['status' => true, 'data' => $create], 200);
        }
        return $response;
    }

    public function update(Request $request, $id) // update
    {
        $validated = Validator::make($request->all(), [
            'name' => 'required',
        ]);

        if ($validated->fails()) {
            return response()->json([
                'status' => false,
                'error' => $validated->messages(),
                'log' => '1',
            ], 422);
        } else {
            $update = tbChecklist::where('checklist_id', $id);
            $update->update([
                'checklistName' => $request->name,
            ]);
            return response()->json([
                'status' => true,
                'data' => $update->get(),
            ], 200);
        }
    }

    public function destroy($id)
    {
        $id = (int)$id;
        if (!$id) {
            return response()->json([
                'status' => false,
                'message' => 'Not Found!',
                'log' => 1
            ], 404);
        }
        $itemSub = tbChecklistSub::where('checklist_id', $id)->delete(); // ลบหัวข้อย่อย
        $item = tbChecklist::where('checklist_id', $id)->get()->first(); // ลบแบบฟอร์ม

        if (!$item->delete()) {
            return response()->json([
                'status' => false,
                'message' => 'Not Found!',
                'log' => 2
            ], 404);
        } else {
            return response()->json([
                'status' => true,
                'message' => 'Delete Success!', 200
            ]);
        }
    }
}

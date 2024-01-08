<?php

namespace App\Http\Controllers\Api\HomeMaker;

use App\Http\Controllers\Controller;
use App\Http\Resources\HomeMaker\ChecklistSubCollection;
use App\Http\Resources\HomeMaker\ChecklistSubResource;
use App\Models\HomeMaker\tbChecklist;
use App\Models\HomeMaker\tbChecklistSub;
use Illuminate\Http\Request;

class ChecklistSubController extends Controller
{
    public function index($id) // show all
    {
        $limit = 25;
        // $id = $request->checklist_id;
        // $search = $request->input('search');

        $db = new tbChecklistSub;
        $checklist = new tbChecklist;
        $tbChecklist = $checklist->getTable();
        $tbChecklistSub = $db->getTable();

        $items = $db->leftJoin($tbChecklist, $tbChecklistSub.'.checklist_id', $tbChecklist.'.checklist_id')
        // $items = tbChecklistSub::where('checklistName', 'Like', '%' . $search . '%')
            // ->orWhere('checklistName', 'Like', '%' . $search . '%')
            ->where($tbChecklistSub . '.checklist_id', $id)
            ->whereNull('deleted_at')
            ->paginate((int)$limit);

        try {
            return new ChecklistSubCollection($items);
        } catch (\Exception $e) {
            return $this->returnError($e->getMessage());
        }
    }

    public function show($id) //show by id
    {
        $limit = 25;

        $db = new tbChecklistSub;
        $checklist = new tbChecklist;
        $tbChecklist = $checklist->getTable();
        $tbChecklistSub = $db->getTable();

        $items = $db->leftJoin($tbChecklist, $tbChecklistSub.'.checklist_id', $tbChecklist.'.checklist_id')
            ->where($tbChecklistSub . '.checklistSub_id', $id)
            ->whereNull($tbChecklistSub . '.deleted_at')->get()->first();

        try {
            return new ChecklistSubResource($items);
        } catch (\Exception $e) {
            return $this->returnError($e->getMessage());
        }
        // return response()->json(['status' => true, 'data' => $id], 200);
    }

    public function showByChecklistId($id) //show by id
    {
        $limit = 25;

        $db = new tbChecklistSub;
        $checklist = new tbChecklist;
        $tbChecklist = $checklist->getTable();
        $tbChecklistSub = $db->getTable();

        $items = $db->leftJoin($tbChecklist, $tbChecklistSub.'.checklist_id', $tbChecklist.'.checklist_id')
            ->where($tbChecklistSub . '.checklist_id', $id)
            ->whereNull($tbChecklistSub . '.deleted_at')
            ->paginate((int)$limit);

        try {
            return new ChecklistSubCollection($items);
        } catch (\Exception $e) {
            return $this->returnError($e->getMessage());
        }
    }

    public function store(Request $request)
    {
        $create = tbChecklistSub::create([
            'checklist_id' => $request->checklist_id,
            'checklistSubName' => $request->checklistSubName,
        ]);
        return response()->json(['status' => true, 'data' => $create], 200);
    }

    public function update(Request $request) // update
    {
        $update = tbChecklistSub::where('checklistSub_id', $request->id);
        $update->update([
            // 'checklist_id' => $request->checklist_id,
            'checklistSubName' => $request->checklistSubName,
        ]);
        return response()->json([
            'status' => true,
            'data' => $update->get(),
        ], 200);
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

        $del = tbChecklistSub::where('checklistSub_id', $id);

        if (!$del->delete()) {
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

    public function destroyByChecklistId($id)
    {
        $id = (int)$id;
        if (!$id) {
            return response()->json([
                'status' => false,
                'message' => 'Not Found!',
                'log' => 1
            ], 404);
        }

        $del = tbChecklistSub::where('checklist_id', $id);

        if (!$del->delete()) {
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

<?php

namespace App\Http\Controllers\Api\HomeMaker;

use App\Http\Controllers\Controller;
use App\Models\HomeMaker\tbChecklist;
use App\Models\HomeMaker\tbRoom;
use App\Models\HomeMaker\tbRoomAddChecklist;
use Illuminate\Http\Request;

class RoomAddChecklistController extends Controller
{
    public function index(Request $request)
    {
        $room = new tbRoom();
        $checklist = new tbChecklist();
        $db = new tbRoomAddChecklist();

        $tbChecklist = $checklist->getTable();
        $tbRoom = $room->getTable();
        $tbRoomAddChecklist = $db->getTable();

        $items = $db->leftJoin($tbChecklist, $tbRoomAddChecklist.'.checklist_id', $tbChecklist.'.checklist_id')
        ->leftJoin($tbRoom, $tbRoomAddChecklist. '.room_id', $tbRoom.'.roomId' )
        ->select($tbRoomAddChecklist.'.*', )
        ->select($tbRoom.'.type_id', $tbRoom.'.roomName')
        ->whereNull($tbRoomAddChecklist.'.deleted_at')->get();

        try {
            return response()->json(['status' => true, 'data' => $items], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Bad request'], 400);
        }
    }

    public function show($id) //show by id
    {
        $room = new tbRoom();
        $checklist = new tbChecklist();
        $db = new tbRoomAddChecklist();

        $tbChecklist = $checklist->getTable();
        $tbRoom = $room->getTable();
        $tbRoomAddChecklist = $db->getTable();

        $item = $db->leftJoin($tbChecklist, $tbRoomAddChecklist.'.checklist_id', $tbChecklist.'.checklist_id')
        ->leftJoin($tbRoom, $tbRoomAddChecklist. '.room_id', $tbRoom.'.roomId' )
        ->select($tbRoomAddChecklist.'.*', )
        ->select($tbRoom.'.type_id', $tbRoom.'.roomName')
        ->where($tbRoomAddChecklist . '.room_id', $id)
        ->whereNull($tbRoomAddChecklist.'.deleted_at')->get();

        if ($item) {
            return response()->json(['status' => true, 'data' => $item, 'statusCode' => 200]);
        }
        return response()->json(['message' => 'Not Found!'], 404);
    }

    public function store(Request $request)
    {
        $create = tbRoomAddChecklist::create([
            'room_id' => $request->roomId,
            'checklist_id' => $request->checklist,
        ]);
        return response()->json(['status' => true, 'data' => $create], 200);
    }

    public function update(Request $request) // update
    {
        $update = tbRoomAddChecklist::where('roomAddChecklist_id', $request->id);
        $update->update([
            'room_id' => $request->room,
            'checklist_id' => $request->checklist,
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

        $del = tbRoomAddChecklist::where('roomAddChecklist_id', $id);

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

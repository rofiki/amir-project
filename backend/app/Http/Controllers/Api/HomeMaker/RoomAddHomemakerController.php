<?php

namespace App\Http\Controllers\Api\HomeMaker;

use App\Http\Controllers\Controller;
use App\Models\HomeMaker\tbHomemaker;
use App\Models\HomeMaker\tbRoom;
use App\Models\Homemaker\tbRoomAddHomemaker;
use App\Models\Prename;
use Illuminate\Http\Request;

class RoomAddHomemakerController extends Controller
{
    public function index(Request $request)
    {
        $room = new tbRoom();
        $homemaker = new tbHomemaker();
        $prename = new Prename();
        $db = new tbRoomAddHomemaker();

        $tbHomeMaker = $homemaker->getTable();
        $tbRoom = $room->getTable();
        $tbRoomAddHomemaker = $db->getTable();
        $tbPrename = $prename->getTable();

        $items = $db->leftJoin($tbHomeMaker, $tbRoomAddHomemaker. '.homemaker_id', $tbHomeMaker.'.id' )
        ->leftJoin($tbRoom, $tbRoomAddHomemaker. '.room_id', $tbRoom.'.roomId' )
        ->leftJoin($tbPrename, $tbHomeMaker. '.prename_id', $tbPrename.'.id' )
        ->select($tbRoomAddHomemaker.'.*', )
        ->select($tbRoom.'.type_id', $tbRoom.'.roomName')
        ->select($tbHomeMaker.'.*')
        // ->select($tbPrename.'.*')
        ->whereNull($tbRoomAddHomemaker.'.deleted_at')->get();

        try {
            return response()->json(['status' => true, 'data' => $items], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Bad request'], 400);
        }
    }

    public function show($id) //show by id
    {
        $room = new tbRoom();
        $homemaker = new tbHomemaker();
        $db = new tbRoomAddHomemaker();

        $tbHomeMaker = $homemaker->getTable();
        $tbRoom = $room->getTable();
        $tbRoomAddHomemaker = $db->getTable();

        $item = $db->leftJoin($tbHomeMaker, $tbRoomAddHomemaker. '.homemaker_id', $tbHomeMaker.'.id' )
        ->leftJoin($tbRoom, $tbRoomAddHomemaker. '.room_id', $tbRoom.'.roomId' )

        // ->select($tbRoom.'.type_id', $tbRoom.'.roomName')
        // ->select($tbHomeMaker.'.*')
        // ->select($tbRoomAddHomemaker.'.*')

        ->where($tbRoomAddHomemaker . '.room_id', $id)
        ->whereNull($tbRoomAddHomemaker.'.deleted_at')->get();

        // $item = tbRoomAddHomemaker::where('room_id', $id)->get();
        if ($item) {
            return response()->json(['status' => true, 'data' => $item, 'statusCode' => 200]);
        }
        return response()->json(['message' => 'Not Found!'], 404);
    }

    public function store(Request $request)
    {
        $create = tbRoomAddHomemaker::create([
            'room_id' => $request->roomId,
            'homemaker_id' => $request->homemaker,
        ]);
        return response()->json(['status' => true, 'data' => $create], 200);
    }

    public function update(Request $request) // update
    {
        $update = tbRoomAddHomemaker::where('roomAddHomemaker_id', $request->id);
        $update->update([
            'room_id' => $request->room,
            'homemaker_id' => $request->homemaker,
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

        $del = tbRoomAddHomemaker::where('roomAddHomemaker_id', $id);

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

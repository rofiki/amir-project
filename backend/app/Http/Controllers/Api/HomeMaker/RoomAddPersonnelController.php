<?php

namespace App\Http\Controllers\Api\HomeMaker;

use App\Http\Controllers\Controller;
use App\Http\Resources\HomeMaker\RoomAddPersonnelCollection;
use App\Http\Resources\HomeMaker\RoomAddPersonnelResource;
use App\Models\HomeMaker\tbRoom;
use App\Models\HomeMaker\tbRoomAddPersonnel;
use App\Models\Prename;
use App\Models\tbPersonnel;
use Illuminate\Http\Request;

class RoomAddPersonnelController extends Controller
{
    public function index(Request $request)
    {
        $room = new tbRoom();
        $personnel = new tbPersonnel();
        $prename = new Prename();
        $db = new tbRoomAddPersonnel();

        $tbPersonnel = $personnel->getTable();
        $tbRoom = $room->getTable();
        $tbRoomAddPersonnel = $db->getTable();
        $tbPrename = $prename->getTable();

        $items = $db->leftJoin($tbPersonnel, $tbRoomAddPersonnel. '.personnel_id', $tbPersonnel.'.id' )
        ->leftJoin($tbRoom, $tbRoomAddPersonnel. '.room_id', $tbRoom.'.roomId' )
        ->leftJoin($tbPrename, $tbPersonnel. '.prename_id', $tbPrename.'.id' )
        ->select($tbRoomAddPersonnel.'.*', )
        ->select($tbRoom.'.type_id', $tbRoom.'.roomName')
        ->select($tbPersonnel.'.*')
        ->whereNull($tbRoomAddPersonnel.'.deleted_at')->get();

        try {
            // return response()->json(['status' => true, 'data' => $items], 200);
            return new RoomAddPersonnelCollection($items);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Bad request'], 400);
        }
    }

    public function show($id) //show by id
    {
        $room = new tbRoom();
        $personnel = new tbPersonnel();
        $db = new tbRoomAddPersonnel();

        $tbPersonnel = $personnel->getTable();
        $tbRoom = $room->getTable();
        $tbRoomAddPersonnel = $db->getTable();

        $item = $db->leftJoin($tbPersonnel, $tbRoomAddPersonnel. '.personnel_id', $tbPersonnel.'.id' )
        ->leftJoin($tbRoom, $tbRoomAddPersonnel. '.room_id', $tbRoom.'.roomId' )

        // ->select($tbRoom.'.type_id', $tbRoom.'.roomName')
        // ->select($tbHomeMaker.'.*')
        // ->select($tbRoomAddHomemaker.'.*')

        ->where($tbRoomAddPersonnel . '.room_id', $id)
        ->whereNull($tbRoomAddPersonnel.'.deleted_at')->get();

        // $item = tbRoomAddHomemaker::where('room_id', $id)->get();
        if ($item) {
            return new RoomAddPersonnelResource($item);
            // return response()->json(['status' => true, 'data' => $item, 'statusCode' => 200]);
        }
        return response()->json(['message' => 'Not Found!'], 404);
    }

    public function store(Request $request)
    {
        $create = tbRoomAddPersonnel::create([
            'room_id' => $request->roomId,
            'personnel_id' => $request->personnel,
        ]);
        return response()->json(['status' => true, 'data' => $create], 200);
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

        $del = tbRoomAddPersonnel::where('roomAddPersonnel_id', $id);

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

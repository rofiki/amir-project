<?php

namespace App\Http\Controllers\Api\HomeMaker;

use App\Http\Controllers\Controller;
use App\Models\Homemaker\tbRoomAddHomemaker;
use Illuminate\Http\Request;

class RoomAddHomemakerController extends Controller
{
    public function index(Request $request)
    {
        
        $items = tbRoomAddHomemaker::whereNull('deleted_at')->get();
        try {
            return response()->json(['status' => true, 'data' => $items], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Bad request'], 400);
        }
    }

    public function show($id) //show by id
    {
        $item = tbRoomAddHomemaker::where('room_id', $id)->get();
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

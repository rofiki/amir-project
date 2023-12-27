<?php

namespace App\Http\Controllers\Api\HomeMaker;

use App\Http\Controllers\Controller;
use App\Http\Resources\HomeMaker\RoomCollection;
use App\Http\Resources\HomeMaker\RoomResource;
use App\Models\HomeMaker\tbHomemaker;
use App\Models\HomeMaker\tbRoom;
use App\Models\Homemaker\tbRoomAddHomemaker;
use App\Models\HomeMaker\tbRoomType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class RoomController extends Controller
{
    
    public function index(Request $request) // show all
    {
        $type = new tbRoomType();
        $model = new tbRoom;

        $tbRoomType = $type->getTable();
        $tbRoom = $model->getTable();

        // $start = $request->input('start') ?? 0;
        $limit = $request->input('limit') ?? 25;
        $search = $request->input('search');

        $items = $model->leftJoin($tbRoomType, $tbRoom . '.type_id', $tbRoomType . '.id')
            ->select($tbRoom.'.*', $tbRoomType.'.type_text')
            ->whereNull($tbRoom.'.deleted_at')
            ->paginate((int)$limit);

        // $homemaker = tbRoomAddHomemaker::where('room_id','');
        try {
            return new RoomCollection($items);
        } catch (\Exception $e) {
            return $this->returnError($e->getMessage());
        }
    }

    public function show($id) //show by id
    {

        $type = new tbRoomType();
        $model = new tbRoom;

        $tbRoomType = $type->getTable();
        $tbRoom = $model->getTable();

        $item = $model->leftJoin($tbRoomType, $tbRoom . '.type_id', $tbRoomType . '.id')
            ->select($tbRoom.'.*', $tbRoomType.'.type_text')
            ->where($tbRoom.'.roomId', $id)
            ->whereNull($tbRoom.'.deleted_at')->get()->first();

        if ($item) {
            return new RoomResource($item);
        }
        return response()->json(['message' => 'Not Found!'], 404);
    }

    public function store(Request $request)
    {
        $validated = Validator::make($request->all(), [
            'typeId' => 'required',
            'name' => 'required',
            'floor' => 'numeric',
        ]);

        if ($validated->fails()) {
            $response = response()->json(['status' => false, 'error' => $validated->messages()], 422);
        } else {

            $create = tbRoom::create([
                'type_id' => $request->typeId,
                'roomName' => $request->name,
                'roomBuilder' => $request->builder,
                'roomFloor' => $request->floor,
                'roomLocation' => $request->location,
                'roomDescription' => $request->desc,
            ]);

            $response = response()->json(['status' => true, 'data' => $create], 200);
        }
        return $response;
    }

    public function update(Request $request, $id) // update
    {
        $validated = Validator::make($request->all(), [
            'typeId' => 'required',
            'name' => 'required',
            'floor' => 'numeric',
        ]);

        if ($validated->fails()) {
            return response()->json([
                'status' => false,
                'error' => $validated->messages(),
                'log' => '1',
            ], 422);
        } else {
            $update = tbRoom::where('roomId', $id);
            $update->update([
                'type_id' => $request->typeId,
                'roomName' => $request->name,
                'roomBuilder' => $request->builder,
                'roomFloor' => $request->floor,
                'roomLocation' => $request->location,
                'roomDescription' => $request->desc,
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

        $item = tbRoom::where('roomId', $id)->get()->first();

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

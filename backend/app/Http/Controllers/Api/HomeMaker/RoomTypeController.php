<?php

namespace App\Http\Controllers\Api\HomeMaker;

use App\Http\Controllers\Controller;
use App\Http\Resources\HomeMaker\RoomTypeCollection;
use App\Http\Resources\HomeMaker\RoomTypeResource;
use App\Models\HomeMaker\tbRoomType;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;

class RoomTypeController extends Controller
{
    public function index(Request $request)
    {
        
        $limit = $request->input('limit') ?? 25;
        $search = $request->input('search');

        $items = tbRoomType::where('type_text', 'Like', '%' . $search . '%')
            ->whereNull('deleted_at')
            ->paginate((int)$limit);
        try {
            return new RoomTypeCollection($items); 
        } catch (\Exception $e) {
            return response()->json(['message' => 'Bad request'], 400);
        }
    }

    public function show($id) //show by id
    {
        $admin = tbRoomType::where('id', $id)->get()->first();
        if ($admin) {
            return new RoomTypeResource($admin);
        }
        return response()->json(['message' => 'Not Found!'], 404);
    }

    public function showByCondition()
    {
    }

    public function store(Request $request)
    {

        $validated = Validator::make($request->all(), [
            'name' => 'required|max:100',
        ]);

        if ($validated->fails()) {
            $response = response()->json(['status' => false, 'error' => $validated->messages()], 422);
        } else {

            $create = tbRoomType::create([
                'type_text' => $request->name,
                'description' => $request->desc,
            ]);

            $response = response()->json(['status' => true, 'data' => $create], 200);
        }
        return $response;
    }

    public function update(Request $request) // update
    {
        $validated = Validator::make($request->all(), [
            'name' => 'required|max:100',
        ]);

        if ($validated->fails()) {
            return response()->json([
                'status' => false,
                'error' => $validated->messages(),
                'log' => '1',
            ], 422);
        } else {
            $roomType = tbRoomType::where('id', $request->id);
            $roomType->update([
                'type_text' => $request->name,
                'description' => $request->desc,
            ]);
            return response()->json([
                'status' => true,
                'data' => $roomType->get(),
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

        $del = tbRoomType::where('id', $id);

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

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\AdminCollection;
use App\Http\Resources\AdminResource;
use App\Models\Admin;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Jerry\JWT\JWT;

class AdminController extends Controller
{
    public function index(Request $request)
    {
        // ->whereNull('deleted_at')
        // $start = $request->input('start') ?? 0;
        $limit = $request->input('limit') ?? 25;
        $search = $request->input('search');

        $items = Admin::whereNull('deleted_at')->paginate((int)$limit);
        try {
            return new AdminCollection($items);
        } catch (\Exception $e) {
            return $this->returnError($e->getMessage());
        }
    }

    public function show($id) //show by id
    {
        $admin = Admin::where('id', $id)->get()->first();
        if ($admin) {
            return new AdminResource($admin);
        }
        return response()->json(['message' => 'Not Found!'], 404);
    }

    public function showByCondition()
    {
    }

    public function store(Request $request)
    {

        $validated = Validator::make($request->all(), [
            'firstname' => 'required|max:100',
            'lastname' => 'required|max:100',
            // 'name' => 'required|max:255',
            'password' => 'required|min:4',
            'email' => 'required|max:255|email|unique:users,email',
        ]);

        if ($validated->fails()) {
            $response = response()->json(['status' => false, 'error' => $validated->messages()], 422);
        } else {

            $user = User::create([
                'name' => $request->firstname . " " . $request->lastname,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'remember_token' => Str::random(10),
                'email_verified_at' => now(),
            ]);

            $admin = Admin::create([
                'user_id' => $user->id,
                'firstname' => $request->firstname,
                'lastname' => $request->lastname,
                'email' => $request->email,
                'active' => 'Active',
            ]);
            $response = response()->json(['status' => true, 'data' => $admin], 200);
        }
        return $response;
    }

    public function update(Request $request, Admin $admin) // update
    {
        $validated = Validator::make($request->all(), [
            'firstname' => 'required|max:100',
            'lastname' => 'required|max:100',
        ]);

        if ($validated->fails()) {
            return response()->json([
                'status' => false,
                'error' => $validated->messages(),
                'log' => '1',
            ], 422);
        } else {
            $admin = Admin::where('id', $request->id);
            $admin->update([
                'firstname' => $request->firstname,
                'lastname' => $request->lastname,
                'active' => 'Active'
            ]);
            return response()->json([
                'status' => true,
                'data' => $admin->get(),
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

        $item = Admin::where('id', $id)->get()->first();
        $uid = $item['user_id'];

        if (!$item->delete()) {
            return response()->json([
                'status' => false,
                'message' => 'Not Found!',
                'log' => 2
            ], 404);
        } else {
            User::where('id', $uid)->delete();
            return response()->json([
                'status' => true,
                'test' => $uid,
                'message' => 'Delete Success!', 200
            ]);
        }
    }
}

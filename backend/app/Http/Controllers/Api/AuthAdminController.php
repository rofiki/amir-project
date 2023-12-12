<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\AdminCollection;
use App\Http\Resources\AdminResource;
use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Jerry\JWT\JWT;

class AuthAdminController extends Controller
{

    public function index(Request $request) // show all
    {
        $db = new Admin;
        // $start = $request->input('start') ?? 0;
        $limit = $request->input('limit') ?? 10;
        $search = $request->input('search');

        $items = $db->paginate((int)$limit);

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

    public function update(Request $request) // update
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
            $admin = Admin::find($request->id);
            $admin->update([
                'firstname' => $request->firstname,
                'lastname' => $request->lastname,
                'active' => 'Active'
            ]);
            return response()->json([
                'status' => true,
                'data' => $admin,
            ], 200);
        }

        // return response()->json(['test' => $request->id]);
    }

    public function updatePassword(Request $request) // update
    {
        $validated = Validator::make($request->all(), [
            'password' => 'required|min:4|max:12',
        ]);

        if ($validated->fails()) {
            return response()->json([
                'status' => false,
                'error' => $validated->messages(),
                'log' => '1',
            ], 422);
        } else {
            $admin = Admin::find($request->id);
            $admin->update([
                'password' => Hash::make($request->password),
                'remember_token' => Str::random(10),
            ]);
            return response()->json([
                'status' => true,
                'data' => $admin,
            ], 200);
        }

        // return response()->json(['test' => $request->id]);
    }

    public function login(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        if (!Auth::guard('admins')->attempt($validated)) {
            return response()->json([
                'status' => false,
                'message' => 'Login information invalid',
            ], 401);
        }

        $admin = Admin::where('email', $validated['email'])->first();
        // ->where('password', Hash::make($validated['password']))->first();
        $getUser = $admin;
        $access_token = $admin->createToken('api_token')->plainTextToken;
        $token_type = 'Bearer';
        $role = ['admin' => true];
        $getUser['email'] = $validated['email'];

        $response = array(
            'access_token' => $access_token,
            'token_type' => $token_type,
            'user' => $getUser,
            'role' => $role,
        );

        $token = JWT::encode($response);

        return response()->json([
            'token' => $token,
            'loginDate' => date("Y-m-d H:i:s"),
            'status' => true,
        ]);
    }

    public function register(Request $request)
    {
        $validated = $request->validate([
            'firstname' => 'required|max:100',
            'lastname' => 'required|max:100',
            'password' => 'required|min:4|max:12',
            'email' => 'required|max:255|email|unique:users,email',
        ]);

        // $user = User::create($validated);
        $user = Admin::create([
            'firstname' => $validated['firstname'],
            'lastname' => $validated['lastname'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'remember_token' => Str::random(10),
            'email_verified_at' => now(),
        ]);

        return response()->json([
            'status' => true,
            'data' => $user,
            // 'access_token' => $user->createToken('api_token')->plainTextToken,
            // 'token_type' => 'Bearer',
        ], 201);
    }

    public function logoff(Request $request)
    {
        $result = auth('sanctum')->user()->currentAccessToken()->delete();
        return response()->json([
            'status' => $result
        ]);
    }
}

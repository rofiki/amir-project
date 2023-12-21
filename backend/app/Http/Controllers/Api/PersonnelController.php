<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\PersonnelCollection;
use App\Http\Resources\PersonnelResource;
use App\Models\tbPersonnel;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Jerry\JWT\JWT;

class PersonnelController extends Controller
{
    public function index(Request $request) // show all
    {
        $db = new tbPersonnel;
        // $start = $request->input('start') ?? 0;
        $limit = $request->input('limit') ?? 25;
        $search = $request->input('search');

        $items = $db->paginate((int)$limit); 

        try {
            return new PersonnelCollection($items);
        } catch (\Exception $e) {
            return $this->returnError($e->getMessage());
        }
    }

    public function show($id) //show by id
    {
        $admin = tbPersonnel::where('id', $id)
            ->whereNull('deleted_at')->get()->first();
        if ($admin) {
            return new PersonnelResource($admin);
        }
        return response()->json(['message' => 'Not Found!'], 404);
    }

    public function store(Request $request) // add
    {
        $validated = Validator::make($request->all(), [
            // 'department_id' => 'required',
            'jobPosition' => 'required',
            // 'personnel_code' => 'required|min:2|max:255',
            'prename' => 'required',
            'fname' => 'required|min:2|max:255',
            'lname' => 'required|min:2|max:255',
            // 'nickname' => 'required|min:2|max:255',
            'gendar' => 'required',
            'date_of_birth' => 'required|min:2|max:255',
            'idcard' => 'required|min:2|max:255',
            // 'date_of_sign' => 'required|min:2|max:255',
            'password' => 'required|min:4',
            'email' => 'required|max:255|email|unique:users,email',
            // 'date_of_resign' => 'required|min:2|max:255',
        ]);
        
        if ($validated->fails()) {
            $response = response()->json(['status' => false, 'error' => $validated->messages()], 422);
        } else {

            $user = User::create([
                'name' => $request->fname . " " . $request->lname,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'remember_token' => Str::random(10),
                'user_type' => 'personnel',
                'email_verified_at' => now(),
            ]);


            $personnel = tbPersonnel::create([
                'user_id' => $user->id,
                'jobPosition_id' => $request->jobPosition,
                'personnel_code' => $request->personnel_code,
                'prename_id' => $request->prename,
                'firstname' => $request->fname,
                'lastname' => $request->lname,
                'nickname' => $request->nname,
                'gendar' => $request->gendar,
                'email' => $request->email,
                'date_of_birth' => $request->date_of_birth,
                'idcard' => $request->idcard,
                'date_of_sign' => $request->date_of_sign,
                'date_of_resign' => null,
                'active' => $request->active,
            ]);
            $response = response()->json(['status' => true, 'data' => $personnel], 200);
            
        }
        return $response;
    }

    public function update(Request $request, $id) // update
    {
        $validated = Validator::make($request->all(), [
            // 'department_id' => 'required',
            'jobPosition_id' => 'required',
            'personnel_code' => 'required|min:2|max:255',
            'prename_id' => 'required',
            'firstname' => 'required|min:2|max:255',
            'lastname' => 'required|min:2|max:255',
            // 'nickname' => 'required|min:2|max:255',
            'gendar' => 'required',
            'date_of_birth' => 'required|min:2|max:255',
            'idcard' => 'required|min:2|max:255',
            'date_of_sign' => 'required|min:2|max:255',
            // 'date_of_resign' => 'required|min:2|max:255',
        ]);

        if ($validated->fails()) {
            return response()->json([
                'status' => false,
                'error' => $validated->messages(),
                'log' => '1',
            ], 422);
        } else {
            $update = tbPersonnel::where('id', $id);
            $update->update([
                // 'user_id' => $user->id,
                'jobPosition_id' => $request->jobPosition_id,
                'personnel_code' => $request->personnel_code,
                'prename_id' => $request->prefix_id,
                'firstname' => $request->firstname,
                'lastname' => $request->lastname,
                'nickname' => $request->nickname,
                'gendar' => $request->gendar,
                // 'email' => $request->email,
                'date_of_birth' => $request->date_of_birth,
                'idcard' => $request->idcard,
                'date_of_sign' => $request->date_of_sign,
                'date_of_resign' => $request->date_of_resign,
                'active' => $request->active,
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

        $item = tbPersonnel::where('id', $id)->get()->first();
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
                'message' => 'Delete Success!'
            ],200);
        }
    }

}

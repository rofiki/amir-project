<?php

namespace App\Http\Controllers\Api\HomeMaker;

use App\Http\Controllers\Controller;
use App\Http\Resources\HomeMaker\HomemakerCollection;
use App\Http\Resources\HomeMaker\HomemakerResource;
use App\Models\HomeMaker\tbHomemaker;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Password;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class HomemakerController extends Controller
{
    public function index(Request $request) // show all
    {
        $model = new tbHomemaker;
        // $start = $request->input('start') ?? 0;
        $limit = $request->input('limit') ?? 25;
        $search = $request->input('search');

        $items = $model->paginate((int)$limit); 

        try {
            return new HomemakerCollection($items);
        } catch (\Exception $e) {
            return $this->returnError($e->getMessage());
        }
    }

    public function show($id) //show by id
    {
        $item = tbHomemaker::where('id', $id)->get()->first();
        if ($item) {
            return new HomemakerResource($item);
        }
        return response()->json(['message' => 'Not Found!'], 404);
    }

    public function store(Request $request)
    {

        $validated = Validator::make($request->all(), [
            // 'homemaker_code' => 'required|min:2|max:255',
            'prefix_id' => 'required',
            'firstname' => 'required|min:2|max:255',
            'lastname' => 'required|min:2|max:255',
            // 'nickname' => 'required|min:2|max:255',
            'gendar' => 'required',
            'idcard' => 'required|digits_between:13,13|numeric',
            'phone' => 'numeric',
            // 'date_of_sign' => 'required|min:2|max:255',
            // 'date_of_resign' => 'required|min:2|max:255',
            'email' => 'required|max:255|email|unique:users,email',
            'password' => 'required|min:4|max:12',
           
        ]);

        if ($validated->fails()) {
            $response = response()->json(['status' => false, 'error' => $validated->messages()], 422);
        } else {

            $user = User::create([
                'name' => $request->firstname . " " . $request->lastname,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'remember_token' => Str::random(10),
                'user_type' => 'homemaker',
                'email_verified_at' => now(),
            ]);

            $create = tbHomemaker::create([
                'user_id' => $user->id,
                'homemaker_code' => null,
                'prefix_id' => $request->prefix_id,
                'firstname' => $request->firstname,
                'lastname' => $request->lastname,
                'nickname' => $request->nickname,
                'address' => $request->address,
                'gendar' => $request->gendar,
                'date_of_birth' => $request->bdate,
                'idcard' => $request->idcard,
                'lineId' => $request->lineId,
                'phoneNumber' => $request->phone,
                'email' => $request->email,
                'date_of_sign' => $request->date_of_sign,
                'date_of_resign' => null,
                'active' => 'active',
            ]);
            $response = response()->json(['status' => true, 'data' => $create], 200);
        }
        return $response;
    }

    public function update(Request $request, $id) // update
    {
        $validated = Validator::make($request->all(), [
            // 'homemaker_code' => 'required|min:2|max:255',
            'prefix_id' => 'required',
            'firstname' => 'required|min:2|max:255',
            'lastname' => 'required|min:2|max:255',
            // 'nickname' => 'required|min:2|max:255',
            'gendar' => 'required',
            'idcard' => 'required|digits_between:13,13|numeric',
            'phone' => 'numeric',
            // 'date_of_sign' => 'required|min:2|max:255',
            // 'date_of_resign' => 'required|min:2|max:255',
            // 'email' => 'required|max:255|email|unique:users,email',
            // 'password' => 'required|min:4|max:12',
        ]);

        if ($validated->fails()) {
            return response()->json([
                'status' => false,
                'error' => $validated->messages(),
                'log' => '1',
            ], 422);
        } else {
            $update = tbHomemaker::where('id', $id);
            $update->update([
                // 'user_id' => $user->id,
                // 'homemaker_code' => null,
                'prefix_id' => $request->prefix_id,
                'firstname' => $request->firstname,
                'lastname' => $request->lastname,
                'nickname' => $request->nickname,
                'address' => $request->address,
                'gendar' => $request->gendar,
                'idcard' => $request->idcard,
                'lineId' => $request->lineId,
                'phoneNumber' => $request->phone,
                // 'email' => $request->email,
                'date_of_sign' => $request->date_of_sign,
                // 'date_of_resign' => null,
                // 'active' => 'active',
            ]);
            return response()->json([
                'status' => true,
                'data' => $update->get(),
            ], 200);
        }
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
            // $auth = Auth::where('id', $request->id);
            // // $auth->update([
            // //     'password' => Hash::make($validated['password']),
            // //     'remember_token' => Str::random(10),
            // // ]);
            // return response()->json([
            //     'status' => true,
            //     'test'=> $auth
            // ], 200);

            $status = Password::reset(
                $request->only('password'),
                function (User $user, string $password) {
                    $user->forceFill([
                        'password' => Hash::make($password)
                    ])->setRememberToken(Str::random(60));

                    $user->save();

                    // event(new PasswordReset($user));
                }
            );
            return $status;
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

        $item = tbHomemaker::where('id', $id)->get()->first();
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
                'message' => 'Delete Success!', 200
            ]);
        }
    }
}

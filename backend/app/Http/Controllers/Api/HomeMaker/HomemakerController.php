<?php

namespace App\Http\Controllers\Api\HomeMaker;

use App\Http\Controllers\Controller;
use App\Http\Resources\HomeMaker\HomemakerCollection;
use App\Http\Resources\HomeMaker\HomemakerResource;
use App\Models\HomeMaker\tbHomemaker;
use App\Models\Prename;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class HomemakerController extends Controller
{
    public function index(Request $request) // show all
    {
        $prename = new Prename;
        $model = new tbHomemaker;

        $tbPrename = $prename->getTable();
        $tbHomemaker = $model->getTable();

        // $start = $request->input('start') ?? 0;
        $limit = $request->input('limit') ?? 25;
        $search = $request->input('search');

        $items = $model->leftJoin($tbPrename, $tbHomemaker . '.prename_id', $tbPrename . '.id')
            ->select($tbHomemaker.'.*', $tbPrename.'.name', $tbPrename.'.gendar')
            ->whereNull('deleted_at')
            ->paginate((int)$limit);

        try {
            return new HomemakerCollection($items);
        } catch (\Exception $e) {
            return $this->returnError($e->getMessage());
        }
    }

    public function show($id) //show by id
    {

        $prename = new Prename;
        $model = new tbHomemaker;

        $tbPrename = $prename->getTable();
        $tbHomemaker = $model->getTable();

        $item = $model->leftJoin($tbPrename, $tbHomemaker . '.prename_id', $tbPrename . '.id')
            ->select($tbHomemaker.'.*', $tbPrename.'.name', $tbPrename.'.gendar')
            ->where($tbHomemaker.'.id', $id)
            ->whereNull('deleted_at')->get()->first();

        if ($item) {
            return new HomemakerResource($item);
        }
        return response()->json(['message' => 'Not Found!'], 404);
    }

    public function store(Request $request)
    {

        $validated = Validator::make($request->all(), [
            // 'homemaker_code' => 'required|min:2|max:255',
            'prename' => 'required',
            'fname' => 'required|min:2|max:255',
            'lname' => 'required|min:2|max:255',
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

            $remember_token = Str::random(10);
            $user = User::create([
                'name' => $request->fname . " " . $request->lname,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'remember_token' => $remember_token,
                'user_type' => 'homemaker',
                'email_verified_at' => now(),
            ]);

            $create = tbHomemaker::create([
                'user_id' => $user->id,
                'homemaker_code' => null,
                'prename_id' => $request->prename,
                'firstname' => $request->fname,
                'lastname' => $request->lname,
                'nickname' => $request->nname,
                'address' => $request->address,
                'gendar' => $request->gendar,
                // 'date_of_birth' => $request->bdate,
                'idcard' => $request->idcard,
                'lineId' => $request->lineId,
                'phoneNumber' => $request->phone,
                'email' => $request->email,
                'date_of_sign' => $request->date_of_sign,
                'date_of_resign' => null,
                'active' => $request->active,
            ]);
            $response = response()->json(['status' => true, 'data' => $create, 'remember_token' => $remember_token], 200);
        }
        return $response;
    }

    public function update(Request $request, $id) // update
    {
        $validated = Validator::make($request->all(), [
            // 'homemaker_code' => 'required|min:2|max:255',
            'prename' => 'required',
            'fname' => 'required|min:2|max:255',
            'lname' => 'required|min:2|max:255',
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
                'prename_id' => $request->prename,
                'firstname' => $request->fname,
                'lastname' => $request->lname,
                'nickname' => $request->nname,
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

    // update password ของแม่บ้าน
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
            $updatePass = User::where('id', $request->id);
            $updatePass->update([
                    'password' => Hash::make($request->password),
                    'remember_token' => Str::random(10),
                ]);
            return response()->json([
                'status' => true,
            ], 200);
        }
    }

    // ลบ แม่บ้าน
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

        // 1 ลบแม่บ้าน
        $item = tbHomemaker::where('id', $id)->get()->first();
        $uid = $item['user_id'];

        if (!$item->delete()) {
            return response()->json([
                'status' => false,
                'message' => 'Not Found!',
                'log' => 2
            ], 404);
        } else {
            
            // 2 ลบ user
            User::where('id', $uid)->delete();
            return response()->json([
                'status' => true,
                'message' => 'Delete Success!', 200
            ]);
        }
    }
}

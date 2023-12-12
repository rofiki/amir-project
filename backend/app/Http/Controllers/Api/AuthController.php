<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use App\Models\Employee;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Jerry\JWT\JWT;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        if (!Auth::attempt($validated)) {
            return response()->json([
                'status' => false,
                'message' => 'Login information invalid',
            ], 401);
        }

        $user = User::where('email', $validated['email'])->first();

        $getUser = Admin::where('user_id', $user->id)->first();
        $access_token = $user->createToken('api_token')->plainTextToken;
        $token_type = 'Bearer';
        $role = ['admin' => 'admin'];
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
            'name' => 'required|max:255',
            'password' => 'required|min:6',
            'email' => 'required|max:255|email|unique:users,email',
        ]);

        // $user = User::create($validated);
        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'remember_token' => Str::random(10),
            'email_verified_at' => now(),
        ]);

        return response()->json([
            'data' => $user,
            // 'access_token' => $user->createToken('api_token')->plainTextToken,
            // 'token_type' => 'Bearer',
        ], 201);
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

                    event(new PasswordReset($user));
                }
            );
            return $status;
        }
    }

    public function logoff(Request $request)
    {
        $result = auth('sanctum')->user()->currentAccessToken()->delete();
        return response()->json([
            'status' => $result
        ]);
    }
}

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\province\ProvinceCollection;
use App\Http\Resources\province\ProvinceResource;
use App\Models\province\Amphur;
use App\Models\province\Province;
use Illuminate\Http\Request;

class ProvinceController extends Controller
{
    public function index(Request $request) // show all
    {
        try {
            // return new ProvinceCollection($items);
            $items = Province::get();
            return response()->json(['status' => true, 'data' => $items], 200);
        } catch (\Exception $e) {
            return $this->returnError($e->getMessage());
        }
    }

    public function show(Request $request, Province $province) //show by id
    {
        $amphur = Amphur::where(
            $province->getKeyName(),$province->getKey()
        )->get();

        $province['amphur'] = $amphur;
        // return new ProvinceResource($province);
        return response()->json(['status' => true, 'data' => $province], 200);
    }
}

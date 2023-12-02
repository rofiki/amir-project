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
        $db = new Province;
        $limit = $request->input('limit') ?? 25;
        $search = $request->input('search');

        $items = $db->paginate((int)$limit);

        try {
            return new ProvinceCollection($items);
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
        return new ProvinceResource($province);
    }
}

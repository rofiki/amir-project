<?php

namespace App\Http\Controllers;

use App\Http\Resources\PrenameCollection;
use App\Http\Resources\PrenameResource;
use App\Models\Prename;
use Illuminate\Http\Request;

class PrenameController extends Controller
{

    public function index(Request $request)
    {
        
        $limit = $request->input('limit') ?? 25;
        $search = $request->input('search');

        $items = Prename::where('name', 'Like', '%' . $search . '%')
            ->paginate((int)$limit);
        try {
            return new PrenameCollection($items); 
        } catch (\Exception $e) {
            return response()->json(['message' => 'Bad request'], 400);
        }
    }

    public function show($id) //show by id
    {
        $item = Prename::where('id', $id)->get()->first();
        if ($item) {
            return new PrenameResource($item);
        }
        return response()->json(['message' => 'Not Found!'], 404);
    }

}

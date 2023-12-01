<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CompanyController extends Controller
{
    //
    public function index(Request $request)
    {
        $db = new Company;
        $start = $request->input('start') ?? 0;
        $limit = $request->input('limit') ?? 10;

        $search = $request->input('search');

        $count = $db->count();
        $items = $db->offset($start)->limit($limit)
            ->get();        

        try {
            return response()->json(
                [ 
                    'data' => $items, 'count' => $count, 
                    'current_page' => [
                        'start' => (int)$start, 'limit' => (int)$limit
                    ]                    
                    // 'sql'=> $this->db->toSql() 
                ]
            );
        } catch (\Exception $e) {
            return $this->returnError($e->getMessage());
        }

        // return Company::all();
    }
}

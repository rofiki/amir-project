<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CompanyCollection;
use App\Http\Resources\CompanyResource;
use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CompanyController extends Controller
{
    //
    public function index(Request $request) // show all
    {
        $db = new Company;
        // $start = $request->input('start') ?? 0;
        $limit = $request->input('limit') ?? 10;
        $search = $request->input('search');

        $items = $db->paginate((int)$limit); 

        try {
            return new CompanyCollection($items);
        } catch (\Exception $e) {
            return $this->returnError($e->getMessage());
        }
    }

    public function show(Request $request, Company $company) //show by id
    {
        return new CompanyResource($company);
    }

    public function condition()
    {

    }

    public function store(Request $request) // add
    {
        $validated = Validator::make($request->all(), [
            'name' => 'required|min:2|max:255'
        ]);
        
        if ($validated->fails()) {
            $response = response()->json(['status' => false, 'error' => $validated->messages()], 422);
        } else {
            // $validated['name'] ='555555'; กรณีเปลี่ยนค่า
            $company = Company::create($validated);
            $response =new CompanyResource($company);
        }
        return $response;
    }

    public function update(Request $request, Company $company) // update
    {
        $validated = Validator::make($request->all(), [
            'name' => 'required|min:2|max:255'
        ]);
        
        if ($validated->fails()) {
            $response = response()->json(['status' => false, 'error' => $validated->messages()], 422);
        } else {
            $company->update([
                'name' => $request->name
            ]);
            $response =new CompanyResource($company);
        }
        return $response;
    }

    public function destroy(Request $request, Company $company) // delete
    {
        try {
            $company->delete();
            return response()->json(['status' => true,], 200);
        }catch(\Exception $e){
            return response()->json(['status' => false,], 404);
        }
        return response()->json(['status' => false,], 500);
    }

  
}

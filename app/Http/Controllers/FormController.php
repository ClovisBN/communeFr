<?php

namespace App\Http\Controllers;

use App\Models\Form;
use Illuminate\Http\Request;

class FormController extends Controller
{
    public function index()
    {
        $forms = Form::all();
        return response()->json($forms);
    }

    public function store(Request $request)
    {
        $form = Form::create([
            'title' => $request->input('title'),
            'description' => $request->input('description'),
            'questions' => json_encode($request->input('questions'))
        ]);
        return response()->json($form, 201);
    }

    public function show($id)
    {
        $form = Form::find($id);
        return response()->json($form);
    }

    public function update(Request $request, $id)
    {
        $form = Form::findOrFail($id);
        $form->update([
            'title' => $request->input('title'),
            'description' => $request->input('description'),
            'questions' => json_encode($request->input('questions'))
        ]);
        return response()->json($form, 200);
    }

    public function destroy($id)
    {
        Form::destroy($id);
        return response()->json(null, 204);
    }
}

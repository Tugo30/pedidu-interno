<?php

namespace App\Http\Controllers;

use App\Models\ClientGroup;
use Illuminate\Http\Request;

class ClientGroupController extends Controller
{
    public function index()
    {
        return view('client-groups.index');
    }
    public function data()
    {
        return response()->json(ClientGroup::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nome' => 'required|string|max:100|unique:client_groups,nome',
        ], [
            'nome.unique' => 'Esse grupo já existe.',
        ]);
        return response()->json(ClientGroup::create($validated), 201);
    }

    public function destroy($id)
    {
        ClientGroup::findOrFail($id)->delete();
        return response()->json(['message' => 'Grupo excluído!']);
    }
}

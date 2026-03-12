<?php

namespace App\Http\Controllers;

use App\Models\Client;
use Illuminate\Http\Request;

class ClientController extends Controller
{
    public function index()
    {
        return view('clients.index');
    }
    public function create()
    {
        return view('clients.create');
    }

    public function data()
    {
        $clients = Client::with('group')->orderBy('nome')->get();
        return response()->json($clients);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'group_id'    => 'nullable|exists:client_groups,id',
            'tipo'        => 'required|in:PJ,PF',
            'nome'        => 'required|string|max:150',
            'razao_social' => 'nullable|string|max:150',
            'cnpj'        => 'nullable|string|unique:clients,cnpj',
            'cpf'         => 'nullable|string|unique:clients,cpf',
            'telefone'    => 'nullable|string|max:20',
            'email'       => 'required|email|unique:clients,email',
            'password'    => 'required|confirmed|min:6',
            'endereco'    => 'nullable|string|max:255',
            'cidade'      => 'nullable|string|max:100',
            'estado'      => 'nullable|string|max:2',
            'cep'         => 'nullable|string|max:9',
        ], [
            'nome.required'     => 'O nome é obrigatório.',
            'cnpj.required'     => 'O CNPJ é obrigatório.',
            'cnpj.unique'       => 'Este CNPJ já está cadastrado.',
            'email.required'    => 'O e-mail é obrigatório.',
            'email.unique'      => 'Este e-mail já está cadastrado.',
            'password.required' => 'A senha é obrigatória.',
            'password.confirmed' => 'As senhas não coincidem.',
            'password.min'      => 'A senha deve ter no mínimo 6 caracteres.',
        ]);

        $validated['password'] = bcrypt($validated['password']);
        $client = Client::create($validated);

        return response()->json($client, 201);
    }

    public function show($id)
    {
        return response()->json(Client::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $client = Client::findOrFail($id);

        $validated = $request->validate([
            'group_id'    => 'nullable|exists:client_groups,id',
            'tipo'        => 'required|in:PJ,PF',
            'nome'        => 'required|string|max:150',
            'razao_social' => 'nullable|string|max:150',
            'cnpj'        => 'nullable|string|unique:clients,cnpj,' . $id,
            'cpf'         => 'nullable|string|unique:clients,cpf,' . $id,
            'telefone'    => 'nullable|string|max:20',
            'email'       => 'required|email|unique:clients,email,' . $id,
            'password'    => 'nullable|confirmed|min:6',
            'endereco'    => 'nullable|string|max:255',
            'cidade'      => 'nullable|string|max:100',
            'estado'      => 'nullable|string|max:2',
            'cep'         => 'nullable|string|max:9',
        ]);

        if (empty($validated['password'])) {
            unset($validated['password']);
        } else {
            $validated['password'] = bcrypt($validated['password']);
        }

        $client->update($validated);
        return response()->json($client);
    }

    public function edit($id)
    {
        $groups = \App\Models\ClientGroup::all();
        return view('clients.edit', compact('groups'))->with('clientId', $id);
    }

    public function toggle($id)
    {
        $client = Client::findOrFail($id);
        $client->active = !$client->active;
        $client->save();
        return response()->json(['active' => $client->active]);
    }

    public function destroy($id)
    {
        Client::findOrFail($id)->delete();
        return response()->json(['message' => 'Cliente excluído!']);
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Service;
use App\Models\Category;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    public function index()
    {
        $categories = Category::all();
        return view('services.index', compact('categories'));
    }

    public function data()
    {
        return response()->json(
            Service::with('category')
                ->select('id', 'category_id', 'nome', 'descricao', 'tipo_cobranca', 'periodicidade', 'preco', 'preco_mensal', 'preco_trimestral', 'preco_semestral', 'preco_anual', 'active')
                ->get()
        );
    }

    public function store(Request $request)
    {
        // return response()->json($request->all()); // ← temporário
        $validated = $request->validate([
            'category_id'      => 'required|exists:categories,id',
            'nome'             => 'required|string|max:150',
            'descricao'        => 'nullable|string',
            'tipo_cobranca'    => 'required|in:gratuito,uma_vez,recorrente',
            'periodicidade'    => 'nullable|in:mensal,trimestral,semestral,anual',
            'preco'            => 'nullable|numeric|min:0',
            'preco_mensal'     => 'nullable|numeric|min:0',
            'preco_trimestral' => 'nullable|numeric|min:0',
            'preco_semestral'  => 'nullable|numeric|min:0',
            'preco_anual'      => 'nullable|numeric|min:0',
        ]);

        return response()->json(Service::create($validated), 201);
    }

    public function update(Request $request, $id)
    {
        $service = Service::findOrFail($id);

        $validated = $request->validate([
            'category_id'      => 'required|exists:categories,id',
            'nome'             => 'required|string|max:150',
            'descricao'        => 'nullable|string',
            'tipo_cobranca'    => 'required|in:gratuito,uma_vez,recorrente',
            'periodicidade'    => 'nullable|in:mensal,trimestral,semestral,anual',
            'preco'            => 'nullable|numeric|min:0',
            'preco_mensal'     => 'nullable|numeric|min:0',
            'preco_trimestral' => 'nullable|numeric|min:0',
            'preco_semestral'  => 'nullable|numeric|min:0',
            'preco_anual'      => 'nullable|numeric|min:0',
        ]);

        $service->update($validated);
        return response()->json($service);
    }

    public function toggle($id)
    {
        $service = Service::findOrFail($id);
        $service->active = !$service->active;
        $service->save();
        return response()->json(['active' => $service->active]);
    }

    public function destroy($id)
    {
        Service::findOrFail($id)->delete();
        return response()->json(['message' => 'Excluído com sucesso!']);
    }
}

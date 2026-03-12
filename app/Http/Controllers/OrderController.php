<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Coupon;
use App\Models\Service;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function index()
    {
        return view('orders.index');
    }

    public function create()
    {
        $clients        = \App\Models\Client::where('active', true)->get(['id', 'nome', 'email']);
        $paymentMethods = \App\Models\PaymentMethod::all(['id', 'nome']);
        $services       = Service::where('active', true)
            ->get(['id', 'nome', 'tipo_cobranca', 'periodicidade', 'preco', 'preco_mensal', 'preco_trimestral', 'preco_semestral', 'preco_anual']);
        return view('orders.create', compact('clients', 'paymentMethods', 'services'));
    }

    public function data()
    {
        $orders = Order::with(['client', 'paymentMethod', 'coupon', 'items.service'])
            ->orderByDesc('created_at')
            ->get();
        return response()->json($orders);
    }

    public function store(Request $request)
    {
        $request->validate([
            'client_id'         => 'required|exists:clients,id',
            'payment_method_id' => 'nullable|exists:payment_methods,id',
            'coupon_code'       => 'nullable|string',
            'status'            => 'required|in:pendente,confirmado,cancelado',
            'items'             => 'required|array|min:1',
            'items.*.service_id'       => 'required|exists:services,id',
            'items.*.ciclo'            => 'required|in:mensal,trimestral,semestral,anual,uma_vez,gratuito',
            'items.*.quantidade'       => 'required|integer|min:1',
            'items.*.dominio'          => 'nullable|string|max:255',
            'items.*.preco_substituido' => 'nullable|numeric|min:0',
        ]);

        // Resolve cupom
        $coupon = null;
        if ($request->coupon_code) {
            $coupon = Coupon::where('codigo', $request->coupon_code)
                ->where('active', true)
                ->first();
            if (!$coupon) {
                return response()->json(['errors' => ['coupon_code' => ['Cupom inválido ou expirado.']]], 422);
            }
        }

        // Calcula itens
        $itemsData = [];
        $subtotalGeral = 0;

        foreach ($request->items as $item) {
            $service = Service::findOrFail($item['service_id']);
            $precoUnitario = $this->getPreco($service, $item['ciclo']);

            // Substituir preço se informado
            if (!empty($item['preco_substituido'])) {
                $precoUnitario = (float) $item['preco_substituido'];
            }

            $subtotal = $precoUnitario * (int) $item['quantidade'];
            $subtotalGeral += $subtotal;

            $itemsData[] = [
                'service_id'       => $item['service_id'],
                'dominio'          => $item['dominio'] ?? null,
                'ciclo'            => $item['ciclo'],
                'quantidade'       => $item['quantidade'],
                'preco_unitario'   => $precoUnitario,
                'preco_substituido' => $item['preco_substituido'] ?? null,
                'subtotal'         => $subtotal,
            ];
        }

        // Aplica desconto do cupom
        $total = $subtotalGeral;
        if ($coupon) {
            if ($coupon->tipo === 'percentual') {
                $total = $subtotalGeral - ($subtotalGeral * $coupon->valor / 100);
            } else {
                $total = max(0, $subtotalGeral - $coupon->valor);
            }
        }

        // Cria pedido
        $order = Order::create([
            'client_id'         => $request->client_id,
            'payment_method_id' => $request->payment_method_id,
            'coupon_id'         => $coupon?->id,
            'status'            => $request->status,
            'total'             => $total,
        ]);

        foreach ($itemsData as $item) {
            $order->items()->create($item);
        }

        return response()->json($order->load(['client', 'paymentMethod', 'coupon', 'items.service']), 201);
    }

    public function byClient()
    {
        $clients = \App\Models\Client::with(['orders' => function ($q) {
            $q->with(['paymentMethod', 'coupon', 'items.service'])->orderByDesc('created_at');
        }])
            ->whereHas('orders')
            ->orderBy('nome')
            ->get(['id', 'nome', 'email', 'tipo']);

        return response()->json($clients);
    }

    public function byClientView()
    {
        return view('orders.by-client');
    }

    public function show($id)
    {
        return response()->json(
            Order::with(['client', 'paymentMethod', 'coupon', 'items.service'])->findOrFail($id)
        );
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate(['status' => 'required|in:pendente,confirmado,cancelado']);
        $order = Order::findOrFail($id);
        $order->update(['status' => $request->status]);
        return response()->json($order);
    }

    public function destroy($id)
    {
        Order::findOrFail($id)->delete();
        return response()->json(['message' => 'Pedido excluído!']);
    }

    private function getPreco(Service $service, string $ciclo): float
    {
        return match ($ciclo) {
            'mensal'      => (float) ($service->preco_mensal     ?? 0),
            'trimestral'  => (float) ($service->preco_trimestral ?? 0),
            'semestral'   => (float) ($service->preco_semestral  ?? 0),
            'anual'       => (float) ($service->preco_anual      ?? 0),
            'uma_vez'     => (float) ($service->preco            ?? 0),
            default       => 0,
        };
    }

    public function checkCoupon(Request $request)
    {
        $coupon = Coupon::where('codigo', $request->code)
            ->where('active', true)
            ->first();
        if (!$coupon) abort(404);
        return response()->json($coupon);
    }
}

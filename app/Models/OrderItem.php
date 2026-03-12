<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    protected $fillable = ['order_id', 'service_id', 'dominio', 'ciclo', 'quantidade', 'preco_unitario', 'preco_substituido', 'subtotal'];
    public function service() { return $this->belongsTo(Service::class); }
    public function order()   { return $this->belongsTo(Order::class); }
}
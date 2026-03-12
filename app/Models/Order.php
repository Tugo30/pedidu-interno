<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Order extends Model
{
    use SoftDeletes;
    protected $fillable = ['client_id', 'payment_method_id', 'coupon_id', 'status', 'total'];

    public function client()        { return $this->belongsTo(Client::class); }
    public function paymentMethod() { return $this->belongsTo(PaymentMethod::class); }
    public function coupon()        { return $this->belongsTo(Coupon::class); }
    public function items()         { return $this->hasMany(OrderItem::class); }
}
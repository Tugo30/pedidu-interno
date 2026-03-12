<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Client extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'group_id',
        'tipo',
        'nome',
        'razao_social',
        'cnpj',
        'cpf',
        'telefone',
        'email',
        'password',
        'endereco',
        'cidade',
        'estado',
        'cep',
        'active'
    ];

    protected $hidden = ['password'];

    public function orders()
    {
        return $this->hasMany(\App\Models\Order::class);
    }

    public function group()
    {
        return $this->belongsTo(ClientGroup::class, 'group_id');
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Service extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'category_id',
        'nome',
        'descricao',
        'preco',
        'preco_mensal',
        'preco_trimestral',
        'preco_semestral',
        'preco_anual',
        'tipo_cobranca',
        'periodicidade',
        'active'
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}

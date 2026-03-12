<?php

namespace App\Models;

use App\Models\Role;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticable;

class User extends Authenticable
{
    use SoftDeletes;

    protected $fillable = [
        'role_id',
        'name',
        'email',
        'username',
        'password',
    ];

    protected $hidden = [
        'password',
        'token'
    ];

    public function role()
    {
        return $this->belongsTo(Role::class);
    }
}

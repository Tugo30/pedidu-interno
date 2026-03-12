<?php

use App\Models\User;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->get('/users', function () {
    return User::with('role')->get();
});
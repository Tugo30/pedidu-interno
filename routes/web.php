<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\MainController;
use App\Http\Controllers\CreateAdmin;
use App\Http\Controllers\PaymentMethodController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\ClientGroupController;
use App\Http\Controllers\OrderController;

//usuarios nao autenticados
Route::middleware('guest')->group(function () {

    // login routes
    Route::get('/login', [AuthController::class, 'login'])->name('login');
    Route::post('/login', [AuthController::class, 'authenticate'])->name('authenticate');

    // registrarion routes
    Route::get('/register', [AuthController::class, 'register'])->name('register');
    Route::post('/register', [AuthController::class, 'store_user'])->name('store_user');

    // new user confirmation
    Route::get('/new_user_confirmation/{token}', [AuthController::class, 'new_user_confirmation'])->name('new_user_confirmation');

    // forgot password
    Route::get('/forgot_password', [AuthController::class, 'forgot_password'])->name('forgot_password');
    Route::post('/forgot_password', [AuthController::class, 'send_reset_password_link'])->name('send_reset_password_link');

    // reset passsword
    Route::get('/reset_password/{token}', [AuthController::class, 'reset_password'])->name('reset_password');
    Route::post('/reset_password', [AuthController::class, 'reset_password_update'])->name('reset_password_update');
});

Route::middleware('auth')->group(function () {

    ## LOGIN /  USUÁRIO

    //entradaa
    Route::get('/', [MainController::class, 'home'])->name('home');

    // profile - change pasword
    Route::get('/profile', [AuthController::class, 'profile'])->name('profile');
    Route::post('/profile', [AuthController::class, 'change_password'])->name('change_password');
    Route::post('/profile/password', [AuthController::class, 'changePasswordApi'])->name('profile.password');
    Route::delete('/profile/account', [AuthController::class, 'deleteAccountApi'])->name('profile.account');

    // delete accout
    Route::post('/deleted_account', [AuthController::class, 'deleted_account'])->name('deleted_account');

    // logout
    Route::get('/logout', [AuthController::class, 'logout'])->name('logout');

    ## DASHBOARD
    Route::get('/dashboard/data', [MainController::class, 'dashboardData'])->name('dashboard.data');

    ## USUÁRIOS
    Route::get('/create_admin', [CreateAdmin::class, 'create'])->name('create');
    Route::post('/users', [CreateAdmin::class, 'store'])->name('users.store');
    Route::get('/users', [CreateAdmin::class, 'index'])->name('users.index');
    Route::get('/users/data', [CreateAdmin::class, 'data'])->name('users.data');
    Route::patch('/users/{id}/toggle', [CreateAdmin::class, 'toggle'])->name('users.toggle');
    Route::delete('/users/{id}', [CreateAdmin::class, 'destroy'])->name('users.destroy');

    ## EDITAR USUÁRIOS
    Route::get('/users/{id}/edit', [CreateAdmin::class, 'edit'])->name('users.edit');
    Route::get('/users/{id}/edit-data', [CreateAdmin::class, 'editData'])->name('users.edit-data');
    Route::put('/users/{id}', [CreateAdmin::class, 'update'])->name('users.update');

    ## FORMAS DE PAGAMENTO
    Route::get('/payment-methods', [PaymentMethodController::class, 'index'])->name('payment-methods.index');
    Route::get('/payment-methods/data', [PaymentMethodController::class, 'data'])->name('payment-methods.data');
    Route::post('/payment-methods', [PaymentMethodController::class, 'store'])->name('payment-methods.store');
    Route::delete('/payment-methods/{id}', [PaymentMethodController::class, 'destroy'])->name('payment-methods.destroy');

    ## CATEGORIAS
    Route::get('/categories', [CategoryController::class, 'index'])->name('categories.index');
    Route::get('/categories/data', [CategoryController::class, 'data'])->name('categories.data');
    Route::post('/categories', [CategoryController::class, 'store'])->name('categories.store');
    Route::delete('/categories/{id}', [CategoryController::class, 'destroy'])->name('categories.destroy');

    ## SERVIÇOS
    Route::get('/services', [ServiceController::class, 'index'])->name('services.index');
    Route::get('/services/data', [ServiceController::class, 'data'])->name('services.data');
    Route::post('/services', [ServiceController::class, 'store'])->name('services.store');
    Route::put('/services/{id}', [ServiceController::class, 'update'])->name('services.update');
    Route::patch('/services/{id}/toggle', [ServiceController::class, 'toggle'])->name('services.toggle');
    Route::delete('/services/{id}', [ServiceController::class, 'destroy'])->name('services.destroy');

    ## CLIENTES
    Route::get('/clients', [ClientController::class, 'index'])->name('clients.index');
    Route::get('/clients/create', [ClientController::class, 'create'])->name('clients.create');
    Route::get('/clients/data', [ClientController::class, 'data'])->name('clients.data');
    Route::post('/clients', [ClientController::class, 'store'])->name('clients.store');

    ## CLIENTES - ROTAS COM ID
    Route::get('/clients/{id}/edit', [ClientController::class, 'edit'])->name('clients.edit');
    Route::get('/clients/{id}', [ClientController::class, 'show'])->name('clients.show');
    Route::put('/clients/{id}', [ClientController::class, 'update'])->name('clients.update');
    Route::patch('/clients/{id}/toggle', [ClientController::class, 'toggle'])->name('clients.toggle');
    Route::delete('/clients/{id}', [ClientController::class, 'destroy'])->name('clients.destroy');

    ## GRUPOS DE CLIENTES
    Route::get('/client-groups', [ClientGroupController::class, 'index'])->name('client-groups.index');
    Route::get('/client-groups/data', [ClientGroupController::class, 'data'])->name('client-groups.data');
    Route::post('/client-groups', [ClientGroupController::class, 'store'])->name('client-groups.store');
    Route::delete('/client-groups/{id}', [ClientGroupController::class, 'destroy'])->name('client-groups.destroy');

    ## ORDEM SERVIÇO
    Route::get('/orders',              [OrderController::class, 'index'])->name('orders.index');
    Route::get('/orders/create',       [OrderController::class, 'create'])->name('orders.create');
    Route::get('/orders/data',         [OrderController::class, 'data'])->name('orders.data');
    Route::post('/orders',             [OrderController::class, 'store'])->name('orders.store');
    Route::get('/orders/by-client',      [OrderController::class, 'byClientView']);
    Route::get('/orders/by-client/data', [OrderController::class, 'byClient']);
    Route::get('/orders/{id}',         [OrderController::class, 'show'])->name('orders.show');
    Route::patch('/orders/{id}/status', [OrderController::class, 'updateStatus'])->name('orders.status');
    Route::delete('/orders/{id}',      [OrderController::class, 'destroy'])->name('orders.destroy');
    Route::get('/orders/coupon-check', [OrderController::class, 'checkCoupon'])->name('orders.coupon-check');
});

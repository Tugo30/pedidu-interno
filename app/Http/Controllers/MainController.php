<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\View\View;
use App\Models\User;
use App\Models\Service;
use App\Models\Category;
use App\Models\PaymentMethod;

class MainController extends Controller
{
    public function home(): View
    {
        $user = Auth::user();

        return view('home', [
            'user' => $user
        ]);
    }

    public function dashboardData()
    {
        return response()->json([
            'total_users'           => User::count(),
            'active_users'          => User::where('active', 1)->count(),
            'inactive_users'        => User::where('active', 0)->orWhereNull('active')->count(),
            'total_services'        => Service::count(),
            'total_categories'      => Category::count(),
            'total_payment_methods' => PaymentMethod::count(),
        ]);
    }
}

<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TransactionController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Auth::user()->transactions()->latest();

        if ($request->filled('type') && in_array($request->type, ['buy', 'sell'])) {
            $query->where('type', $request->type);
        }

        if ($request->filled('min_amount') && is_numeric($request->min_amount)) {
            $query->where('amount_brl', '>=', $request->min_amount);
        }

        return response()->json($query->get());
    }
}

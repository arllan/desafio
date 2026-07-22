<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class WalletController extends Controller
{
    public function show(): JsonResponse
    {
        $wallet = Auth::user()->wallet;

        return response()->json([
            'balance_brl' => $wallet->balance_brl,
            'balance_btc' => $wallet->balance_btc,
        ]);
    }
}

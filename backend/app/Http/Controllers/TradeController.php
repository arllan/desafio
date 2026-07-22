<?php

namespace App\Http\Controllers;

use App\Http\Requests\Trade\BuyRequest;
use App\Http\Requests\Trade\SellRequest;
use App\Services\TradeService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use RuntimeException;

class TradeController extends Controller
{
    public function __construct(private readonly TradeService $tradeService) {}

    public function buy(BuyRequest $request): JsonResponse
    {
        try {
            $transaction = $this->tradeService->buy(
                Auth::user(),
                (string) $request->input('amount_brl')
            );

            return response()->json($transaction, 201);
        } catch (RuntimeException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    public function sell(SellRequest $request): JsonResponse
    {
        try {
            $transaction = $this->tradeService->sell(
                Auth::user(),
                (string) $request->input('amount_btc')
            );

            return response()->json($transaction, 201);
        } catch (RuntimeException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }
}

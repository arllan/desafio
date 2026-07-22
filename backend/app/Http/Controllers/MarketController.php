<?php

namespace App\Http\Controllers;

use App\Services\MarketService;
use Illuminate\Http\JsonResponse;

class MarketController extends Controller
{
    public function __construct(private readonly MarketService $marketService) {}

    public function btcPrice(): JsonResponse
    {
        return response()->json([
            'currency' => 'BRL',
            'price'    => $this->marketService->getBtcPrice(),
        ]);
    }
}

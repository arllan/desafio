<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\MarketController;
use App\Http\Controllers\TradeController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\WalletController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me',         [AuthController::class, 'me']);
    Route::post('/logout',    [AuthController::class, 'logout']);

    Route::get('/wallet',     [WalletController::class, 'show']);

    Route::get('/market/btc', [MarketController::class, 'btcPrice']);

    Route::post('/trade/buy',  [TradeController::class, 'buy']);
    Route::post('/trade/sell', [TradeController::class, 'sell']);

    Route::get('/transactions', [TransactionController::class, 'index']);
});

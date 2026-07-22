<?php

namespace App\Services;

use App\Models\Transaction;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class TradeService
{
    public function __construct(private readonly MarketService $marketService) {}

    public function buy(User $user, string $amountBrl): Transaction
    {
        $btcPrice = $this->marketService->getBtcPrice();
        $wallet   = $user->wallet;

        if (bccomp($wallet->balance_brl, $amountBrl, 2) < 0) {
            throw new RuntimeException('Saldo em reais insuficiente.');
        }

        $amountBtc = bcdiv($amountBrl, $btcPrice, 8);

        return DB::transaction(function () use ($user, $wallet, $amountBrl, $amountBtc, $btcPrice) {
            $wallet->balance_brl = bcsub($wallet->balance_brl, $amountBrl, 2);
            $wallet->balance_btc = bcadd($wallet->balance_btc, $amountBtc, 8);
            $wallet->save();

            return Transaction::create([
                'user_id'    => $user->id,
                'type'       => 'buy',
                'amount_brl' => $amountBrl,
                'amount_btc' => $amountBtc,
                'btc_price'  => $btcPrice,
            ]);
        });
    }

    public function sell(User $user, string $amountBtc): Transaction
    {
        $btcPrice = $this->marketService->getBtcPrice();
        $wallet   = $user->wallet;

        if (bccomp($wallet->balance_btc, $amountBtc, 8) < 0) {
            throw new RuntimeException('Saldo em BTC insuficiente.');
        }

        $amountBrl = bcmul($amountBtc, $btcPrice, 2);

        return DB::transaction(function () use ($user, $wallet, $amountBtc, $amountBrl, $btcPrice) {
            $wallet->balance_btc = bcsub($wallet->balance_btc, $amountBtc, 8);
            $wallet->balance_brl = bcadd($wallet->balance_brl, $amountBrl, 2);
            $wallet->save();

            return Transaction::create([
                'user_id'    => $user->id,
                'type'       => 'sell',
                'amount_brl' => $amountBrl,
                'amount_btc' => $amountBtc,
                'btc_price'  => $btcPrice,
            ]);
        });
    }
}

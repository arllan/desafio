<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;

class MarketService
{
    private const CACHE_KEY = 'btc_price';
    private const CACHE_TTL = 30;

    public function getBtcPrice(): string
    {
        return Cache::remember(self::CACHE_KEY, self::CACHE_TTL, function () {
            return number_format(random_int(200_000_00, 300_000_00) / 100, 2, '.', '');
        });
    }
}

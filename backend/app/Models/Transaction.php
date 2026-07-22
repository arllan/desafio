<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Transaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'type',
        'amount_brl',
        'amount_btc',
        'btc_price',
    ];

    protected function casts(): array
    {
        return [
            'amount_brl' => 'decimal:2',
            'amount_btc' => 'decimal:8',
            'btc_price'  => 'decimal:2',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}

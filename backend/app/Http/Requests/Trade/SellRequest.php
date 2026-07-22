<?php

namespace App\Http\Requests\Trade;

use Illuminate\Foundation\Http\FormRequest;

class SellRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'amount_btc' => ['required', 'numeric', 'min:0.00000001'],
        ];
    }
}

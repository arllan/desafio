<?php

namespace App\Http\Requests\Trade;

use Illuminate\Foundation\Http\FormRequest;

class BuyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'amount_brl' => ['required', 'numeric', 'min:0.01'],
        ];
    }
}

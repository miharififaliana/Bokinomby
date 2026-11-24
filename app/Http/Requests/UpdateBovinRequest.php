<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateBovinRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'signe_particulier' => $this->lines('signe_particulier'),
            'dossier_sante' => $this->lines('dossier_sante'),
        ]);
    }

    public function rules(): array
    {
        return [
            'sexe' => ['required', Rule::in(['male', 'femelle'])],
            'date_naissance' => ['required', 'date', 'before_or_equal:today'],
            'date_deces' => ['nullable', 'date', 'after_or_equal:date_naissance'],
            'signe_particulier' => ['nullable', 'array', 'max:10'],
            'signe_particulier.*' => ['string', 'max:120'],
            'dossier_sante' => ['nullable', 'array', 'max:20'],
            'dossier_sante.*' => ['string', 'max:255'],
        ];
    }

    private function lines(string $field): ?array
    {
        $value = $this->input($field);

        if (is_array($value)) {
            $lines = $value;
        } elseif (is_string($value)) {
            $lines = preg_split('/\r\n|\r|\n/', $value);
        } else {
            return null;
        }

        $lines = array_values(array_filter(
            array_map(fn ($line) => trim((string) $line), $lines),
            fn ($line) => $line !== '',
        ));

        return $lines === [] ? null : $lines;
    }
}
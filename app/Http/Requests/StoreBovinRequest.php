<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreBovinRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Normalise les listes saisies une ligne à la fois.
     */
    protected function prepareForValidation(): void
    {
        $this->merge([
            'signe_particulier' => $this->lines('signe_particulier'),
            'dossier_sante' => $this->lines('dossier_sante'),
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'proprietaire_id' => [
                'required',
                'integer',
                Rule::exists('users', 'id')->where('role', 'employer'),
            ],
            'sexe' => ['required', Rule::in(['male', 'femelle'])],
            'date_naissance' => ['required', 'date', 'before_or_equal:today'],
            'date_deces' => ['nullable', 'date', 'after_or_equal:date_naissance'],
            'commune_id' => ['required', 'integer', Rule::exists('communes', 'id')],
            'signe_particulier' => ['nullable', 'array', 'max:10'],
            'signe_particulier.*' => ['string', 'max:120'],
            'dossier_sante' => ['nullable', 'array', 'max:20'],
            'dossier_sante.*' => ['string', 'max:255'],
        ];
    }

    /**
     * @return array<int, string>|null
     */
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

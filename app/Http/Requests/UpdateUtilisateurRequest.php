<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUtilisateurRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'name' => trim((string) $this->input('name')),
            'cin' => trim((string) $this->input('cin')) ?: null,
            'email' => trim((string) $this->input('email')) ?: null,
        ]);
    }

    public function rules(): array
    {
        $utilisateur = $this->route('utilisateur');

        return [
            'name' => ['required', 'string', 'max:255'],
            'cin' => ['required', 'string', 'max:12', Rule::unique('users', 'cin')->ignore($utilisateur?->id)],
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($utilisateur?->id)],
        ];
    }
}
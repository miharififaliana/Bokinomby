<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Bovin extends Model
{
    protected $fillable = [
        'numero_boucle',
        'proprietaire_id',
        'sexe',
        'signe_particulier',
        'date_naissance',
        'date_deces',
        'dossier_sante',
        'commune_id',
    ];

    protected function casts(): array
    {
        return [
            'signe_particulier' => 'array',
            'dossier_sante' => 'array',
            'date_naissance' => 'date',
            'date_deces' => 'date',
        ];
    }

    public function proprietaire(): BelongsTo
    {
        return $this->belongsTo(User::class, 'proprietaire_id');
    }

    public function commune(): BelongsTo
    {
        return $this->belongsTo(Commune::class);
    }
}

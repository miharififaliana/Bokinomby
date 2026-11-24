<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BovinHistory extends Model
{
    protected $fillable = [
        'bovin_id',
        'numero_boucle',
        'user_id',
        'action',
        'changes',
    ];

    protected function casts(): array
    {
        return [
            'changes' => 'array',
        ];
    }

    public function bovin(): BelongsTo
    {
        return $this->belongsTo(Bovin::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
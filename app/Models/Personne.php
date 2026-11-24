<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Personne extends Model
{
    protected $fillable = [
        'nom',
        'telephone',
        'email',
    ];

    public function bovins(): HasMany
    {
        return $this->hasMany(Bovin::class, 'proprietaire_id');
    }
}

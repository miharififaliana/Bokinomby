<?php

namespace Database\Seeders;

use App\Models\Bovin;
use App\Models\User;
use App\Models\Commune;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DemoDataSeeder extends Seeder
{
    public function run(): void
    {
        DB::transaction(function () {
                $employers = collect(range(1, 40))
            ->map(fn (int $number) => User::firstOrCreate(
                ['email' => sprintf('employer-%03d@bokinomby.local', $number)],
                [
                    'name' => fake()->name(),
                    'cin' => fake()->numerify('############'),
                    'password' => 'password',
                    'role' => 'employer',
                ],
            ));

            $communeIds = DB::table('communes')->pluck('id');

            if ($communeIds->isEmpty()) {
                throw new \RuntimeException('Aucune commune disponible pour créer les bovins.');
            }

            foreach (range(1, 300) as $number) {
                $communeId = $communeIds->random();

                $commune = Commune::with('district')->findOrFail($communeId);

                $codePostal = $commune->district->code_postal;

                $numeroDansDistrict = Bovin::whereHas('commune', function ($query) use ($commune) {
                    $query->where('district_id', $commune->district_id);
                })->count() + 1;

                Bovin::firstOrCreate(
                    ['numero_boucle' => "{$codePostal}-{$numeroDansDistrict}"],
                    [
                        'proprietaire_id' => $employers[($number - 1) % $employers->count()]->id,
                        'sexe' => fake()->randomElement(['male', 'femelle']),
                        'signe_particulier' => fake()->boolean(35)
                            ? ['description' => fake()->sentence(4)]
                            : null,
                        'date_naissance' => fake()->dateTimeBetween('-15 years', '-1 year')->format('Y-m-d'),
                        'dossier_sante' => [],
                        'commune_id' => $communeId,
                    ],
                );
            }
        });
    }
}

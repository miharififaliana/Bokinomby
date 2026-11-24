<?php

namespace Database\Seeders;

use App\Models\Commune;
use App\Models\District;
use App\Models\Quartier;
use Illuminate\Database\Seeder;

class LocationSeeder extends Seeder
{
    /**
     * Jeu de départ du découpage administratif de Kinshasa.
     *
     * Cette liste n'est pas exhaustive : complétez-la dans la table
     * `quartiers` selon le terrain couvert par le registre.
     *
     * @var array<string, array<string, array<int, string>>>
     */
    private array $locations = [
        'Funa' => [
            'Bandalungwa' => ['Bandal', 'Makelele'],
            'Bumbu' => ['Bumbu', 'Makanza'],
            'Kalamu' => ['Matonge', 'Yolo-Sud'],
            'Kintambo' => ['Jamaïque', 'Kintambo'],
            'Ngaliema' => ['Joli Parc', 'Ma Campagne'],
            'Selembao' => ['Cité Verte', 'Selembao'],
        ],
        'Gombe' => [
            'Gombe' => ['Golf', 'Righini'],
        ],
        'Lukunga' => [
            'Barumbu' => ['Barumbu', 'Bongolo'],
            'Kasa-Vubu' => ['Kasa-Vubu', 'Kimbangu'],
            'Kinshasa' => ['Kabinda', 'Kinshasa'],
            'Lingwala' => ['Lingwala', 'Tshombe'],
            'Ngiri-Ngiri' => ['Kanda-Kanda', 'Ngiri-Ngiri'],
        ],
        'Mont-Amba' => [
            'Kisenso' => ['Kisenso', 'Mitendi'],
            'Lemba' => ['Lemba', 'Super Lemba'],
            'Limete' => ['Kingabwa', 'Limete'],
            'Matete' => ['Matete', 'Tomba'],
            'Ngaba' => ['Madiata', 'Ngaba'],
        ],
    ];

    public function run(): void
    {
        foreach ($this->locations as $districtName => $communes) {
            $district = District::firstOrCreate(['name' => $districtName]);

            foreach ($communes as $communeName => $quartierNames) {
                $commune = Commune::firstOrCreate([
                    'district_id' => $district->id,
                    'name' => $communeName,
                ]);

                foreach ($quartierNames as $quartierName) {
                    Quartier::firstOrCreate([
                        'commune_id' => $commune->id,
                        'name' => $quartierName,
                    ]);
                }
            }
        }
    }
}

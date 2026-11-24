<?php

namespace App\Http\Controllers;

use App\Models\Bovin;
use App\Models\District;
use App\Models\Province;
use App\Models\Region;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Affiche le tableau de bord avec les données initiales des graphiques.
     */
    public function index(Request $request): Response
    {
        [$geoLevel, $metric, $startYear, $endYear] = $this->filters($request);

        return Inertia::render('Dashboard', [
            'geoLevel' => $geoLevel,
            'geo' => $this->geoData($geoLevel),
            'metric' => $metric,
            'startYear' => $startYear,
            'endYear' => $endYear,
            'vital' => $this->vitalData($metric, $startYear, $endYear),
        ]);
    }

    /**
     * Données JSON pour le graphique géographique.
     */
    public function geo(Request $request): JsonResponse
    {
        $level = (string) $request->query('level', 'province');
        if (! in_array($level, ['province', 'region', 'district'], true)) {
            $level = 'province';
        }

        return response()->json($this->geoData($level));
    }

    /**
     * Données JSON pour le graphique natalité/mortalité.
     */
    public function vital(Request $request): JsonResponse
    {
        [$metric, $startYear, $endYear] = $this->vitalFilters($request);

        return response()->json($this->vitalData($metric, $startYear, $endYear));
    }

    /**
     * @return array{0:string,1:string,2:int,3:int}
     */
    private function filters(Request $request): array
    {
        $geoLevel = (string) $request->query('geo_level', 'province');
        if (! in_array($geoLevel, ['province', 'region', 'district'], true)) {
            $geoLevel = 'province';
        }

        [$metric, $startYear, $endYear] = $this->vitalFilters($request);

        return [$geoLevel, $metric, $startYear, $endYear];
    }

    /**
     * @return array{0:string,1:int,2:int}
     */
    private function vitalFilters(Request $request): array
    {
        $metric = (string) $request->query('metric', 'both');
        if (! in_array($metric, ['born', 'deaths', 'both'], true)) {
            $metric = 'both';
        }

        $currentYear = (int) date('Y');
        $startYear = (int) $request->query('start_year', $currentYear - 4);
        $endYear = (int) $request->query('end_year', $currentYear);

        if ($startYear < 1900) {
            $startYear = 1900;
        }
        if ($endYear < $startYear) {
            $endYear = $startYear;
        }
        if ($endYear - $startYear > 50) {
            $endYear = $startYear + 50;
        }

        return [$metric, $startYear, $endYear];
    }

    /**
     * @return array{labels:array<int,string>,counts:array<int,int>}
     */
    private function geoData(string $level): array
    {
        if ($level === 'region') {
            $rows = Region::query()
                ->leftJoin('districts', 'districts.region_id', '=', 'regions.id')
                ->leftJoin('communes', 'communes.district_id', '=', 'districts.id')
                ->leftJoin('bovins', 'bovins.commune_id', '=', 'communes.id')
                ->select('regions.id', 'regions.nom as label', DB::raw('COUNT(bovins.id) as count'))
                ->groupBy('regions.id', 'regions.nom')
                ->orderBy('regions.nom')
                ->get();
        } elseif ($level === 'district') {
            $rows = District::query()
                ->leftJoin('communes', 'communes.district_id', '=', 'districts.id')
                ->leftJoin('bovins', 'bovins.commune_id', '=', 'communes.id')
                ->select('districts.id', 'districts.name as label', DB::raw('COUNT(bovins.id) as count'))
                ->groupBy('districts.id', 'districts.name')
                ->orderBy('districts.name')
                ->get();
        } else {
            $rows = Province::query()
                ->leftJoin('regions', 'regions.province_id', '=', 'provinces.id')
                ->leftJoin('districts', 'districts.region_id', '=', 'regions.id')
                ->leftJoin('communes', 'communes.district_id', '=', 'districts.id')
                ->leftJoin('bovins', 'bovins.commune_id', '=', 'communes.id')
                ->select('provinces.id', 'provinces.nom as label', DB::raw('COUNT(bovins.id) as count'))
                ->groupBy('provinces.id', 'provinces.nom')
                ->orderBy('provinces.nom')
                ->get();
        }

        return [
            'labels' => $rows->pluck('label')->values()->all(),
            'counts' => $rows->pluck('count')->map(fn ($value) => (int) $value)->values()->all(),
        ];
    }

    /**
     * @return array{years:array<int,int>,born:array<int,int>,deaths:array<int,int>}
     */
    private function vitalData(string $metric, int $startYear, int $endYear): array
    {
        $years = range($startYear, $endYear);
        $born = [];
        $deaths = [];

        foreach ($years as $year) {
            $born[] = Bovin::query()
                ->whereYear('date_naissance', $year)
                ->count();

            $deaths[] = Bovin::query()
                ->whereNotNull('date_deces')
                ->whereYear('date_deces', $year)
                ->count();
        }

        return [
            'years' => array_values($years),
            'born' => $born,
            'deaths' => $deaths,
            'metric' => $metric,
        ];
    }
}

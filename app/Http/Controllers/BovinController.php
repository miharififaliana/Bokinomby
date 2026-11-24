<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreBovinRequest;
use App\Http\Requests\UpdateBovinRequest;
use App\Models\Bovin;
use App\Models\BovinHistory;
use App\Models\Commune;
use App\Models\Province;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class BovinController extends Controller
{
    /**
     * Affiche les bovins accessibles à l'utilisateur.
     */
    public function index(Request $request): Response
    {
        $search = trim((string) $request->query('search', ''));

        $query = Bovin::query()
            ->with([
                'commune.district.region.province',
                'proprietaire:id,name,cin',
            ])
            ->when($search !== '', fn ($query) => $query->where('numero_boucle', 'like', "%{$search}%"))
            ->latest();

        $stats = [
            'total' => (clone $query)->count(),
            'femelles' => (clone $query)->where('sexe', 'femelle')->count(),
            'males' => (clone $query)->where('sexe', 'male')->count(),
        ];

        return Inertia::render('Bovins/Index', [
            'bovins' => $query->paginate(12)->withQueryString(),
            'stats' => $stats,
            'filters' => ['search' => $search],
            'success' => $request->session()->get('success'),
        ]);
    }

    /**
     * Affiche le formulaire d'enregistrement.
     */
    public function create(Request $request): Response
    {
        $selectedProprietaireId = User::find(
            $request->integer('proprietaire'),
        )?->id;

        return Inertia::render('Bovins/Create', [
            'provinces' => $this->provinces(),
            'utilisateurs' => User::query()
                ->where('role', 'employer')
                ->orderBy('name')
                ->get(['id', 'name', 'cin', 'email']),
            'selectedProprietaireId' => $selectedProprietaireId,
        ]);
    }

    /**
     * Enregistre un nouveau bovin pour l'utilisateur connecté.
     */
    public function store(StoreBovinRequest $request): RedirectResponse
    {
        $data = $request->validated();

        $commune = Commune::query()->with('district')->findOrFail($data['commune_id']);

        $bovin = DB::transaction(function () use ($data, $commune) {
            // La boucle est générée par Laravel : code postal du district
            // suivi du numéro individuel du bovin (ex. 101-1).
            $bovin = Bovin::create([
                ...$data,
                'numero_boucle' => 'TMP-'.Str::uuid(),
            ]);

            $codePostal = $commune->district?->code_postal ?: '000';

            $bovin->forceFill([
                'numero_boucle' => $codePostal.'-'.$bovin->id,
            ])->save();

            return $bovin;
        });

        return Redirect::route('bovins.index')->with(
            'success',
            "Le bovin {$bovin->numero_boucle} a été assigné à {$bovin->proprietaire->name}.",
        );
    }

    /**
     * Affiche la fiche détaillée d'un bovin.
     */
    public function show(Bovin $bovin): Response
    {
        $bovin->load([
            'proprietaire:id,name,cin,email',
            'commune.district.region.province',
        ]);

        $histories = BovinHistory::query()
            ->where('bovin_id', $bovin->id)
            ->with('user:id,name')
            ->latest()
            ->get();

        $commune = $bovin->commune;
        $district = $commune?->district;
        $region = $district?->region;
        $province = $region?->province;

        $mapQuery = collect([
            $commune?->name,
            $district?->name,
            $region?->nom,
            $province?->nom,
            'Madagascar',
        ])->filter()->implode(', ');

        return Inertia::render('Bovins/Show', [
            'bovin' => $bovin,
            'localisation' => [
                'commune' => $commune?->name,
                'district' => $district?->name,
                'region' => $region?->nom,
                'province' => $province?->nom,
                'code_postal' => $district?->code_postal,
                'map_query' => $mapQuery,
            ],
            'histories' => $histories,
        ]);
    }

    /**
     * Affiche le formulaire de modification d'un bovin.
     */
    public function edit(Bovin $bovin): Response
    {
        $bovin->load(['proprietaire:id,name,cin', 'commune.district.region.province']);

        $commune = $bovin->commune;
        $district = $commune?->district;
        $region = $district?->region;
        $province = $region?->province;

        return Inertia::render('Bovins/Edit', [
            'bovin' => $bovin,
            'provinces' => $this->provinces(),
            'selected' => [
                'province_id' => $province?->id,
                'region_id' => $region?->id,
                'district_id' => $district?->id,
            ],
        ]);
    }

    /**
     * Met à jour les informations modifiables d'un bovin.
     */
    public function update(UpdateBovinRequest $request, Bovin $bovin): RedirectResponse
    {
        $old = $bovin->only([
            'sexe', 'date_naissance', 'date_deces', 'signe_particulier', 'dossier_sante',
        ]);

        $data = $request->validated();
        $bovin->update($data);

        $changes = [];
        foreach (array_keys($old) as $field) {
            if (($old[$field] ?? null) != ($bovin->{$field} ?? null)) {
                $changes[$field] = [
                    'avant' => $old[$field],
                    'apres' => $bovin->{$field},
                ];
            }
        }

        if ($changes !== []) {
            BovinHistory::create([
                'bovin_id' => $bovin->id,
                'numero_boucle' => $bovin->numero_boucle,
                'user_id' => $request->user()?->id,
                'action' => 'modification',
                'changes' => $changes,
            ]);
        }

        return Redirect::route('bovins.show', $bovin)->with(
            'success',
            "La fiche du bovin {$bovin->numero_boucle} a été mise à jour.",
        );
    }

    /**
     * Supprime un bovin en conservant son historique.
     */
    public function destroy(Bovin $bovin): RedirectResponse
    {
        $numero = $bovin->numero_boucle;

        BovinHistory::create([
            'bovin_id' => null,
            'numero_boucle' => $numero,
            'user_id' => request()->user()?->id,
            'action' => 'suppression',
            'changes' => [
                'bovin' => $bovin->toArray(),
            ],
        ]);

        $bovin->delete();

        return Redirect::route('bovins.index')->with(
            'success',
            "Le bovin {$numero} a été supprimé. Son historique est conservé.",
        );
    }

    /**
     * Découpage administratif proposé dans le formulaire.
     *
     * @return array<int, array<string, mixed>>
     */
    private function provinces(): array
    {
        return Province::query()
            ->with(['regions.districts.communes'])
            ->orderBy('nom')
            ->get()
            ->map(fn (Province $province) => [
                'id' => $province->id,
                'nom' => $province->nom,
                'regions' => $province->regions
                    ->sortBy('nom')
                    ->map(fn ($region) => [
                        'id' => $region->id,
                        'nom' => $region->nom,
                        'districts' => $region->districts
                            ->sortBy('name')
                            ->map(fn ($district) => [
                                'id' => $district->id,
                                'name' => $district->name,
                                'code_postal' => $district->code_postal,
                                'communes' => $district->communes
                                    ->sortBy('name')
                                    ->map(fn ($commune) => [
                                        'id' => $commune->id,
                                        'name' => $commune->name,
                                    ])
                                    ->values()
                                    ->all(),
                            ])
                            ->values()
                            ->all(),
                    ])
                    ->values()
                    ->all(),
            ])
            ->values()
            ->all();
    }
}

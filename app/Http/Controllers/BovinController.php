<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreBovinRequest;
use App\Models\Bovin;
use App\Models\District;
use App\Models\Personne;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class BovinController extends Controller
{
    /**
     * Affiche les bovins accessibles à l'utilisateur.
     */
    public function index(Request $request): Response
    {
        $query = Bovin::query()
            ->with([
                'quartier.commune.district',
                'proprietaire:id,nom',
            ])
            ->latest();

        $stats = [
            'total' => (clone $query)->count(),
            'femelles' => (clone $query)->where('sexe', 'femelle')->count(),
            'males' => (clone $query)->where('sexe', 'male')->count(),
        ];

        return Inertia::render('Bovins/Index', [
            'bovins' => $query->paginate(12)->withQueryString(),
            'stats' => $stats,
            'success' => $request->session()->get('success'),
        ]);
    }

    /**
     * Affiche le formulaire d'enregistrement.
     */
    public function create(Request $request): Response
    {
        $selectedProprietaireId = Personne::find(
            $request->integer('proprietaire'),
        )?->id;

        return Inertia::render('Bovins/Create', [
            'districts' => $this->districts(),
            'personnes' => Personne::query()
                ->orderBy('nom')
                ->get(['id', 'nom', 'telephone']),
            'selectedProprietaireId' => $selectedProprietaireId,
        ]);
    }

    /**
     * Enregistre un nouveau bovin pour l'utilisateur connecté.
     */
    public function store(StoreBovinRequest $request): RedirectResponse
    {
        $bovin = Bovin::create($request->validated());

        return Redirect::route('bovins.index')->with(
            'success',
            "Le bovin {$bovin->numero_boucle} a été assigné à {$bovin->proprietaire->nom}.",
        );
    }

    /**
     * Découpage administratif proposé dans le formulaire.
     *
     * @return array<int, array<string, mixed>>
     */
    private function districts(): array
    {
        return District::query()
            ->with(['communes.quartiers'])
            ->orderBy('name')
            ->get()
            ->map(fn (District $district) => [
                'id' => $district->id,
                'name' => $district->name,
                'communes' => $district->communes
                    ->sortBy('name')
                    ->map(fn ($commune) => [
                        'id' => $commune->id,
                        'name' => $commune->name,
                        'quartiers' => $commune->quartiers
                            ->sortBy('name')
                            ->map(fn ($quartier) => [
                                'id' => $quartier->id,
                                'name' => $quartier->name,
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

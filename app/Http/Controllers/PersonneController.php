<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePersonneRequest;
use App\Models\Personne;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class PersonneController extends Controller
{
    /**
     * Liste des personnes inscrites au registre.
     */
    public function index(Request $request): Response
    {
        return Inertia::render('Personnes/Index', [
            'personnes' => Personne::query()
                ->withCount('bovins')
                ->orderBy('nom')
                ->paginate(12),
            'success' => $request->session()->get('success'),
        ]);
    }

    /**
     * Affiche le formulaire de création d'une personne.
     */
    public function create(): Response
    {
        return Inertia::render('Personnes/Create');
    }

    /**
     * Enregistre une nouvelle personne.
     */
    public function store(StorePersonneRequest $request): RedirectResponse
    {
        $personne = Personne::create($request->validated());

        return Redirect::route('personnes.show', $personne)->with(
            'success',
            "{$personne->nom} a été ajouté au registre des personnes.",
        );
    }

    /**
     * Affiche une personne et les bovins qui lui sont assignés.
     */
    public function show(Request $request, Personne $personne): Response
    {
        $bovins = $personne->bovins()
            ->with('quartier.commune.district')
            ->latest()
            ->paginate(10);

        return Inertia::render('Personnes/Show', [
            'personne' => $personne,
            'bovins' => $bovins,
            'stats' => [
                'total' => $personne->bovins()->count(),
                'femelles' => $personne->bovins()->where('sexe', 'femelle')->count(),
                'males' => $personne->bovins()->where('sexe', 'male')->count(),
            ],
            'success' => $request->session()->get('success'),
        ]);
    }
}

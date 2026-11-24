<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUtilisateurRequest;
use App\Http\Requests\UpdateUtilisateurRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class UtilisateurController extends Controller
{
    /**
     * Liste des éleveurs inscrits au registre.
     */
    public function index(Request $request): Response
    {
        $search = trim((string) $request->query('search', ''));

        $component = $request->is('eleveurs*') ? 'Eleveurs/Index' : 'Utilisateurs/Index';

        return Inertia::render($component, [
            'utilisateurs' => User::query()
                ->where('role', 'employer')
                ->withCount('bovins')
                ->when($search !== '', fn ($query) => $query->where('cin', 'like', "%{$search}%"))
                ->orderBy('name')
                ->paginate(12)
                ->withQueryString(),
            'filters' => ['search' => $search],
            'success' => $request->session()->get('success'),
        ]);
    }

    public function create(): Response
    {
        $component = request()->is('eleveurs*') ? 'Eleveurs/Create' : 'Utilisateurs/Create';

        return Inertia::render($component);
    }

    public function store(StoreUtilisateurRequest $request): RedirectResponse
    {
        $utilisateur = User::create([
            ...$request->validated(),
            'role' => 'employer',
            'password' => Hash::make(Str::random(32)),
        ]);

        $showRoute = request()->is('eleveurs*') ? 'eleveurs.show' : 'utilisateurs.show';

        return Redirect::route($showRoute, $utilisateur)->with(
            'success',
            "{$utilisateur->name} a été ajouté au registre des éleveurs.",
        );
    }

    public function show(Request $request, User $utilisateur): Response
    {
        abort_unless($utilisateur->role === 'employer', 404);

        $bovins = $utilisateur->bovins()
            ->with('commune.district.region.province')
            ->latest()
            ->paginate(10);

        $component = $request->is('eleveurs*') ? 'Eleveurs/Show' : 'Utilisateurs/Show';

        return Inertia::render($component, [
            'utilisateur' => $utilisateur,
            'bovins' => $bovins,
            'stats' => [
                'total' => $utilisateur->bovins()->count(),
                'femelles' => $utilisateur->bovins()->where('sexe', 'femelle')->count(),
                'males' => $utilisateur->bovins()->where('sexe', 'male')->count(),
            ],
            'success' => $request->session()->get('success'),
        ]);
    }

    public function edit(User $utilisateur): Response
    {
        abort_unless($utilisateur->role === 'employer', 404);

        $component = request()->is('eleveurs*') ? 'Eleveurs/Edit' : 'Utilisateurs/Edit';

        return Inertia::render($component, [
            'utilisateur' => $utilisateur,
        ]);
    }

    public function update(UpdateUtilisateurRequest $request, User $utilisateur): RedirectResponse
    {
        abort_unless($utilisateur->role === 'employer', 404);

        $utilisateur->update($request->validated());

        $showRoute = request()->is('eleveurs*') ? 'eleveurs.show' : 'utilisateurs.show';

        return Redirect::route($showRoute, $utilisateur)->with(
            'success',
            "Les informations de {$utilisateur->name} ont été mises à jour.",
        );
    }

    public function destroy(User $utilisateur): RedirectResponse
    {
        abort_unless($utilisateur->role === 'employer', 404);

        $name = $utilisateur->name;
        $utilisateur->delete();

        $indexRoute = request()->is('eleveurs*') ? 'eleveurs.index' : 'utilisateurs.index';

        return Redirect::route($indexRoute)->with(
            'success',
            "{$name} a été supprimé du registre des éleveurs.",
        );
    }
}
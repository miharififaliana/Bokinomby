<?php

use App\Models\Bovin;
use App\Models\Commune;
use App\Models\District;
use App\Models\Personne;
use App\Models\Quartier;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->user = User::factory()->create();

    $district = District::create(['name' => 'Funa']);
    $commune = Commune::create([
        'district_id' => $district->id,
        'name' => 'Matete',
    ]);
    $this->quartier = Quartier::create([
        'commune_id' => $commune->id,
        'name' => 'Tomba',
    ]);

    $this->personne = Personne::create([
        'nom' => 'Aline Mbala',
        'telephone' => '+243 81 000 0000',
    ]);
    $this->autrePersonne = Personne::create(['nom' => 'Joseph Kabasele']);
});

function bovinFor(Personne $personne, Quartier $quartier, string $numero = 'BK-0001'): Bovin
{
    return Bovin::create([
        'numero_boucle' => $numero,
        'proprietaire_id' => $personne->id,
        'sexe' => 'femelle',
        'date_naissance' => '2024-03-12',
        'quartier_id' => $quartier->id,
    ]);
}

test('le registre est réservé aux utilisateurs connectés', function () {
    $this->get('/bovins')->assertRedirect('/login');
});

test('le registre affiche tous les bovins avec leur propriétaire', function () {
    bovinFor($this->personne, $this->quartier, 'BK-0001');
    bovinFor($this->autrePersonne, $this->quartier, 'BK-0002');

    $this->actingAs($this->user)
        ->get('/bovins')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Bovins/Index')
            ->where('stats.total', 2)
            ->where('stats.femelles', 2)
            ->has('bovins.data', 2)
            ->has('bovins.data.0.proprietaire.nom')
            ->where('bovins.data.0.quartier.commune.name', 'Matete')
        );
});

test('le formulaire expose les personnes et peut présélectionner un propriétaire', function () {
    $this->actingAs($this->user)
        ->get('/bovins/create?proprietaire='.$this->personne->id)
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Bovins/Create')
            ->where('districts.0.name', 'Funa')
            ->where('districts.0.communes.0.name', 'Matete')
            ->where('districts.0.communes.0.quartiers.0.name', 'Tomba')
            ->where('selectedProprietaireId', $this->personne->id)
            ->has('personnes', 2)
            ->where('personnes.1.nom', 'Joseph Kabasele')
        );
});

test('un bovin peut être assigné à une personne', function () {
    $response = $this->actingAs($this->user)->post('/bovins', [
        'proprietaire_id' => $this->personne->id,
        'numero_boucle' => '  BK-0248  ',
        'sexe' => 'femelle',
        'date_naissance' => '2024-03-12',
        'quartier_id' => $this->quartier->id,
        'signe_particulier' => "Robe pie rouge\n\nCornes absentes",
        'dossier_sante' => 'Vaccination fièvre aphteuse',
    ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect('/bovins')
        ->assertSessionHas('success');

    $bovin = Bovin::sole();

    expect($bovin->numero_boucle)->toBe('BK-0248')
        ->and($bovin->proprietaire_id)->toBe($this->personne->id)
        ->and($bovin->signe_particulier)->toBe(['Robe pie rouge', 'Cornes absentes'])
        ->and($bovin->dossier_sante)->toBe(['Vaccination fièvre aphteuse']);
});

test('les champs obligatoires, la boucle unique et le propriétaire sont validés', function () {
    bovinFor($this->personne, $this->quartier, 'BK-0001');

    $this->actingAs($this->user)
        ->post('/bovins', ['numero_boucle' => 'BK-0001'])
        ->assertSessionHasErrors([
            'numero_boucle',
            'proprietaire_id',
            'sexe',
            'date_naissance',
            'quartier_id',
        ]);

    $this->actingAs($this->user)
        ->post('/bovins', [
            'proprietaire_id' => 99999,
            'numero_boucle' => 'BK-0002',
            'sexe' => 'male',
            'date_naissance' => '2024-03-12',
            'quartier_id' => $this->quartier->id,
        ])
        ->assertSessionHasErrors('proprietaire_id');

    expect(Bovin::count())->toBe(1);
});

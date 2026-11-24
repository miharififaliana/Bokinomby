<?php

use App\Models\Bovin;
use App\Models\Commune;
use App\Models\District;
use App\Models\Province;
use App\Models\Region;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->user = User::factory()->create(['name' => 'Zoé Admin', 'role' => 'admin']);

    $province = Province::create(['nom' => 'Antananarivo']);
    $region = Region::create([
        'province_id' => $province->id,
        'nom' => 'Analamanga',
    ]);
    $district = District::create([
        'region_id' => $region->id,
        'name' => 'Antananarivo-Renivohitra',
        'code_postal' => '101',
    ]);
    $this->commune = Commune::create([
        'district_id' => $district->id,
        'name' => 'Antananarivo',
    ]);

    $this->personne = User::factory()->create([
        'name' => 'Aline Mbala',
        'email' => 'aline@example.com',
        'cin' => '101234567890',
    ]);
    $this->autrePersonne = User::factory()->create([
        'name' => 'Joseph Kabasele',
        'email' => 'joseph@example.com',
        'cin' => '101234567891',
    ]);
});

function bovinFor(User $personne, Commune $commune, string $numero = '101-1'): Bovin
{
    return Bovin::create([
        'numero_boucle' => $numero,
        'proprietaire_id' => $personne->id,
        'sexe' => 'femelle',
        'date_naissance' => '2024-03-12',
        'commune_id' => $commune->id,
    ]);
}

test('le registre est réservé aux utilisateurs connectés', function () {
    $this->get('/bovins')->assertRedirect('/login');
});

test('le registre affiche tous les bovins avec leur propriétaire', function () {
    bovinFor($this->personne, $this->commune, '101-1');
    bovinFor($this->autrePersonne, $this->commune, '101-2');

    $this->actingAs($this->user)
        ->get('/bovins')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Bovins/Index')
            ->where('stats.total', 2)
            ->where('stats.femelles', 2)
            ->has('bovins.data', 2)
            ->has('bovins.data.0.proprietaire.name')
            ->where('bovins.data.0.commune.name', 'Antananarivo')
        );
});

test('le registre peut être filtré par boucle d’oreille', function () {
    bovinFor($this->personne, $this->commune, '101-1');
    bovinFor($this->autrePersonne, $this->commune, '101-2');

    $this->actingAs($this->user)
        ->get('/bovins?search=101-2')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Bovins/Index')
            ->where('filters.search', '101-2')
            ->has('bovins.data', 1)
            ->where('bovins.data.0.numero_boucle', '101-2')
        );
});

test('le formulaire expose le découpage administratif et présélectionne un propriétaire', function () {
    $this->actingAs($this->user)
        ->get('/bovins/create?proprietaire='.$this->personne->id)
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Bovins/Create')
            ->where('provinces.0.nom', 'Antananarivo')
            ->where('provinces.0.regions.0.nom', 'Analamanga')
            ->where('provinces.0.regions.0.districts.0.code_postal', '101')
            ->where('provinces.0.regions.0.districts.0.communes.0.name', 'Antananarivo')
            ->where('selectedProprietaireId', $this->personne->id)
            ->has('utilisateurs', 2)
            ->where('utilisateurs.0.name', 'Aline Mbala')
            ->where('utilisateurs.1.name', 'Joseph Kabasele')
        );
});

test('un bovin peut être assigné avec une boucle générée automatiquement', function () {
    $response = $this->actingAs($this->user)->post('/bovins', [
        'proprietaire_id' => $this->personne->id,
        'sexe' => 'femelle',
        'date_naissance' => '2024-03-12',
        'commune_id' => $this->commune->id,
        'signe_particulier' => "Robe pie rouge\n\nCornes absentes",
        'dossier_sante' => 'Vaccination fièvre aphteuse',
    ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect('/bovins')
        ->assertSessionHas('success');

    $bovin = Bovin::sole();

    expect($bovin->numero_boucle)->toBe('101-'.$bovin->id)
        ->and($bovin->proprietaire_id)->toBe($this->personne->id)
        ->and($bovin->signe_particulier)->toBe(['Robe pie rouge', 'Cornes absentes'])
        ->and($bovin->dossier_sante)->toBe(['Vaccination fièvre aphteuse']);
});

test('les champs obligatoires, le propriétaire et la commune sont validés', function () {
    $this->actingAs($this->user)
        ->post('/bovins', [])
        ->assertSessionHasErrors([
            'proprietaire_id',
            'sexe',
            'date_naissance',
            'commune_id',
        ]);

    $this->actingAs($this->user)
        ->post('/bovins', [
            'proprietaire_id' => 99999,
            'sexe' => 'male',
            'date_naissance' => '2024-03-12',
            'commune_id' => $this->commune->id,
        ])
        ->assertSessionHasErrors('proprietaire_id');

    expect(Bovin::count())->toBe(0);
});

test('la fiche détaillée expose le propriétaire, la santé et la localisation', function () {
    $bovin = bovinFor($this->personne, $this->commune, '101-1');
    $bovin->update([
        'signe_particulier' => ['Robe pie rouge'],
        'dossier_sante' => ['Vaccination fièvre aphteuse'],
    ]);

    $this->actingAs($this->user)
        ->get('/bovins/'.$bovin->id)
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Bovins/Show')
            ->where('bovin.numero_boucle', '101-1')
            ->where('bovin.proprietaire.name', 'Aline Mbala')
            ->where('localisation.commune', 'Antananarivo')
            ->where('localisation.code_postal', '101')
        );
});

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
});

test('la liste des utilisateurs est réservée aux utilisateurs connectés', function () {
    $this->get('/utilisateurs')->assertRedirect('/login');
});

test('la liste des utilisateurs affiche le nombre de bovins', function () {
    $aline = User::factory()->create([
        'name' => 'Aline Mbala',
        'email' => 'aline@example.com',
        'cin' => '101234567890',
    ]);
    $joseph = User::factory()->create([
        'name' => 'Joseph Kabasele',
        'email' => 'joseph@example.com',
        'cin' => '101234567891',
    ]);

    foreach (['101-1', '101-2'] as $numero) {
        Bovin::create([
            'numero_boucle' => $numero,
            'proprietaire_id' => $aline->id,
            'sexe' => 'femelle',
            'date_naissance' => '2024-03-12',
            'commune_id' => $this->commune->id,
        ]);
    }

    $this->actingAs($this->user)
        ->get('/utilisateurs')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Utilisateurs/Index')
            ->has('utilisateurs.data', 2)
            ->where('utilisateurs.data.0.name', 'Aline Mbala')
            ->where('utilisateurs.data.0.cin', '101234567890')
            ->where('utilisateurs.data.0.bovins_count', 2)
            ->where('utilisateurs.data.1.name', $joseph->name)
            ->where('utilisateurs.data.1.bovins_count', 0)
        );
});

test('les utilisateurs peuvent être recherchés par CIN', function () {
    User::factory()->create([
        'name' => 'Aline Mbala',
        'email' => 'aline@example.com',
        'cin' => '101234567890',
    ]);
    User::factory()->create([
        'name' => 'Joseph Kabasele',
        'email' => 'joseph@example.com',
        'cin' => '201234567891',
    ]);

    $this->actingAs($this->user)
        ->get('/utilisateurs?search=201234567891')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Utilisateurs/Index')
            ->where('filters.search', '201234567891')
            ->has('utilisateurs.data', 1)
            ->where('utilisateurs.data.0.name', 'Joseph Kabasele')
        );
});

test('un utilisateur peut être créé avec son CIN', function () {
    $response = $this->actingAs($this->user)->post('/utilisateurs', [
        'name' => '  Aline Mbala  ',
        'cin' => ' 101234567890 ',
        'email' => 'aline@example.com',
    ]);

    $utilisateur = User::where('cin', '101234567890')->sole();

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect('/utilisateurs/'.$utilisateur->id)
        ->assertSessionHas('success');

    expect($utilisateur->name)->toBe('Aline Mbala')
        ->and($utilisateur->cin)->toBe('101234567890')
        ->and($utilisateur->email)->toBe('aline@example.com')
        ->and($utilisateur->role)->toBe('employer');
});

test('le nom, le CIN unique, un e-mail valide et un mot de passe sont exigés', function () {
    User::factory()->create([
        'name' => 'Aline Mbala',
        'email' => 'aline@example.com',
        'cin' => '101234567890',
    ]);

    $this->actingAs($this->user)
        ->post('/utilisateurs', [
            'name' => '',
            'cin' => '101234567890',
            'email' => 'pas-un-email',
        ])
        ->assertSessionHasErrors(['name', 'cin', 'email']);

    expect(User::where('cin', '101234567890')->count())->toBe(1);
});

test('la fiche d’un utilisateur liste tous ses bovins', function () {
    $utilisateur = User::factory()->create([
        'name' => 'Aline Mbala',
        'email' => 'aline@example.com',
        'cin' => '101234567890',
    ]);

    foreach (['101-1', '101-2', '101-3'] as $index => $numero) {
        Bovin::create([
            'numero_boucle' => $numero,
            'proprietaire_id' => $utilisateur->id,
            'sexe' => $index === 2 ? 'male' : 'femelle',
            'date_naissance' => '2024-03-12',
            'commune_id' => $this->commune->id,
        ]);
    }

    $this->actingAs($this->user)
        ->get('/utilisateurs/'.$utilisateur->id)
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Utilisateurs/Show')
            ->where('utilisateur.name', 'Aline Mbala')
            ->where('utilisateur.cin', '101234567890')
            ->where('stats.total', 3)
            ->where('stats.femelles', 2)
            ->where('stats.males', 1)
            ->has('bovins.data', 3)
        );
});

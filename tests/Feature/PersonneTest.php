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
});

test('la liste des personnes est réservée aux utilisateurs connectés', function () {
    $this->get('/personnes')->assertRedirect('/login');
});

test('la liste des personnes affiche le nombre de bovins', function () {
    $aline = Personne::create(['nom' => 'Aline Mbala']);
    $joseph = Personne::create(['nom' => 'Joseph Kabasele']);

    foreach (['BK-0001', 'BK-0002'] as $numero) {
        Bovin::create([
            'numero_boucle' => $numero,
            'proprietaire_id' => $aline->id,
            'sexe' => 'femelle',
            'date_naissance' => '2024-03-12',
            'quartier_id' => $this->quartier->id,
        ]);
    }

    $this->actingAs($this->user)
        ->get('/personnes')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Personnes/Index')
            ->has('personnes.data', 2)
            ->where('personnes.data.0.nom', 'Aline Mbala')
            ->where('personnes.data.0.bovins_count', 2)
            ->where('personnes.data.1.nom', $joseph->nom)
            ->where('personnes.data.1.bovins_count', 0)
        );
});

test('une personne peut être créée', function () {
    $response = $this->actingAs($this->user)->post('/personnes', [
        'nom' => '  Aline Mbala  ',
        'telephone' => '+243 81 000 0000',
        'email' => 'aline@example.com',
    ]);

    $personne = Personne::sole();

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect('/personnes/'.$personne->id)
        ->assertSessionHas('success');

    expect($personne->nom)->toBe('Aline Mbala')
        ->and($personne->telephone)->toBe('+243 81 000 0000')
        ->and($personne->email)->toBe('aline@example.com');
});

test('le nom et un e-mail valide sont exigés pour créer une personne', function () {
    $this->actingAs($this->user)
        ->post('/personnes', ['nom' => '', 'email' => 'pas-un-email'])
        ->assertSessionHasErrors(['nom', 'email']);

    expect(Personne::count())->toBe(0);
});

test('la fiche d’une personne liste tous ses bovins', function () {
    $personne = Personne::create(['nom' => 'Aline Mbala']);

    foreach (['BK-0001', 'BK-0002', 'BK-0003'] as $index => $numero) {
        Bovin::create([
            'numero_boucle' => $numero,
            'proprietaire_id' => $personne->id,
            'sexe' => $index === 2 ? 'male' : 'femelle',
            'date_naissance' => '2024-03-12',
            'quartier_id' => $this->quartier->id,
        ]);
    }

    $this->actingAs($this->user)
        ->get('/personnes/'.$personne->id)
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Personnes/Show')
            ->where('personne.nom', 'Aline Mbala')
            ->where('stats.total', 3)
            ->where('stats.femelles', 2)
            ->where('stats.males', 1)
            ->has('bovins.data', 3)
        );
});

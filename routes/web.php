<?php

use App\Http\Controllers\BovinController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UtilisateurController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');
Route::get('/dashboard/geo', [DashboardController::class, 'geo'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard.geo');
Route::get('/dashboard/vital', [DashboardController::class, 'vital'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard.vital');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/bovins', [BovinController::class, 'index'])->name('bovins.index');
    Route::get('/bovins/create', [BovinController::class, 'create'])->name('bovins.create');
    Route::post('/bovins', [BovinController::class, 'store'])->name('bovins.store');
    Route::get('/bovins/{bovin}', [BovinController::class, 'show'])->name('bovins.show');
    Route::get('/bovins/{bovin}/edit', [BovinController::class, 'edit'])->name('bovins.edit');
    Route::match(['put', 'patch'], '/bovins/{bovin}', [BovinController::class, 'update'])->name('bovins.update');
    Route::delete('/bovins/{bovin}', [BovinController::class, 'destroy'])->name('bovins.destroy');

    Route::get('/utilisateurs', [UtilisateurController::class, 'index'])->name('utilisateurs.index');
    Route::get('/utilisateurs/create', [UtilisateurController::class, 'create'])->name('utilisateurs.create');
    Route::post('/utilisateurs', [UtilisateurController::class, 'store'])->name('utilisateurs.store');
    Route::get('/utilisateurs/{utilisateur}', [UtilisateurController::class, 'show'])->name('utilisateurs.show');
    Route::get('/utilisateurs/{utilisateur}/edit', [UtilisateurController::class, 'edit'])->name('utilisateurs.edit');
    Route::match(['put', 'patch'], '/utilisateurs/{utilisateur}', [UtilisateurController::class, 'update'])->name('utilisateurs.update');
    Route::delete('/utilisateurs/{utilisateur}', [UtilisateurController::class, 'destroy'])->name('utilisateurs.destroy');

    Route::get('/eleveurs', [UtilisateurController::class, 'index'])->name('eleveurs.index');
    Route::get('/eleveurs/create', [UtilisateurController::class, 'create'])->name('eleveurs.create');
    Route::post('/eleveurs', [UtilisateurController::class, 'store'])->name('eleveurs.store');
    Route::get('/eleveurs/{utilisateur}', [UtilisateurController::class, 'show'])->name('eleveurs.show');
    Route::get('/eleveurs/{utilisateur}/edit', [UtilisateurController::class, 'edit'])->name('eleveurs.edit');
    Route::match(['put', 'patch'], '/eleveurs/{utilisateur}', [UtilisateurController::class, 'update'])->name('eleveurs.update');
    Route::delete('/eleveurs/{utilisateur}', [UtilisateurController::class, 'destroy'])->name('eleveurs.destroy');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';

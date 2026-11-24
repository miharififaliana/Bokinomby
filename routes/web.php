<?php

use App\Http\Controllers\BovinController;
use App\Http\Controllers\PersonneController;
use App\Http\Controllers\ProfileController;
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

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/bovins', [BovinController::class, 'index'])->name('bovins.index');
    Route::get('/bovins/create', [BovinController::class, 'create'])->name('bovins.create');
    Route::post('/bovins', [BovinController::class, 'store'])->name('bovins.store');

    Route::get('/personnes', [PersonneController::class, 'index'])->name('personnes.index');
    Route::get('/personnes/create', [PersonneController::class, 'create'])->name('personnes.create');
    Route::post('/personnes', [PersonneController::class, 'store'])->name('personnes.store');
    Route::get('/personnes/{personne}', [PersonneController::class, 'show'])->name('personnes.show');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';

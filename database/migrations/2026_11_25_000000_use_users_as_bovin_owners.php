<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    /**
     * Les propriétaires de bovins sont désormais des utilisateurs.
     * Cette migration reprend les données de l'ancienne table personnes.
     */
    public function up(): void
    {
        if (! Schema::hasTable('personnes')) {
            return;
        }

        Schema::table('bovins', function (Blueprint $table) {
            $table->dropForeign(['proprietaire_id']);
        });

        $ownerIds = DB::table('bovins')
            ->select('proprietaire_id')
            ->distinct()
            ->orderBy('proprietaire_id')
            ->pluck('proprietaire_id');

        $map = [];

        foreach ($ownerIds as $personneId) {
            $personne = DB::table('personnes')->where('id', $personneId)->first();

            if (! $personne) {
                continue;
            }

            $user = null;

            if ($personne->cin) {
                $user = DB::table('users')->where('cin', $personne->cin)->first();
            }

            if (! $user && $personne->email) {
                $user = DB::table('users')->where('email', $personne->email)->first();
            }

            if ($user) {
                $map[$personneId] = $user->id;

                continue;
            }

            $map[$personneId] = DB::table('users')->insertGetId([
                'name' => $personne->nom,
                'email' => $personne->email ?: "ancien-proprietaire-{$personneId}@bokinomby.local",
                'cin' => $personne->cin,
                'email_verified_at' => now(),
                'password' => Hash::make(Str::random(32)),
                'role' => 'employer',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        foreach ($map as $personneId => $userId) {
            DB::table('bovins')
                ->where('proprietaire_id', $personneId)
                ->update(['proprietaire_id' => $userId]);
        }

        Schema::table('bovins', function (Blueprint $table) {
            $table->foreign('proprietaire_id')
                ->references('id')
                ->on('users')
                ->cascadeOnDelete();
        });

        Schema::dropIfExists('personnes');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('personnes')) {
            return;
        }

        Schema::create('personnes', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->string('cin', 12)->nullable()->unique();
            $table->string('telephone', 30)->nullable();
            $table->string('email')->nullable();
            $table->timestamps();
        });

        Schema::table('bovins', function (Blueprint $table) {
            $table->dropForeign(['proprietaire_id']);
        });

        $ownerIds = DB::table('bovins')
            ->select('proprietaire_id')
            ->distinct()
            ->orderBy('proprietaire_id')
            ->pluck('proprietaire_id');

        $map = [];

        foreach ($ownerIds as $userId) {
            $user = DB::table('users')->where('id', $userId)->first();

            if (! $user) {
                continue;
            }

            $map[$userId] = DB::table('personnes')->insertGetId([
                'nom' => $user->name,
                'cin' => $user->cin,
                'email' => $user->email,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        foreach ($map as $userId => $personneId) {
            DB::table('bovins')
                ->where('proprietaire_id', $userId)
                ->update(['proprietaire_id' => $personneId]);
        }

        Schema::table('bovins', function (Blueprint $table) {
            $table->foreign('proprietaire_id')
                ->references('id')
                ->on('personnes')
                ->cascadeOnDelete();
        });
    }
};

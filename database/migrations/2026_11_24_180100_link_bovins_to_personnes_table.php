<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('bovins', function (Blueprint $table) {
            $table->dropForeign(['proprietaire_id']);
        });

        // Reprend les anciens propriétaires (utilisateurs) sous forme de personnes.
        $owners = DB::table('bovins')
            ->join('users', 'users.id', '=', 'bovins.proprietaire_id')
            ->select('bovins.proprietaire_id', 'users.name', 'users.email')
            ->distinct()
            ->get();

        foreach ($owners as $owner) {
            $personneId = DB::table('personnes')->insertGetId([
                'nom' => $owner->name,
                'email' => $owner->email,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            DB::table('bovins')
                ->where('proprietaire_id', $owner->proprietaire_id)
                ->update(['proprietaire_id' => $personneId]);
        }

        Schema::table('bovins', function (Blueprint $table) {
            $table->foreign('proprietaire_id')
                ->references('id')
                ->on('personnes')
                ->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bovins', function (Blueprint $table) {
            $table->dropForeign(['proprietaire_id']);
            $table->foreign('proprietaire_id')
                ->references('id')
                ->on('users')
                ->cascadeOnDelete();
        });
    }
};

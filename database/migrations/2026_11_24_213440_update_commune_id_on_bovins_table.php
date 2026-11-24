<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('bovins', function (Blueprint $table) {
            $table->dropConstrainedForeignId('quartier_id');

            $table->foreignId('commune_id')
                  ->after('dossier_sante')
                  ->constrained('communes');
        });
    }

    public function down(): void
    {
        Schema::table('bovins', function (Blueprint $table) {
            $table->dropConstrainedForeignId('commune_id');

            $table->foreignId('quartier_id')
                  ->after('dossier_sante')
                  ->constrained('quartiers');
        });
    }
};

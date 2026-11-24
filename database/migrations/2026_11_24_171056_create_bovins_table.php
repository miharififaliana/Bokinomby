<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('bovins', function (Blueprint $table) {
            $table->id();

            $table->string('numero_boucle')->unique();

            $table->foreignId('proprietaire_id')
                  ->constrained('proprietaires');

            $table->enum('sexe', ['male', 'femelle']);

            $table->json('signe_particulier')->nullable();

            $table->date('date_naissance');

            $table->date('date_deces')->nullable();

            $table->json('dossier_sante')->nullable();

            $table->foreignId('quartier_id')
                  ->constrained('quartiers');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bovins');
    }
};

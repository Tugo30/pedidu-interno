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
        Schema::table('services', function (Blueprint $table) {
            $table->decimal('preco_mensal', 10, 2)->nullable()->after('preco');
            $table->decimal('preco_trimestral', 10, 2)->nullable()->after('preco_mensal');
            $table->decimal('preco_semestral', 10, 2)->nullable()->after('preco_trimestral');
            $table->decimal('preco_anual', 10, 2)->nullable()->after('preco_semestral');
            // O campo 'preco' existente vira o preço do 'uma_vez'
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('services', function (Blueprint $table) {
            //
        });
    }
};

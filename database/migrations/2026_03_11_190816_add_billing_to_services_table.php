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
            $table->string('tipo_cobranca', 20)->default('gratuito')->after('preco');
            // gratuito, uma_vez, recorrente
            $table->string('periodicidade', 20)->nullable()->after('tipo_cobranca');
            // mensal, trimestral, semestral, anual
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

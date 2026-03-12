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
        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->onDelete('cascade');
            $table->foreignId('service_id')->constrained()->onDelete('cascade');
            $table->string('dominio', 255)->nullable();
            $table->enum('ciclo', ['mensal', 'trimestral', 'semestral', 'anual', 'uma_vez', 'gratuito'])->default('mensal');
            $table->integer('quantidade')->default(1);
            $table->decimal('preco_unitario', 10, 2); // preço do ciclo
            $table->decimal('preco_substituido', 10, 2)->nullable(); // override manual
            $table->decimal('subtotal', 10, 2);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_items');
    }
};

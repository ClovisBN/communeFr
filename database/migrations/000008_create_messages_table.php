<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMessagesTable extends Migration
{
    public function up()
    {
        Schema::create('messages', function (Blueprint $table) {
            $table->id();
            $table->string('title_message', 100);
            $table->json('content_message');
            $table->string('statuts', 20);
            $table->string('annexes_message', 100)->nullable();
            $table->foreignId('grievances_id')->constrained('grievances');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('messages');
    }
}

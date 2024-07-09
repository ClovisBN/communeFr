<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateNewscastsTable extends Migration
{
    public function up()
    {
        Schema::create('newscasts', function (Blueprint $table) {
            $table->id();
            $table->string('title_newscast', 100);
            $table->json('content_newscast');
            $table->foreignId('type_newscasts_id')->constrained('type_newscasts');
            $table->foreignId('user_id')->constrained('users');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('newscasts');
    }
}

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsersFormsTable extends Migration
{
    public function up()
    {
        Schema::create('users_forms', function (Blueprint $table) {
            $table->id();
            $table->json('answer');
            $table->foreignId('form_id')->constrained('forms');
            $table->foreignId('user_id')->constrained('users');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('users_forms');
    }
}

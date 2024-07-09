<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('type_newscasts', function (Blueprint $table) {
            $table->id();
            $table->string('name_type_newscast', 100);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('type_newscasts');
    }
};

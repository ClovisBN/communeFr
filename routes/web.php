<?php

use Illuminate\Support\Facades\Route;

// Route pour afficher la vue principale
Route::get('/{any}', function () {
    return view('welcome');
})->where('any', '.*');

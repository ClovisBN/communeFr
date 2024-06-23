<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\FormController;

// Route pour afficher le formulaire de création
Route::get('/', function () {
    return view('welcome');
});

// Route pour afficher la liste des formulaires
Route::get('/forms', function () {
    return view('forms');
});

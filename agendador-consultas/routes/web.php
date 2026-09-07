<?php

use App\Http\Controllers\Admin\PainelController;
use App\Http\Controllers\ConsultaController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware('auth')->group(function () {
    Route::get('/consultas/criar', [ConsultaController::class, 'create'])->name('consultas.create');
    Route::post('/consultas', [ConsultaController::class, 'store'])->name('consultas.store');
    Route::get('/minhas-consultas', [ConsultaController::class, 'index'])->name('consultas.index');
    Route::get('/consultas/{consulta}/editar', [ConsultaController::class, 'edit'])->name('consultas.edit');
    Route::put('/consultas/{consulta}', [ConsultaController::class, 'update'])->name('consultas.update');
    Route::patch('/consultas/{consulta}/cancelar', [ConsultaController::class, 'cancel'])->name('consultas.cancel');
    Route::patch('/consultas/{consulta}/confirmar', [ConsultaController::class, 'confirm'])->name('consultas.confirm');
    Route::delete('/consultas/{consulta}', [ConsultaController::class, 'destroy'])->name('consultas.destroy');
});

Route::middleware(['auth', 'role:admin'])->group(function () {
    Route::get('/painel', [PainelController::class, 'index'])->name('painel.index');
});

require __DIR__.'/auth.php';
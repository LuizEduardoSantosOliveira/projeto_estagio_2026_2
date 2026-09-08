<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Auth\Middleware\RedirectIfAuthenticated;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);
        RedirectIfAuthenticated::redirectUsing(function ($request) {
            return $request->user()->role === 'admin'
                ? route('painel.index')
                : route('consultas.index');
        });
    }
}

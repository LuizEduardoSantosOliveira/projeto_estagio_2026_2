<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Consulta;
use Inertia\Inertia;
use Inertia\Response;

class PainelController extends Controller
{
    public function index(): Response
    {
        $consultas = Consulta::with('user')
            ->when(request('status'), fn ($q) => $q->where('status', request('status')))
            ->when(request('tipo'), fn ($q) => $q->where('tipo', request('tipo')))
            ->when(request('data'), fn ($q) => $q->whereDate('data', request('data')))
            ->when(request('paciente'), function ($q) {
                $q->whereHas('user', fn ($sub) => $sub->where('name', 'like', '%' . request('paciente') . '%'));
            })
            ->orderBy('data')
            ->get();

        $contadores = [
            'pendentes' => Consulta::where('status', 'pendente')->count(),
            'confirmadas' => Consulta::where('status', 'confirmado')->count(),
            'canceladas' => Consulta::where('status', 'cancelado')->count(),
        ];

        return Inertia::render('Admin/Painel', [
            'consultas' => $consultas,
            'contadores' => $contadores,
            'filtros' => request()->only(['status', 'tipo', 'data', 'paciente']),
        ]);
    }
}
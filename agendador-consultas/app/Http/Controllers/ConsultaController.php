<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreConsultaRequest;
use App\Http\Requests\UpdateConsultaRequest;
use App\Models\Consulta;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ConsultaController extends Controller
{
    private const TIPOS = ['Clínica Geral', 'Cardiologia', 'Dermatologia', 'Pediatria'];

    public function index(): Response
    {
        $consultas = Consulta::where('user_id', auth()->id())
            ->orderBy('data')
            ->orderBy('horario')
            ->get();

        return Inertia::render('Consultas/Index', [
            'consultas' => $consultas,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Consultas/Create', [
            'tipos' => self::TIPOS,
        ]);
    }

    public function store(StoreConsultaRequest $request): RedirectResponse
    {
        $dados = $request->validated();
        $dados['user_id'] = auth()->id();
        $dados['status'] = 'pendente';

        Consulta::create($dados);

        return redirect()->route('consultas.index')->with('success', 'Consulta criada com sucesso.');
    }

    public function edit(Consulta $consulta): Response
    {
        $this->authorize('view', $consulta);

        return Inertia::render('Consultas/Edit', [
            'consulta' => $consulta,
            'tipos' => self::TIPOS,
        ]);
    }

    public function update(UpdateConsultaRequest $request, Consulta $consulta): RedirectResponse
    {
    $this->authorize('update', $consulta);

    $consulta->fill($request->validated());

    if ($consulta->isDirty(['tipo', 'data', 'horario', 'observacoes']) && $consulta->getOriginal('status') === 'confirmado') {
        $consulta->status = 'pendente';
    }

    $consulta->save();

    return redirect()->route('consultas.index')->with('success', 'Consulta atualizada.');
    }

    public function confirm(Consulta $consulta): RedirectResponse
    {
        $this->authorize('update', $consulta);

        abort_unless($consulta->status === 'pendente', 422, 'Só é possível confirmar consultas pendentes.');

        $consulta->update(['status' => 'confirmado']);

        return back()->with('success', 'Consulta confirmada.');
    }

    public function cancel(Consulta $consulta): RedirectResponse
    {
        $this->authorize('update', $consulta);

        abort_unless(
            in_array($consulta->status, ['pendente', 'confirmado'], true),
            422,
            'Esta consulta não pode ser cancelada.'
        );

        $consulta->update(['status' => 'cancelado']);

        return back()->with('success', 'Consulta cancelada.');
    }

    public function destroy(Consulta $consulta): RedirectResponse
    {
        $this->authorize('delete', $consulta);

        $consulta->delete();

        return redirect()->route('consultas.index')->with('success', 'Consulta excluída.');
    }
}
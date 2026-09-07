<?php

namespace App\Http\Requests;

use Carbon\Carbon;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;

class UpdateConsultaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'tipo' => ['required', 'in:Clínica Geral,Cardiologia,Dermatologia,Pediatria'],
            'data' => ['required', 'date', 'after_or_equal:today'],
            'horario' => ['required', 'date_format:H:i'],
            'observacoes' => ['nullable', 'string', 'max:500'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            if (! $this->filled('data') || ! $this->filled('horario')) {
                return;
            }

            $dataHora = Carbon::parse($this->input('data') . ' ' . $this->input('horario'));

            if ($dataHora->isPast()) {
                $validator->errors()->add(
                    'horario',
                    'Não é possível marcar uma consulta em um horário que já passou.'
                );
            }
        });
    }
}
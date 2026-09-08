<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Consulta extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'tipo',
        'data',
        'horario',
        'status',
        'observacoes',
    ];

    protected $appends = ['pode_ser_alterada'];

    protected function casts(): array
    {
    return [
        'data' => 'date:Y-m-d',
        'horario' => 'datetime:H:i',
    ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function podeSerAlterada(): bool
    {
        if ($this->status === 'cancelado') {
            return false;
        }

        $dataHora = Carbon::parse(
            $this->data->format('Y-m-d') . ' ' . $this->horario->format('H:i')
        );

        return $dataHora->isFuture();
    }

    public function getPodeSerAlteradaAttribute(): bool
    {
        return $this->podeSerAlterada();
    }
}
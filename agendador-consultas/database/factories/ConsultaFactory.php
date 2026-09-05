<?php

namespace Database\Factories;

use App\Models\Consulta;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ConsultaFactory extends Factory
{
    protected $model = Consulta::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'tipo' => fake()->randomElement(['Clínica Geral', 'Cardiologia', 'Dermatologia', 'Pediatria']),
            'data' => fake()->dateTimeBetween('now', '+30 days')->format('Y-m-d'),
            'horario' => fake()->time('H:i'),
            'status' => fake()->randomElement(['pendente', 'confirmado', 'cancelado']),
            'observacoes' => fake()->optional()->sentence(),
        ];
    }
}
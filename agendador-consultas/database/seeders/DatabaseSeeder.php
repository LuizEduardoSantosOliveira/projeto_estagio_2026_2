<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Consulta;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call(AdminSeeder::class);

        $pacientes = User::factory(5)->create(['role' => 'paciente']);

        Consulta::factory(15)->recycle($pacientes)->create();
    }
}
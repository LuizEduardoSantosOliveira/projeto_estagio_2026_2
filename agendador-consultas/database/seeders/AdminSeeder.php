<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Administrador',
            'email' => 'admin@agendador.test',
            'password' => bcrypt(env('ADMIN_SEED_PASSWORD', 'senha-padrao-dev')),
            'role' => 'admin',
            'email_verified_at' => now(),
        ]);
    }
}
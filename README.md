# Agendador de Consultas

Sistema de agendamento de consultas médicas com página pública para o paciente marcar uma consulta e um painel administrativo para o time da clínica acompanhar tudo que chegou.

Feito como teste técnico para a vaga de Estágio em Tecnologia - Desenvolvimento Full Stack (Mupi Systems).

## Sobre o projeto

O sistema tem dois tipos de usuário, diferenciados por uma coluna `role` na tabela de usuários:

- **Paciente**: cria conta, agenda consultas, acompanha e gerencia as próprias solicitações
- **Admin**: acessa um painel de gestão para visualizar todas as consultas recebidas

### Funcionalidades

- Cadastro e login de paciente (via Laravel Breeze)
- Agendamento de consulta com tipo, data e horário
- Consulta nasce sempre com status `pendente`
- Paciente confirma ou cancela a própria consulta em `/minhas-consultas`
- Edição de consulta bloqueada quando ela já passou ou foi cancelada (regra centralizada no método `podeSerAlterada()` do model)
- Painel administrativo com listagem ordenada por data, status visível, contadores e filtro
- Proteção de rota por autenticação (`middleware auth`) e por papel (`middleware role:admin`)

## Como funciona

### Fluxo do paciente

1. Acessa a página pública e cria uma conta (ou faz login, se já tiver)
2. Preenche o formulário de agendamento: tipo de consulta, data e horário
3. Envia — a consulta é salva com status `pendente` e o paciente recebe confirmação visual
4. Acessa `/minhas-consultas` para ver o que já agendou
5. Pode confirmar uma consulta pendente ou cancelá-la a qualquer momento (enquanto ela ainda puder ser alterada)
6. Tentar editar uma consulta de outro paciente, mesmo sabendo o ID pela URL, retorna `403` — a permissão é verificada no backend via Policy, não só escondida no frontend

### Fluxo do admin

1. Acessa `/painel` sem estar logado → é redirecionado para o login
2. Faz login com as credenciais do admin (ver seção [Criando o usuário admin](#criando-o-usuário-admin))
3. Visualiza todas as consultas de todos os pacientes, ordenadas por data, com o status de cada uma visível (badge colorida)
4. Usa os contadores e o filtro por status para priorizar o que precisa de atenção
5. Consegue encerrar a sessão (logout)

Um paciente comum que tenta acessar `/painel` recebe `403` — o acesso é restrito por papel, não só por estar autenticado.

## Modelo de dados

Cada consulta (`Consulta`) guarda:

| Campo | Descrição |
|---|---|
| `user_id` | referência ao paciente que agendou (FK para `users`) |
| `tipo` | uma entre: Clínica Geral, Cardiologia, Dermatologia, Pediatria |
| `data` | data da consulta |
| `horario` | horário da consulta |
| `status` | `pendente`, `confirmado` ou `cancelado` — nasce sempre `pendente` |
| `observacoes` | campo livre, opcional |
| `created_at` | data de criação do registro |

A tabela `users` (padrão do Breeze) recebeu uma coluna adicional `role`, restrita a `paciente` ou `admin`, usada para diferenciar o que cada tipo de usuário pode acessar.

## Stack utilizada

- **Backend**: Laravel 11
- **Autenticação**: Laravel Breeze (stack Inertia + React) — login, cadastro, logout e proteção de rota prontos, sem reinventar
- **Frontend**: React, renderizado via Inertia.js (sem precisar montar uma API REST separada)
- **Estilo**: Tailwind CSS v4, cores customizadas via `@theme` no CSS
- **Banco de dados**: MySQL
- **Autorização**: Laravel Policies (`ConsultaPolicy`) + middleware de papel (`EnsureUserHasRole`)

O porquê de cada escolha, incluindo os trade-offs, está detalhado no `DECISOES.md`.

## Pré-requisitos

- PHP >= 8.2
- Composer
- Node.js >= 18 e npm
- MySQL rodando localmente (ou outro servidor MySQL/MariaDB acessível)

## Instalação

Clone o repositório e entre na pasta do projeto, depois instale as dependências de backend e frontend:

```bash
composer install
npm install
```

Copie o arquivo de variáveis de ambiente e gere a chave da aplicação:

```bash
cp .env.example .env
php artisan key:generate
```

## Configuração do banco de dados

Crie um banco de dados MySQL chamado `agenda_consultas` (ou o nome que preferir, desde que ajuste o `.env` de acordo):

```sql
CREATE DATABASE agenda_consultas;
```

No `.env`, configure a conexão:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=agenda_consultas
DB_USERNAME=root
DB_PASSWORD=
```

Ajuste `DB_USERNAME` e `DB_PASSWORD` conforme a configuração do seu MySQL local.

Rode as migrations (cria as tabelas padrão do Breeze e a tabela `consultas`, além da coluna `role` em `users`):

```bash
php artisan migrate
```

## Criando o usuário admin

O usuário admin é criado via seeder, não por cadastro público — não existe tela de registro para essa função. Rode:

```bash
php artisan db:seed --class=AdminSeeder
```

**Credenciais de acesso ao painel**:
- **Email**: `admin@agendador.test`
- **Senha**: `senha-padrao-dev`

## Dados de exemplo (opcional)

Para popular o banco com pacientes e consultas fictícias, útil pra não testar o painel vazio:

```bash
php artisan db:seed
```

Isso roda o `DatabaseSeeder` completo, que garante a criação do admin e gera consultas de exemplo via `ConsultaFactory`, cada uma vinculada a um paciente fictício também criado na hora.

## Subindo a aplicação

Em dois terminais separados, na raiz do projeto:

```bash
php artisan serve
```
```bash
npm run dev
```

A aplicação responde em `http://localhost:8000`. O segundo comando precisa continuar rodando em segundo plano — é ele quem compila o frontend React em tempo real.

## Rotas principais

| Rota | Acesso | Descrição |
|---|---|---|
| `/` | público | tela de login (rota raiz do projeto) |
| `/register` | público | cadastro do paciente (Breeze) |
| `/minhas-consultas` | paciente autenticado | lista as próprias consultas |
| `/consultas/{id}/editar` | paciente autenticado, dono | edita uma consulta própria |
| `/painel` | admin autenticado | lista todas as consultas do sistema |

## Como foi validado

Como o projeto não tem testes automatizados (ver seção abaixo), a validação foi feita com um roteiro de testes manuais cobrindo os pontos mais sensíveis de autorização:

1. Paciente A cria uma consulta
2. Paciente B tenta editar a consulta do A pela URL direta → `403`
3. Paciente A confirma a consulta, tenta confirmar de novo → bloqueado
4. Paciente A cancela a consulta, tenta editar depois → `403`
5. Admin loga e acessa `/painel` → vê a listagem, contadores e filtro
6. Usuário desloga e tenta acessar `/painel` direto pela URL, em aba anônima → redirecionado para o login
7. Paciente comum tenta acessar `/painel` → `403`

## Testes automatizados

Este projeto não possui testes automatizados. A validação foi feita manualmente, conforme o roteiro acima — essa decisão consciente está registrada no `DECISOES.md`.

## Decisões de projeto

As decisões conscientes tomadas ao longo do desenvolvimento — incluindo ambiguidades da especificação, trade-offs de modelagem e o uso de IA — estão documentadas no `DECISOES.md`.
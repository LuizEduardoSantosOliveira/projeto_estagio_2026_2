# Decisões do projeto

## Tema e stack

**Tema**: agendamento de consultas médicas. Escolhi clínica porque é um domínio com regras de negócio reais e não triviais (conflito de horário, quem tem permissão de confirmar/cancelar, o que acontece quando uma consulta já passou), o que dá espaço pra mostrar julgamento além de um CRUD simples.

**Stack**: Laravel 11 + Breeze (Inertia + React) + MySQL. Escolhi porque já domino Laravel e queria usar a autenticação pronta do framework em vez de reinventar login.

- **Ganhos**: Breeze entrega login, cadastro, logout e proteção de rota prontos; Inertia elimina a necessidade de montar uma API REST separada com CORS e gerenciamento de token só para o front conversar com o back — é um monolito coeso, mais rápido de entregar no prazo do teste.
- **Perdas**: o front fica acoplado ao Inertia, não é uma SPA que poderia ser consumida por outro cliente (app mobile, por exemplo) sem trabalho extra. Também abro mão de demonstrar uma arquitetura de API REST isolada.

## Ambiguidades percebidas e decisões

**Papéis de usuário — coluna `role` em `users` vs. tabelas separadas.** Considerei separar `pacientes` e `admins` em tabelas próprias, mas optei por uma coluna `role` (`paciente`/`admin`) na tabela `users` padrão do Breeze. Ganho: reaproveito toda a autenticação pronta sem precisar configurar múltiplos guards. Perda: a separação de permissões depende de checagem manual (middleware + Policy) em vez de estar estruturalmente isolada por tabela.

**Apagar um paciente apaga as consultas dele (`cascadeOnDelete`).** A alternativa seria impedir a exclusão do paciente enquanto ele tiver consultas ativas (`restrictOnDelete`), o que seria mais correto para um sistema real de clínica (histórico não deveria sumir). Optei pela simplicidade do cascade para o escopo do teste, ciente da perda de rastreabilidade que isso implica.

**Quem confirma/cancela a consulta é o paciente, não o admin.** Decisão de modelagem: confirmar presença é uma escolha de quem marcou a consulta, não de quem administra a agenda. Isso também simplifica o papel do admin de volta ao que a especificação pede — leitura, não escrita.

**Duas regras distintas controlam o ciclo de vida da consulta.** A Policy (`update`) bloqueia totalmente a edição ou o cancelamento de consultas que já não fazem mais sentido alterar (via `podeSerAlterada()` no model). Separadamente, dentro do `ConsultaController::update()`, uma segunda regra decide se a edição feita invalida uma confirmação anterior: qualquer mudança em `tipo`, `data`, `horario` **ou `observacoes`** faz uma consulta `confirmado` voltar para `pendente`. Inclui `observacoes` de propósito — decidi por uma regra única e fácil de explicar ("qualquer edição exige nova confirmação") em vez de distinguir campos que afetam o agendamento de campos cosméticos, mesmo sabendo que isso é mais rígido do que estritamente necessário.

**Confirmar só é permitido a partir de `pendente`.** Uma consulta já confirmada ou cancelada não pode ser confirmada de novo (`confirm()` rejeita com `422`). **Cancelar é permitido a partir de `pendente` ou `confirmado`**, mas não a partir de `cancelado` — evita cancelar duas vezes o mesmo registro.

**Cancelar (soft) e excluir (hard delete) coexistem como ações distintas.** Além do `cancel()`, que só muda o `status` e preserva o registro, existe um `destroy()` que remove a consulta definitivamente do banco. São pensados para casos diferentes: cancelar é a ação que o paciente usa quando desiste de um agendamento real (mantém histórico); excluir existe como capacidade adicional do CRUD gerado, útil por exemplo para remover um registro de teste ou duplicado. Vale registrar que, num sistema real de clínica, eu restringiria ou removeria a exclusão definitiva do lado do paciente, para não perder rastreabilidade — para o escopo do teste, mantive as duas ações disponíveis.

**Lista fixa de tipos de consulta** (Clínica Geral, Cardiologia, Dermatologia, Pediatria) em vez de cadastro de médicos. Dá o "mínimo de 3 opções" pedido sem exigir uma tela de gestão de corpo clínico, que ficaria fora do escopo do teste.

**Painel sem nenhum registro ainda.** Tratado com estado vazio explícito na interface, em vez de deixar a tabela aparecer em branco sem explicação.

**Filtros do painel administrativo (além do mínimo pedido).** O admin pode filtrar a listagem por status, tipo de consulta, data e nome do paciente (busca parcial), combináveis entre si. Os contadores de pendentes/confirmadas/canceladas mostrados no topo são **globais** — refletem o total do sistema, não o recorte filtrado no momento. Decisão consciente de simplicidade: contadores "ao vivo" que mudassem junto com o filtro seriam mais informativos, mas exigiriam outra query ou lógica no frontend só para isso, e não é o que o "básico" pede.

## O que decidi não fazer

- **Tabela própria de médicos e disponibilidade por profissional**: daria mais realismo (cada médico com seu próprio horário), mas exigiria uma tela de cadastro inteira fora do escopo pedido.
- **Testes automatizados**: optei por um roteiro de testes manuais (documentado no README) em vez de escrever suíte automatizada, priorizando o tempo em regras de autorização e no fluxo funcional completo.
- **Notificação por email/lembrete de consulta**: exigiria configurar envio de email, infraestrutura fora do escopo do teste.

## Uso de IA

**O que delegou e o que fez à mão.** Usei IA para acelerar a parte mecânica: sequência de comandos `artisan`, estrutura de pastas convencional do Laravel, e como padrões como Policy e Form Request costumam ser organizados. A lógica de negócio em si — o que exatamente `podeSerAlterada()` verifica, quem pode mudar o status de uma consulta, o trade-off entre `cascadeOnDelete` e `restrictOnDelete` — foram decisões que tomei eu, avaliando o que fazia sentido pro tema.

**Uma vez em que a IA errou.** Ao estilizar a tela de login com Tailwind, a cor customizada (`bg-clinical-800`) simplesmente não aparecia — botões ficavam brancos. A primeira tentativa de correção assumiu uma configuração de Tailwind v3 (`tailwind.config.js`), que não funcionou. Percebi que o projeto usava Tailwind v4, que mudou completamente a forma de declarar cores (via `@theme` no CSS, não mais no arquivo de config), e foi preciso corrigir a abordagem depois de confirmar a versão instalada no `package.json`.

**Uma decisão tomada contra a sugestão da IA.** Foi sugerido separar pacientes e admins em tabelas totalmente distintas, com dois guards de autenticação independentes (um para cada). Optei por manter os dois papéis na mesma tabela `users`, com uma coluna `role`, porque isso me permitia reaproveitar 100% da autenticação pronta do Breeze sem precisar configurar múltiplos guards do Sanctum manualmente — um trade-off consciente de simplicidade de implementação em troca de uma separação de responsabilidades menos rígida.

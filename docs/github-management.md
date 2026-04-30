# Plano de Gestão do GitHub

## Issues sugeridas

### Issue 1

**Título:** Adicionar testes de contrato para a documentação Swagger

**Descrição:**
Expandir a cobertura automatizada para o contrato OpenAPI exposto em `/docs.json`. O objetivo é validar os schemas de resposta documentados, parâmetros de query e requisitos de autenticação, a fim de reduzir a divergência entre implementação e documentação.

**Critérios de aceitação:**

- Validar os caminhos críticos da spec OpenAPI
- Cobrir `/users`, `/users/me`, `/auth/login` e `/tasks`
- Falhar rapidamente quando parâmetros documentados divergirem da implementação

### Issue 2

**Título:** Melhorar a resiliência da persistência JSON para escritas concorrentes

**Descrição:**
O MVP utiliza intencionalmente persistência em arquivo JSON, mas isso cria uma limitação conhecida em relação a escritas concorrentes e isolamento de testes. Investigar formas de reduzir o risco e documentar os trade-offs.

**Critérios de aceitação:**

- Documentar a limitação de concorrência
- Propor ou implementar uma estratégia simples de serialização de escrita
- Adicionar pelo menos um teste ou nota técnica demonstrando o risco

### Issue 3

**Título:** Adicionar proteção de branch e política de merge via CI para a main

**Descrição:**
Agora que o projeto possui pipeline no GitHub Actions, o repositório deve adotar um fluxo de merge mais seguro em torno da `main`.

**Critérios de aceitação:**

- Definir `main` como branch padrão
- Exigir pull requests para alterações na `main`
- Exigir que o CI passe antes do merge

## Sequência sugerida de pull requests

### PR 1

**Branch:** `codex/api-foundation`
**Título:** Inicializar a fundação da API com health check

### PR 2

**Branch:** `codex/swagger-documentation`
**Base:** `codex/api-foundation`
**Título:** Adicionar documentação Swagger para os endpoints da API

### PR 3

**Branch:** `codex/readme-and-env-setup`
**Base:** `codex/swagger-documentation`
**Título:** Adicionar configuração de ambiente e melhorar o README

### PR 4

**Branch:** `codex/error-handling-refinement`
**Base:** `codex/readme-and-env-setup`
**Título:** Refinar as respostas de tratamento global de erros

### PR 5

**Branch:** `codex/ci-pipeline`
**Base:** `codex/error-handling-refinement`
**Título:** Adicionar pipeline de testes com GitHub Actions

### PR 6

**Branch:** `codex/release-readiness`
**Base:** `codex/ci-pipeline`
**Título:** Polir metadados públicos e documentação do projeto

### PR 7

**Branch:** `codex/task-filters-and-search`
**Base:** `codex/release-readiness`
**Título:** Adicionar filtros de tarefas e suporte a busca por query

### PR 8

**Branch:** `codex/sorting-and-pagination`
**Base:** `codex/task-filters-and-search`
**Título:** Adicionar ordenação e paginação de tarefas

### PR 9

**Branch:** `codex/auth-me-endpoint`
**Base:** `codex/sorting-and-pagination`
**Título:** Adicionar endpoint de perfil do usuário autenticado

## Observação importante

Se preferir um fluxo de revisão mais curto no GitHub, essas alterações também podem ser agrupadas em menos PRs:

- Fundação e autenticação
- Documentação e CI
- Busca, ordenação, paginação e perfil do usuário autenticado

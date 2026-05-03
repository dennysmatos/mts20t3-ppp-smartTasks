# Testes de Performance com K6

## Visão Geral

Os testes de performance da SmartTasks API são implementados com [Grafana K6](https://k6.io/), uma ferramenta de teste de carga moderna baseada em JavaScript. Os testes validam que a API mantém tempos de resposta aceitáveis e baixa taxa de erros sob diferentes níveis de carga.

---

## Pré-requisitos

K6 deve ser instalado separadamente (não é uma dependência Node.js):

```bash
# macOS
brew install k6

# Ubuntu/Debian
sudo gpg --no-default-keyring \
  --keyring /usr/share/keyrings/k6-archive-keyring.gpg \
  --keyserver hkp://keyserver.ubuntu.com:80 \
  --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" \
  | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt-get update && sudo apt-get install k6

# Verificar instalação
k6 version
```

A API deve estar em execução antes de rodar os testes:

```bash
cp .env.example .env
npm start
```

---

## Estrutura dos Arquivos

```
test/performance/
├── cenarios/
│   ├── smoke.js       # Smoke test (1 VU, 1 min)
│   ├── carga.js       # Teste de carga (0→10 VUs, ~4m30s)
│   └── estresse.js    # Teste de estresse (0→50 VUs, ~9 min)
└── helpers/
    ├── api.js         # Funções HTTP reutilizáveis
    └── relatorio.js   # Gerador de relatórios HTML/texto
```

Os relatórios gerados são salvos em `relatorios/` (pasta ignorada pelo git).

---

## Cenários

### Smoke Test (`smoke.js`)

Verifica que todos os endpoints respondem corretamente com carga mínima.

| Configuração | Valor                                  |
| ------------ | -------------------------------------- |
| VUs          | 1                                      |
| Duração      | 1 minuto                               |
| Thresholds   | P95 < 2000ms, erros < 1%, checks > 99% |

**Fluxo testado (por iteração):**

1. `GET /health`
2. `POST /users` — criar usuário único
3. `POST /auth/login` — autenticar
4. `GET /users/me` — perfil autenticado
5. `POST /tasks` — criar tarefa
6. `GET /tasks` — listar tarefas
7. `GET /tasks` com filtro de status
8. `GET /tasks/:id` — obter por ID
9. `PATCH /tasks/:id` — atualizar status
10. `DELETE /tasks/:id` — excluir

**Execução:**

```bash
npm run test:performance
# ou diretamente:
k6 run test/performance/cenarios/smoke.js
```

---

### Teste de Carga (`carga.js`)

Simula uso concorrente normal com múltiplos usuários realizando operações CRUD completas.

| Configuração | Valor                                  |
| ------------ | -------------------------------------- |
| Estágio 1    | 0→5 VUs em 30s                         |
| Estágio 2    | 5 VUs por 1 minuto                     |
| Estágio 3    | 5→10 VUs em 30s                        |
| Estágio 4    | 10 VUs por 2 minutos                   |
| Estágio 5    | 10→0 VUs em 30s                        |
| **Total**    | **~4 minutos e 30 segundos**           |
| Thresholds   | P95 < 1500ms, P99 < 3000ms, erros < 5% |

**Jornada do usuário:**

- Criar conta e autenticar (cada VU usa e-mail único)
- Carregar perfil
- Criar 3 tarefas com conteúdo realista
- Listar tarefas (sem filtro, com filtro por status, paginado)
- Obter tarefa específica
- Atualizar status
- Concluir e excluir todas as tarefas criadas

**Execução:**

```bash
npm run test:performance:carga
```

---

### Teste de Estresse (`estresse.js`)

Aumenta a carga progressivamente para identificar o ponto de degradação da API.

| Configuração | Valor                                                                    |
| ------------ | ------------------------------------------------------------------------ |
| Estágios     | 0→10→20→30→40→50 VUs (1 min cada)                                        |
| Pico         | 50 VUs por 2 minutos                                                     |
| Recuperação  | 50→0 VUs em 1 minuto                                                     |
| **Total**    | **~9 minutos**                                                           |
| Thresholds   | P95 < 5000ms, erros < 30% (permissivos — objetivo é observar degradação) |

> **Atenção:** Este teste esgota propositalmente a capacidade da API. Espera-se aumento progressivo na taxa de erros à medida que os VUs crescem. A API usa persistência em arquivo JSON, tornando-a especialmente sensível a escritas concorrentes. **Nunca execute em ambiente de produção.**

**Execução:**

```bash
npm run test:performance:estresse
```

---

## Executando Todos os Cenários

```bash
# Smoke + Carga
npm run test:performance:todos

# Individualmente
npm run test:performance          # smoke
npm run test:performance:carga    # carga
npm run test:performance:estresse # estresse
```

---

## Métricas e Relatórios

Após cada execução, os arquivos são gerados em `relatorios/`:

| Arquivo         | Descrição                               |
| --------------- | --------------------------------------- |
| `smoke.html`    | Relatório HTML interativo do smoke test |
| `smoke.json`    | Dados brutos em JSON para automação     |
| `carga.html`    | Relatório HTML do teste de carga        |
| `carga.json`    | Dados brutos do teste de carga          |
| `estresse.html` | Relatório HTML do teste de estresse     |
| `estresse.json` | Dados brutos do teste de estresse       |

### Métricas Monitoradas

| Métrica K6          | Descrição                                                       |
| ------------------- | --------------------------------------------------------------- |
| `http_req_duration` | Duração total da requisição (min, avg, med, P90, P95, P99, max) |
| `http_req_failed`   | Taxa de requisições com status ≥ 400                            |
| `http_reqs`         | Total e taxa de requisições por segundo                         |
| `checks`            | Taxa de sucesso das verificações customizadas                   |
| `taxa_erros`        | Métrica customizada: falhas de fluxo de negócio                 |
| `duracao_login_ms`  | Trend customizado: duração específica do login                  |
| `duracao_crud_ms`   | Trend customizado: duração completa do fluxo CRUD               |
| `tarefas_criadas`   | Contador de tarefas criadas com sucesso                         |
| `usuarios_criados`  | Contador de usuários criados com sucesso                        |

---

## Integração Contínua (GitHub Actions)

O workflow `.github/workflows/performance.yml` executa os testes de performance com as seguintes regras:

| Gatilho                           | Cenário executado                               |
| --------------------------------- | ----------------------------------------------- |
| `pull_request` para `main`        | Smoke test (sempre)                             |
| `schedule` (toda segunda, 3h UTC) | Smoke + Carga                                   |
| `workflow_dispatch`               | Configurável (smoke / carga / estresse / todos) |

**Para disparar manualmente no GitHub:**

1. Acesse **Actions → Testes de Performance K6**
2. Clique em **Run workflow**
3. Selecione o cenário desejado

Os relatórios HTML e JSON são publicados como artefatos (retenção: 30 dias) e um resumo é comentado automaticamente no PR.

---

## Resultados de Referência (Ambiente Local)

Resultados obtidos na máquina de desenvolvimento com persistência em arquivo JSON:

### Smoke Test (2026-05-03)

| Métrica              | Valor          |
| -------------------- | -------------- |
| Total de Requisições | 120            |
| Taxa de Requisições  | 1.86/s         |
| Duração Média        | 26.36ms        |
| P95 Duração          | 92ms           |
| P90 Duração          | 85.73ms        |
| Taxa de Erros        | 0%             |
| Checks com Sucesso   | 228/228 (100%) |

> Todos os thresholds foram atendidos com ampla margem.

---

## Isolamento de Dados

Cada VU cria seus próprios usuários com e-mails únicos no formato `<cenario>-vu<N>-it<I>@perf.teste`, garantindo isolamento entre VUs concorrentes.

**Após os testes**, os arquivos `src/data/users.json` e `src/data/tasks.json` conterão os registros criados. Para limpar:

```bash
echo '[]' > src/data/users.json
echo '[]' > src/data/tasks.json
```

---

## Variáveis de Ambiente

| Variável   | Padrão                  | Descrição       |
| ---------- | ----------------------- | --------------- |
| `BASE_URL` | `http://localhost:3000` | URL base da API |

Exemplo com URL customizada:

```bash
k6 run -e BASE_URL=http://staging.api.com:3000 test/performance/cenarios/smoke.js
```

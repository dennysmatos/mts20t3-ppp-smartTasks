# Smart Tasks API

Projeto de portfólio desenvolvido para a Mentoria em Testes de Software 2.0 do Julio de Lima, com foco em qualidade de software, testes de API e boas práticas de engenharia.

## Objetivo

Construir uma API REST realista para gerenciamento de tarefas com autenticação JWT, documentação Swagger e cobertura automatizada de testes de integração.

## Stack

- **Runtime:** Node.js 20+ com ES Modules nativos
- **Framework:** Express 5
- **Autenticação:** JWT (jsonwebtoken + bcryptjs)
- **Testes:** Mocha, Chai, Supertest
- **Documentação:** Swagger UI (swagger-jsdoc + swagger-ui-express)
- **Persistência:** Arquivo JSON

## Funcionalidades

- Cadastro de usuário com senha criptografada (bcrypt)
- Autenticação com JWT
- Consulta do usuário autenticado em `GET /users/me`
- Rotas protegidas por Bearer Token
- CRUD de tarefas
- Filtros por status e busca textual
- Ordenação e paginação na listagem de tarefas
- Autorização baseada em ownership
- Validação de payload (campos obrigatórios, tipos, campos desconhecidos)
- Documentação OpenAPI via Swagger UI
- Testes automatizados de integração
- Pipeline CI com GitHub Actions

## Arquitetura

O projeto adota uma arquitetura em camadas para separar responsabilidades e facilitar manutenção e testabilidade:

| Camada         | Responsabilidade                                          |
|----------------|-----------------------------------------------------------|
| `routes`       | Definição dos endpoints e anotações Swagger               |
| `controllers`  | Orquestração do fluxo HTTP (request → service → response) |
| `services`     | Regras de negócio e lógica de domínio                     |
| `repositories` | Acesso e persistência dos dados em JSON                   |
| `middlewares`  | Autenticação, validação de payload e tratamento de erros  |
| `utils`        | Helpers compartilhados (JWT, UUID, validação, I/O)        |

## Endpoints

### Health

- `GET /health`

### Usuários

- `POST /users`
- `GET /users/me` *(requer autenticação)*

### Autenticação

- `POST /auth/login`

### Tarefas *(todas requerem autenticação)*

- `POST /tasks`
- `GET /tasks`
- `GET /tasks/:id`
- `PATCH /tasks/:id`
- `DELETE /tasks/:id`

## Documentação da API

Com a aplicação em execução:

- **Swagger UI:** `http://localhost:3000/docs`
- **OpenAPI JSON:** `http://localhost:3000/docs.json`

## Estratégia de testes

Os testes de integração cobrem:

- Cadastro de usuário (criação com hash, conflito de e-mail, validação)
- Autenticação válida e inválida (credenciais incorretas, e-mail não cadastrado)
- Consulta do perfil autenticado
- Proteção de rotas por JWT (token ausente, inválido)
- Criação, listagem, busca, atualização e exclusão de tarefas
- Filtros por status e busca textual (case-insensitive)
- Ordenação e paginação de tarefas
- Cenários negativos: payload inválido, campos desconhecidos
- Acesso a recurso de outro usuário retornando `404`
- JSON malformado retornando `400`
- Rota inexistente retornando `404`

## Como executar localmente

**1. Instalar dependências:**

```bash
npm install
```

**2. Criar `.env` a partir do `.env.example`:**

```env
PORT=3000
JWT_SECRET=substitua-por-um-segredo-seguro
JWT_EXPIRES_IN=1h
```

**3. Iniciar em modo de desenvolvimento:**

```bash
npm run dev
```

**4. Executar os testes:**

```bash
npm test
```

## Observações

- A persistência em JSON foi escolhida para o MVP, priorizando foco em API e qualidade.
- O projeto usa ES Modules nativos (`import`/`export`) — não há transpilação nem TypeScript.
- O arquivo `test/setup.cjs` define as variáveis de ambiente de teste e é carregado pelo Mocha via `--require` (CommonJS explícito para compatibilidade).
- O repositório possui pipeline de CI para execução automática da suíte de testes.

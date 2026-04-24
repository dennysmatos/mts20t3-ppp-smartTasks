# Smart Tasks API

Projeto de portfólio desenvolvido para a Mentoria em Testes de Software 2.0 do Julio de Lima, com foco em qualidade de software, testes de API e boas práticas de engenharia.

## Objetivo

Construir uma API REST realista para gerenciamento de tarefas com autenticação JWT, documentação Swagger e cobertura automatizada de testes de integração.

## Stack

- Node.js
- JavaScript
- Express
- Mocha
- Chai
- Supertest
- JWT
- Swagger
- Persistência em arquivo JSON

## Funcionalidades atuais

- cadastro de usuário com senha criptografada
- autenticação com JWT
- consulta do usuário autenticado em `GET /users/me`
- rotas protegidas por Bearer Token
- CRUD de tarefas
- filtros por status e busca textual
- ordenação e paginação na listagem de tarefas
- autorização baseada em ownership
- validação de payload
- documentação OpenAPI
- testes automatizados de integração
- pipeline CI com GitHub Actions

## Arquitetura

O projeto está organizado em camadas para separar responsabilidades e facilitar manutenção e testabilidade:

- `routes`: definição dos endpoints
- `controllers`: fluxo HTTP de entrada e saída
- `services`: regras de negócio
- `repositories`: persistência em JSON
- `middlewares`: autenticação, validação e tratamento de erro
- `utils`: helpers compartilhados

## Endpoints

### Health

- `GET /health`

### Users

- `POST /users`
- `GET /users/me`

### Authentication

- `POST /auth/login`

### Tasks

- `POST /tasks`
- `GET /tasks`
- `GET /tasks/:id`
- `PATCH /tasks/:id`
- `DELETE /tasks/:id`

## Documentação da API

Com a aplicação em execução:

- Swagger UI: `http://localhost:3000/docs`
- OpenAPI JSON: `http://localhost:3000/docs.json`

## Estratégia de testes

Os testes de integração atuais cobrem:

- cadastro de usuário
- autenticação válida e inválida
- consulta do perfil autenticado
- proteção de rotas por JWT
- criação, listagem, busca, atualização e exclusão de tarefas
- filtros, ordenação e paginação de tarefas
- cenários negativos com payload inválido
- acesso a recurso de outro usuário retornando `404`
- campos desconhecidos em payload retornando `400`
- JSON malformado retornando `400`
- rota inexistente retornando `404`

## Como executar localmente

1. Instalar dependências:

```bash
npm install
```

2. Criar `.env` com base em `.env.example`

```env
PORT=3000
JWT_SECRET=replace-with-a-secure-secret
JWT_EXPIRES_IN=1h
```

3. Iniciar a aplicação:

```bash
npm run dev
```

4. Executar os testes:

```bash
npm test
```

## Observações

- A persistência em JSON foi escolhida para o MVP, priorizando foco em API e qualidade.
- O projeto não usa banco de dados nesta fase.
- A solução foi construída com histórico de commits e branches pensado para apresentação profissional no GitHub.
- O repositório possui pipeline de CI para execução automática da suíte de testes.

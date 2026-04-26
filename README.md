# SmartTasks — API de Gerenciamento de Tarefas

API REST construída como projeto de portfólio de QA para demonstrar testes de integração, autenticação JWT, arquitetura em camadas e boas práticas de engenharia de software.

## Objetivos

- Construir uma API REST realista com endpoints protegidos por autenticação
- Demonstrar automação de testes de integração com Mocha, Chai e Supertest
- Aplicar separação clara de responsabilidades em camadas (controller → service → repository)
- Documentar o contrato da API com Swagger/OpenAPI
- Exibir práticas de engenharia profissional em repositório público

## Tecnologias


| Categoria    | Tecnologia                                              |
| ------------ | ------------------------------------------------------- |
| Runtime      | Node.js 20+ com ES Modules nativos (`"type": "module"`) |
| Framework    | Express 5                                               |
| Autenticação | JWT (`jsonwebtoken`) + hash de senha (`bcryptjs`)       |
| Testes       | Mocha, Chai, Supertest                                  |
| Cobertura    | nyc (Istanbul)                                          |
| Documentação | Swagger UI (`swagger-jsdoc` + `swagger-ui-express`)     |
| Linting      | ESLint + Prettier                                       |
| Persistência | Arquivo JSON (MVP)                                      |


## Funcionalidades

- Registro de usuários com senha criptografada (bcrypt)
- Autenticação via JWT com expiração configurável
- Endpoints de tarefas protegidos por Bearer Token
- Consulta do perfil do usuário autenticado (`GET /users/me`)
- Autorização baseada em ownership — cada usuário acessa apenas seus próprios recursos
- Filtro de tarefas por status e busca textual (título e descrição)
- Ordenação e paginação na listagem de tarefas
- Tratamento centralizado de erros com respostas padronizadas
- Documentação OpenAPI gerada a partir de JSDoc annotations nas rotas
- Pipeline de CI com GitHub Actions (lint, testes, cobertura, segurança)

## Estrutura do Projeto

```text
src/
  server.js            # Ponto de entrada
  app.js               # Configuração do Express
  config/
    env.js             # Variáveis de ambiente
  controllers/         # Camada HTTP — parse de request e formatação de response
  services/            # Regras de negócio
  repositories/        # Acesso a dados (JSON)
  routes/              # Definição de endpoints e anotações Swagger
  middlewares/         # Autenticação, validação por endpoint e tratamento de erros
  utils/               # AppError, helpers de arquivo, JWT, ID e validação
  docs/
    swagger.js         # Configuração do Swagger/OpenAPI
  data/
    users.json         # Dados de usuários
    tasks.json         # Dados de tarefas
test/
  setup.js             # Variáveis de ambiente para o ambiente de teste
  helpers/             # authHelper e testDataHelper
  integration/         # Suítes de teste por recurso
```

## Como executar localmente

**1. Instalar dependências:**

```bash
npm install
```

**2. Criar `.env` com base em `.env.example`:**

```env
PORT=3000
JWT_SECRET=substitua-por-um-segredo-seguro
JWT_EXPIRES_IN=1h
```

**3. Iniciar em modo de desenvolvimento (com watch):**

```bash
npm run dev
```

**4. Iniciar em produção:**

```bash
npm start
```

**5. Executar os testes de integração:**

```bash
npm test
```

**6. Gerar relatório de cobertura:**

```bash
npm run coverage
```

**7. Verificar lint e formatação:**

```bash
npm run lint
npm run prettier
```

## Endpoints


| Método | Rota        | Autenticação | Descrição                               |
| ------ | ----------- | ------------ | --------------------------------------- |
| GET    | /health     | —            | Verifica disponibilidade da API         |
| POST   | /users      | —            | Cria um novo usuário                    |
| GET    | /users/me   | Bearer Token | Retorna o perfil do usuário autenticado |
| POST   | /auth/login | —            | Autentica e retorna o token JWT         |
| POST   | /tasks      | Bearer Token | Cria uma nova tarefa                    |
| GET    | /tasks      | Bearer Token | Lista tarefas com filtros e paginação   |
| GET    | /tasks/:id  | Bearer Token | Busca uma tarefa pelo ID                |
| PATCH  | /tasks/:id  | Bearer Token | Atualiza parcialmente uma tarefa        |
| DELETE | /tasks/:id  | Bearer Token | Remove uma tarefa                       |


### Parâmetros de query para `GET /tasks`


| Parâmetro | Tipo    | Valores aceitos                   | Descrição                    |
| --------- | ------- | --------------------------------- | ---------------------------- |
| status    | string  | `pending`, `in_progress`, `done`  | Filtra por status            |
| search    | string  | qualquer texto                    | Busca no título ou descrição |
| sortBy    | string  | `createdAt`, `updatedAt`, `title` | Campo de ordenação           |
| order     | string  | `asc`, `desc`                     | Direção da ordenação         |
| page      | integer | ≥ 1                               | Número da página             |
| limit     | integer | 1 – 100                           | Itens por página             |


## Documentação da API

Com a aplicação em execução:

- **Swagger UI:** `http://localhost:3000/docs`
- **OpenAPI JSON:** `http://localhost:3000/docs.json`

## Pipelines de CI

Três workflows no GitHub Actions acionados em push e pull requests para `main`:


| Workflow            | O que faz                                                                         |
| ------------------- | --------------------------------------------------------------------------------- |
| **Node.js CI**      | Lint, Prettier, testes com cobertura e testes funcionais; comenta resultado no PR |
| **Coverage Report** | Gera relatório nyc/lcov e comenta percentual de cobertura no PR                   |
| **Security Checks** | `npm audit` e Dependency Review; executa também semanalmente (cron domingo)       |


## Destaques de Qualidade

- Testes de integração cobrindo fluxos positivos, negativos e casos de borda para todos os recursos
- Validação explícita de payloads malformados e campos desconhecidos
- Comportamento de autorização que evita enumeração de recursos (retorna `404` em vez de `403`)
- Middlewares de validação dedicados por endpoint, mantendo os controllers enxutos
- Documentação OpenAPI gerada diretamente das JSDoc annotations nas rotas

## Observações

- A persistência em JSON foi escolhida para o MVP, priorizando o foco em design de API e qualidade de testes.
- O projeto utiliza ES Modules nativos do Node.js (`import`/`export`), sem transpilação.
- O arquivo `test/setup.js` define as variáveis de ambiente necessárias para os testes sem depender de um `.env`.


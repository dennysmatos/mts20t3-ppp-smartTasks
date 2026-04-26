# API de Gerenciamento de Tarefas (SmartTasks)

API REST construída como projeto de portfólio de QA para demonstrar testes de API, autenticação, arquitetura limpa e boas práticas de engenharia de software.

## Objetivos

- Construir uma API REST realista com endpoints protegidos
- Demonstrar automação de testes de integração com Mocha, Chai e Supertest
- Aplicar separação clara de responsabilidades em camadas
- Documentar o contrato da API com Swagger/OpenAPI
- Exibir práticas de engenharia profissional em repositório público

## Tecnologias

- **Runtime:** Node.js 20+ com ES Modules (`"type": "module"`)
- **Framework:** Express 5
- **Autenticação:** JWT (jsonwebtoken + bcryptjs)
- **Testes:** Mocha, Chai, Supertest
- **Documentação:** Swagger UI (swagger-jsdoc + swagger-ui-express)
- **Persistência:** Arquivo JSON (MVP)

## Funcionalidades

- Registro de usuários com senha criptografada (bcrypt)
- Autenticação via JWT
- Endpoints de gerenciamento de tarefas protegidos por Bearer Token
- Consulta do perfil do usuário autenticado
- Autorização baseada em ownership (cada usuário acessa apenas seus recursos)
- Filtro de tarefas por status e busca textual
- Ordenação e paginação na listagem de tarefas
- Respostas de erro centralizadas e padronizadas
- Documentação OpenAPI disponível via Swagger UI
- Pipeline de CI com GitHub Actions

## Destaques de Qualidade

- Testes de integração para cenários positivos, negativos e casos de borda
- Validação explícita para payloads malformados e campos desconhecidos
- Comportamento de autorização que evita enumeração de recursos (retorna 404 em vez de 403)
- Documentação OpenAPI gerada a partir das JSDoc annotations nas rotas
- Histórico de commits e branches organizado por etapas de entrega

## Estrutura do Projeto

```text
src/
  server.js          # Ponto de entrada da aplicação
  app.js             # Configuração do Express
  config/
    env.js           # Variáveis de ambiente
  controllers/       # Camada HTTP — entrada e saída de requisições
  services/          # Regras de negócio
  repositories/      # Acesso aos dados (JSON)
  routes/            # Definição dos endpoints e documentação Swagger
  middlewares/       # Autenticação, validação e tratamento de erros
  utils/             # Helpers compartilhados
  docs/
    swagger.js       # Configuração do Swagger/OpenAPI
  data/
    users.json       # Dados de usuários
    tasks.json       # Dados de tarefas
test/
  setup.cjs          # Configuração do ambiente de teste
  helpers/           # Utilitários de teste (auth, reset de dados)
  integration/       # Testes de integração por recurso
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

**3. Iniciar em modo de desenvolvimento:**

```bash
npm run dev
```

**4. Iniciar em produção:**

```bash
npm start
```

**5. Executar os testes:**

```bash
npm test
```

## Endpoints

| Método | Rota        | Autenticação | Descrição                             |
| ------ | ----------- | :----------: | ------------------------------------- |
| GET    | /health     |      —       | Verifica disponibilidade da API       |
| POST   | /users      |      —       | Cria um novo usuário                  |
| GET    | /users/me   | Bearer Token | Retorna o perfil do usuário logado    |
| POST   | /auth/login |      —       | Autentica e retorna o token JWT       |
| POST   | /tasks      | Bearer Token | Cria uma nova tarefa                  |
| GET    | /tasks      | Bearer Token | Lista tarefas com filtros e paginação |
| GET    | /tasks/:id  | Bearer Token | Busca uma tarefa pelo ID              |
| PATCH  | /tasks/:id  | Bearer Token | Atualiza parcialmente uma tarefa      |
| DELETE | /tasks/:id  | Bearer Token | Remove uma tarefa                     |

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

## Observações

- A persistência em JSON foi escolhida para o MVP, priorizando o foco em API e qualidade.
- O projeto utiliza ES Modules nativos do Node.js (`import`/`export`), sem transpilação.
- A configuração de ambiente de teste usa `test/setup.cjs` (CommonJS) para compatibilidade com o `--require` do Mocha.

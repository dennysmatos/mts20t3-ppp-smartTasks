# API de Gerenciamento de Tarefas (Task Manager)

[![CI](https://github.com/dennysmatos/mts20t3-ppp-smartTasks/actions/workflows/ci.yml/badge.svg)](https://github.com/dennysmatos/mts20t3-ppp-smartTasks/actions/workflows/ci.yml)

API REST construída como um projeto de portfólio de QA para demonstrar testes de API, autenticação, arquitetura limpa e práticas de qualidade de software.

## Objetivos

- Construir uma API REST realista com endpoints protegidos
- Demonstrar automação de testes de API com Mocha, Chai e Supertest
- Aplicar separação clara de responsabilidades
- Documentar o contrato com Swagger
- Exibir práticas de engenharia profissional em um repositório público

## Tecnologias (Stack)

- Node.js
- JavaScript
- Express
- Mocha
- Chai
- Supertest
- JWT
- Swagger
- Persistência em arquivo JSON

## Funcionalidades

- Registro de usuários com senhas criptografadas (hash)
- Autenticação via JWT
- Endpoints de gerenciamento de tarefas protegidos
- Autorização baseada em propriedade (ownership)
- Respostas de erro centralizadas
- Documentação Swagger
- Pipeline de CI com GitHub Actions

## Destaques de Qualidade

- Testes de integração para cenários positivos, negativos e casos de borda
- Validação explícita para payloads malformados e campos desconhecidos
- Comportamento de autorização projetado para evitar enumeração de recursos
- Documentação OpenAPI disponível via Swagger UI
- Histórico de commits e branches organizado por etapas de entrega

## Estrutura do Projeto

```text
src/
  app.js
  server.js
  config/
  controllers/
  data/
  docs/
  middlewares/
  repositories/
  routes/
  services/
  utils/
test/
  helpers/
  integration/
  setup.js
```

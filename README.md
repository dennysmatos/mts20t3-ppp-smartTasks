# Task Manager API

[![CI](https://github.com/dennysmatos/mts20t3-ppp-smartTasks/actions/workflows/ci.yml/badge.svg)](https://github.com/dennysmatos/mts20t3-ppp-smartTasks/actions/workflows/ci.yml)

REST API built as a QA portfolio project to demonstrate API testing, authentication, clean architecture, and software quality practices.

## Objectives

- build a realistic REST API with protected endpoints
- demonstrate API test automation with Mocha, Chai, and Supertest
- apply clean separation of responsibilities
- document the contract with Swagger
- show professional engineering practices in a public repository

## Tech stack

- Node.js
- JavaScript
- Express
- Mocha
- Chai
- Supertest
- JWT
- Swagger
- JSON file persistence

## Features

- user registration with hashed passwords
- JWT authentication
- protected task management endpoints
- ownership-based authorization
- centralized error responses
- Swagger documentation
- GitHub Actions CI pipeline

## Quality highlights

- integration tests for positive, negative, and edge-case scenarios
- explicit validation for malformed payloads and unknown fields
- authorization behavior designed to avoid resource enumeration
- OpenAPI documentation available through Swagger UI
- commit and branch history organized by delivery step

## Project structure

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

## Architecture decisions

- `routes` map HTTP endpoints to controllers
- `controllers` handle request and response flow
- `services` keep business rules
- `repositories` isolate file persistence
- `middlewares` handle cross-cutting concerns such as auth and validation
- `utils` centralize shared helpers

This separation improves maintainability and makes the API easier to test and evolve.

## Environment variables

Create a `.env` file based on `.env.example`.

```env
PORT=3000
JWT_SECRET=replace-with-a-secure-secret
JWT_EXPIRES_IN=1h
```

## Getting started

Install dependencies:

```bash
npm install
```

Run the API in development mode:

```bash
npm run dev
```

Run the API normally:

```bash
npm start
```

Run the automated tests:

```bash
npm test
```

## API documentation

After starting the server, access:

- Swagger UI: `http://localhost:3000/docs`
- OpenAPI JSON: `http://localhost:3000/docs.json`

Public repository:

- GitHub repository: `https://github.com/dennysmatos/mts20t3-ppp-smartTasks`

## Current endpoints

### Health

- `GET /health`

### Users

- `POST /users`

### Authentication

- `POST /auth/login`

### Tasks

- `POST /tasks`
- `GET /tasks`
- `GET /tasks/:id`
- `PATCH /tasks/:id`
- `DELETE /tasks/:id`

## Testing strategy

The project currently focuses on integration tests covering:

- successful and unsuccessful authentication
- input validation
- protected routes
- ownership and authorization behavior
- task CRUD flows
- documentation availability

## Continuous integration

The repository includes a GitHub Actions workflow that:

- installs dependencies with `npm ci`
- runs the automated test suite with `npm test`
- executes on pushes to `main`, `master`, and `codex/**`
- executes on pull requests targeting `main` or `master`

## Suggested review flow

1. Create a feature branch from `main`
2. Implement the change with focused commits
3. Run `npm test`
4. Open a pull request and wait for the CI workflow
5. Merge only after the pipeline is green

## Important limitation

JSON file persistence is intentionally used for the MVP to keep the project simple and focused on API quality. It is not intended for production use and has known limitations around concurrency and scalability.

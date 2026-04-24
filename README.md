# Task Manager API

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

## Important limitation

JSON file persistence is intentionally used for the MVP to keep the project simple and focused on API quality. It is not intended for production use and has known limitations around concurrency and scalability.

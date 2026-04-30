import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import swaggerJSDoc from 'swagger-jsdoc';

const __dirname = dirname(fileURLToPath(import.meta.url));

const options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'API de Gerenciamento de Tarefas',
      version: '1.0.0',
      description:
        'API REST para gerenciamento de tarefas com autenticação JWT.',
      contact: {
        name: 'Dennys Matos',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Ambiente local',
      },
    ],
    tags: [
      {
        name: 'Health',
        description: 'Disponibilidade da API',
      },
      {
        name: 'Usuários',
        description: 'Cadastro de usuários',
      },
      {
        name: 'Autenticação',
        description: 'Login e emissão de token',
      },
      {
        name: 'Tarefas',
        description: 'Endpoints protegidos de gerenciamento de tarefas',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        ErrorResponse: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'Erro de validação',
            },
            errors: {
              type: 'array',
              items: {
                type: 'string',
              },
              example: ['email é obrigatório'],
            },
          },
        },
        HealthResponse: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'API em execução',
            },
            data: {
              type: 'object',
              properties: {
                status: {
                  type: 'string',
                  example: 'ok',
                },
              },
            },
          },
        },
        CreateUserRequest: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name: {
              type: 'string',
              example: 'Maria Silva',
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'maria@email.com',
            },
            password: {
              type: 'string',
              minLength: 6,
              example: '123456',
            },
          },
        },
        UserResponseData: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            name: {
              type: 'string',
              example: 'Maria Silva',
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'maria@email.com',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        UserCreatedResponse: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'Usuário criado com sucesso',
            },
            data: {
              $ref: '#/components/schemas/UserResponseData',
            },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'maria@email.com',
            },
            password: {
              type: 'string',
              example: '123456',
            },
          },
        },
        LoginResponse: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'Login realizado com sucesso',
            },
            data: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                  example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
                },
              },
            },
          },
        },
        TaskRequest: {
          type: 'object',
          required: ['title', 'description', 'status'],
          properties: {
            title: {
              type: 'string',
              example: 'Estudar testes de API',
            },
            description: {
              type: 'string',
              example: 'Praticar testes de integração com Supertest',
            },
            status: {
              type: 'string',
              enum: ['pending', 'in_progress', 'done'],
              example: 'pending',
            },
          },
        },
        UpdateTaskRequest: {
          type: 'object',
          properties: {
            title: {
              type: 'string',
              example: 'Estudar mocks',
            },
            description: {
              type: 'string',
              example: 'Revisar test doubles',
            },
            status: {
              type: 'string',
              enum: ['pending', 'in_progress', 'done'],
              example: 'done',
            },
          },
        },
        TaskResponseData: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            title: {
              type: 'string',
            },
            description: {
              type: 'string',
            },
            status: {
              type: 'string',
              enum: ['pending', 'in_progress', 'done'],
            },
            userId: {
              type: 'string',
              format: 'uuid',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        TaskResponse: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'Tarefa criada com sucesso',
            },
            data: {
              $ref: '#/components/schemas/TaskResponseData',
            },
          },
        },
        TaskListResponse: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'Tarefas retornadas com sucesso',
            },
            data: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/TaskResponseData',
              },
            },
            meta: {
              type: 'object',
              properties: {
                page: {
                  type: 'integer',
                  example: 1,
                },
                limit: {
                  type: 'integer',
                  example: 10,
                },
                totalItems: {
                  type: 'integer',
                  example: 3,
                },
                totalPages: {
                  type: 'integer',
                  example: 1,
                },
              },
            },
          },
        },
      },
    },
  },
  apis: [join(__dirname, '../routes/*.js')],
};

export default swaggerJSDoc(options);

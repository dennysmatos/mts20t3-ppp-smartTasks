const path = require("path");
const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "Task Manager API",
      version: "1.0.0",
      description: "REST API for task management with JWT authentication.",
      contact: {
        name: "Dennys Matos"
      }
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Local environment"
      }
    ],
    tags: [
      {
        name: "Health",
        description: "API availability"
      },
      {
        name: "Users",
        description: "User registration"
      },
      {
        name: "Authentication",
        description: "Login and token issuance"
      },
      {
        name: "Tasks",
        description: "Protected task management endpoints"
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      },
      schemas: {
        ErrorResponse: {
          type: "object",
          properties: {
            message: {
              type: "string",
              example: "Validation error"
            },
            errors: {
              type: "array",
              items: {
                type: "string"
              },
              example: ["email is required"]
            }
          }
        },
        HealthResponse: {
          type: "object",
          properties: {
            message: {
              type: "string",
              example: "API is running"
            },
            data: {
              type: "object",
              properties: {
                status: {
                  type: "string",
                  example: "ok"
                }
              }
            }
          }
        },
        CreateUserRequest: {
          type: "object",
          required: ["name", "email", "password"],
          properties: {
            name: {
              type: "string",
              example: "Maria Silva"
            },
            email: {
              type: "string",
              format: "email",
              example: "maria@email.com"
            },
            password: {
              type: "string",
              minLength: 6,
              example: "123456"
            }
          }
        },
        UserResponseData: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid"
            },
            name: {
              type: "string",
              example: "Maria Silva"
            },
            email: {
              type: "string",
              format: "email",
              example: "maria@email.com"
            },
            createdAt: {
              type: "string",
              format: "date-time"
            },
            updatedAt: {
              type: "string",
              format: "date-time"
            }
          }
        },
        UserCreatedResponse: {
          type: "object",
          properties: {
            message: {
              type: "string",
              example: "User created successfully"
            },
            data: {
              $ref: "#/components/schemas/UserResponseData"
            }
          }
        },
        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: {
              type: "string",
              format: "email",
              example: "maria@email.com"
            },
            password: {
              type: "string",
              example: "123456"
            }
          }
        },
        LoginResponse: {
          type: "object",
          properties: {
            message: {
              type: "string",
              example: "Login successful"
            },
            data: {
              type: "object",
              properties: {
                token: {
                  type: "string",
                  example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"
                }
              }
            }
          }
        },
        TaskRequest: {
          type: "object",
          required: ["title", "description", "status"],
          properties: {
            title: {
              type: "string",
              example: "Study API testing"
            },
            description: {
              type: "string",
              example: "Practice integration tests with Supertest"
            },
            status: {
              type: "string",
              enum: ["pending", "in_progress", "done"],
              example: "pending"
            }
          }
        },
        UpdateTaskRequest: {
          type: "object",
          properties: {
            title: {
              type: "string",
              example: "Study mocks"
            },
            description: {
              type: "string",
              example: "Review test doubles"
            },
            status: {
              type: "string",
              enum: ["pending", "in_progress", "done"],
              example: "done"
            }
          }
          },
        TaskResponseData: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid"
            },
            title: {
              type: "string"
            },
            description: {
              type: "string"
            },
            status: {
              type: "string",
              enum: ["pending", "in_progress", "done"]
            },
            userId: {
              type: "string",
              format: "uuid"
            },
            createdAt: {
              type: "string",
              format: "date-time"
            },
            updatedAt: {
              type: "string",
              format: "date-time"
            }
          }
        },
        TaskResponse: {
          type: "object",
          properties: {
            message: {
              type: "string",
              example: "Task created successfully"
            },
            data: {
              $ref: "#/components/schemas/TaskResponseData"
            }
          }
        },
        TaskListResponse: {
          type: "object",
          properties: {
            message: {
              type: "string",
              example: "Tasks retrieved successfully"
            },
            data: {
              type: "array",
              items: {
                $ref: "#/components/schemas/TaskResponseData"
              }
            }
          }
        }
      }
    }
  },
  apis: [path.join(__dirname, "../routes/*.js")]
};

module.exports = swaggerJSDoc(options);

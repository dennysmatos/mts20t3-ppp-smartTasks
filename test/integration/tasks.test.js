const request = require("supertest");
const { expect } = require("chai");

const app = require("../../src/app");
const { createUserAndGetToken } = require("../helpers/authHelper");
const { resetDataFiles } = require("../helpers/testDataHelper");

describe("Tasks routes", () => {
  beforeEach(async () => {
    await resetDataFiles();
  });

  describe("POST /tasks", () => {
    it("should create a task for the authenticated user", async () => {
      const { token } = await createUserAndGetToken();

      const payload = {
        title: "Study API testing",
        description: "Practice integration tests with Supertest",
        status: "pending"
      };

      const response = await request(app)
        .post("/tasks")
        .set("Authorization", `Bearer ${token}`)
        .send(payload);

      expect(response.status).to.equal(201);
      expect(response.body.message).to.equal("Task created successfully");
      expect(response.body.data).to.include(payload);
      expect(response.body.data.userId).to.be.a("string");
      expect(response.body.data.id).to.be.a("string");
    });

    it("should return unauthorized when token is missing", async () => {
      const response = await request(app).post("/tasks").send({
        title: "Study API testing",
        description: "Practice integration tests with Supertest",
        status: "pending"
      });

      expect(response.status).to.equal(401);
      expect(response.body).to.deep.equal({
        message: "Authentication token is required",
        errors: []
      });
    });

    it("should return unauthorized when token is invalid", async () => {
      const response = await request(app)
        .post("/tasks")
        .set("Authorization", "Bearer invalid-token")
        .send({
          title: "Study API testing",
          description: "Practice integration tests with Supertest",
          status: "pending"
        });

      expect(response.status).to.equal(401);
      expect(response.body).to.deep.equal({
        message: "Invalid authentication token",
        errors: []
      });
    });

    it("should return validation error when status is invalid", async () => {
      const { token } = await createUserAndGetToken();

      const response = await request(app)
        .post("/tasks")
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "Study API testing",
          description: "Practice integration tests with Supertest",
          status: "archived"
        });

      expect(response.status).to.equal(400);
      expect(response.body).to.deep.equal({
        message: "Validation error",
        errors: ["status must be one of: pending, in_progress, done"]
      });
    });
  });

  describe("GET /tasks", () => {
    it("should list only tasks from the authenticated user", async () => {
      const mariaAuth = await createUserAndGetToken();
      const joaoAuth = await createUserAndGetToken({
        name: "Joao Souza",
        email: "joao@email.com"
      });

      await request(app)
        .post("/tasks")
        .set("Authorization", `Bearer ${mariaAuth.token}`)
        .send({
          title: "Maria task",
          description: "Owned by Maria",
          status: "pending"
        });

      await request(app)
        .post("/tasks")
        .set("Authorization", `Bearer ${joaoAuth.token}`)
        .send({
          title: "Joao task",
          description: "Owned by Joao",
          status: "done"
        });

      const response = await request(app)
        .get("/tasks")
        .set("Authorization", `Bearer ${mariaAuth.token}`);

      expect(response.status).to.equal(200);
      expect(response.body.message).to.equal("Tasks retrieved successfully");
      expect(response.body.data).to.have.lengthOf(1);
      expect(response.body.data[0]).to.include({
        title: "Maria task",
        description: "Owned by Maria",
        status: "pending"
      });
    });
  });

  describe("GET /tasks/:id", () => {
    it("should return a task that belongs to the authenticated user", async () => {
      const { token } = await createUserAndGetToken();

      const createdTaskResponse = await request(app)
        .post("/tasks")
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "Study mocks",
          description: "Review test doubles",
          status: "pending"
        });

      const response = await request(app)
        .get(`/tasks/${createdTaskResponse.body.data.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).to.equal(200);
      expect(response.body.message).to.equal("Task retrieved successfully");
      expect(response.body.data).to.include({
        title: "Study mocks",
        description: "Review test doubles",
        status: "pending"
      });
    });

    it("should return not found when the task belongs to another user", async () => {
      const mariaAuth = await createUserAndGetToken();
      const joaoAuth = await createUserAndGetToken({
        name: "Joao Souza",
        email: "joao@email.com"
      });

      const createdTaskResponse = await request(app)
        .post("/tasks")
        .set("Authorization", `Bearer ${mariaAuth.token}`)
        .send({
          title: "Maria private task",
          description: "Owned by Maria",
          status: "pending"
        });

      const response = await request(app)
        .get(`/tasks/${createdTaskResponse.body.data.id}`)
        .set("Authorization", `Bearer ${joaoAuth.token}`);

      expect(response.status).to.equal(404);
      expect(response.body).to.deep.equal({
        message: "Task not found",
        errors: []
      });
    });
  });

  describe("PATCH /tasks/:id", () => {
    it("should partially update a task", async () => {
      const { token } = await createUserAndGetToken();

      const createdTaskResponse = await request(app)
        .post("/tasks")
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "Study API testing",
          description: "Initial description",
          status: "pending"
        });

      const response = await request(app)
        .patch(`/tasks/${createdTaskResponse.body.data.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          status: "done"
        });

      expect(response.status).to.equal(200);
      expect(response.body.message).to.equal("Task updated successfully");
      expect(response.body.data).to.include({
        title: "Study API testing",
        description: "Initial description",
        status: "done"
      });
    });

    it("should return validation error when payload is empty", async () => {
      const { token } = await createUserAndGetToken();

      const createdTaskResponse = await request(app)
        .post("/tasks")
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "Study API testing",
          description: "Initial description",
          status: "pending"
        });

      const response = await request(app)
        .patch(`/tasks/${createdTaskResponse.body.data.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({});

      expect(response.status).to.equal(400);
      expect(response.body).to.deep.equal({
        message: "Validation error",
        errors: ["at least one valid field must be provided"]
      });
    });

    it("should return not found when trying to update another user's task", async () => {
      const mariaAuth = await createUserAndGetToken();
      const joaoAuth = await createUserAndGetToken({
        name: "Joao Souza",
        email: "joao@email.com"
      });

      const createdTaskResponse = await request(app)
        .post("/tasks")
        .set("Authorization", `Bearer ${mariaAuth.token}`)
        .send({
          title: "Maria private task",
          description: "Owned by Maria",
          status: "pending"
        });

      const response = await request(app)
        .patch(`/tasks/${createdTaskResponse.body.data.id}`)
        .set("Authorization", `Bearer ${joaoAuth.token}`)
        .send({
          status: "done"
        });

      expect(response.status).to.equal(404);
      expect(response.body).to.deep.equal({
        message: "Task not found",
        errors: []
      });
    });
  });

  describe("DELETE /tasks/:id", () => {
    it("should delete a task that belongs to the authenticated user", async () => {
      const { token } = await createUserAndGetToken();

      const createdTaskResponse = await request(app)
        .post("/tasks")
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "Study API testing",
          description: "Task to delete",
          status: "pending"
        });

      const deleteResponse = await request(app)
        .delete(`/tasks/${createdTaskResponse.body.data.id}`)
        .set("Authorization", `Bearer ${token}`);

      const getResponse = await request(app)
        .get(`/tasks/${createdTaskResponse.body.data.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(deleteResponse.status).to.equal(204);
      expect(deleteResponse.body).to.deep.equal({});
      expect(getResponse.status).to.equal(404);
    });

    it("should return not found when trying to delete another user's task", async () => {
      const mariaAuth = await createUserAndGetToken();
      const joaoAuth = await createUserAndGetToken({
        name: "Joao Souza",
        email: "joao@email.com"
      });

      const createdTaskResponse = await request(app)
        .post("/tasks")
        .set("Authorization", `Bearer ${mariaAuth.token}`)
        .send({
          title: "Maria private task",
          description: "Owned by Maria",
          status: "pending"
        });

      const response = await request(app)
        .delete(`/tasks/${createdTaskResponse.body.data.id}`)
        .set("Authorization", `Bearer ${joaoAuth.token}`);

      expect(response.status).to.equal(404);
      expect(response.body).to.deep.equal({
        message: "Task not found",
        errors: []
      });
    });
  });
});

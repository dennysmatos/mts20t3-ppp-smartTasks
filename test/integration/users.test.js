const fs = require("fs/promises");
const path = require("path");

const request = require("supertest");
const { expect } = require("chai");
const bcrypt = require("bcryptjs");

const app = require("../../src/app");
const { resetDataFiles } = require("../helpers/testDataHelper");

const usersFilePath = path.join(__dirname, "../../src/data/users.json");

describe("POST /users", () => {
  beforeEach(async () => {
    await resetDataFiles();
  });

  it("should create a user with hashed password", async () => {
    const payload = {
      name: "Maria Silva",
      email: "maria@email.com",
      password: "123456"
    };

    const response = await request(app).post("/users").send(payload);

    const savedUsers = JSON.parse(await fs.readFile(usersFilePath, "utf-8"));

    expect(response.status).to.equal(201);
    expect(response.body.message).to.equal("User created successfully");
    expect(response.body.data).to.include({
      name: payload.name,
      email: payload.email
    });
    expect(response.body.data).to.not.have.property("password");
    expect(savedUsers).to.have.lengthOf(1);
    expect(savedUsers[0].password).to.not.equal(payload.password);
    expect(await bcrypt.compare(payload.password, savedUsers[0].password)).to.equal(true);
  });

  it("should return conflict when email is already registered", async () => {
    const payload = {
      name: "Maria Silva",
      email: "maria@email.com",
      password: "123456"
    };

    await request(app).post("/users").send(payload);
    const response = await request(app).post("/users").send(payload);

    expect(response.status).to.equal(409);
    expect(response.body).to.deep.equal({
      message: "Email is already registered",
      errors: []
    });
  });

  it("should return validation error when password is too short", async () => {
    const payload = {
      name: "Maria Silva",
      email: "maria@email.com",
      password: "123"
    };

    const response = await request(app).post("/users").send(payload);

    expect(response.status).to.equal(400);
    expect(response.body).to.deep.equal({
      message: "Validation error",
      errors: ["password must be at least 6 characters long"]
    });
  });
});

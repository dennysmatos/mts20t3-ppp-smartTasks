const request = require("supertest");
const { expect } = require("chai");

const app = require("../../src/app");

describe("Error handling", () => {
  it("should return not found for an unknown route", async () => {
    const response = await request(app).get("/unknown-route");

    expect(response.status).to.equal(404);
    expect(response.body).to.deep.equal({
      message: "Route GET /unknown-route not found",
      errors: []
    });
  });

  it("should return bad request for malformed JSON payload", async () => {
    const response = await request(app)
      .post("/users")
      .set("Content-Type", "application/json")
      .send('{"name":"Maria","email":"maria@email.com",');

    expect(response.status).to.equal(400);
    expect(response.body).to.deep.equal({
      message: "Malformed JSON payload",
      errors: []
    });
  });
});

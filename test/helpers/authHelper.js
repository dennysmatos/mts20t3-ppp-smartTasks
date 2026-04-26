import request from 'supertest';

import app from '../../src/app.js';

async function createUserAndGetToken(overrides = {}) {
  const userPayload = {
    name: 'Maria Silva',
    email: 'maria@email.com',
    password: '123456',
    ...overrides,
  };

  await request(app).post('/users').send(userPayload);

  const loginResponse = await request(app).post('/auth/login').send({
    email: userPayload.email,
    password: userPayload.password,
  });

  return {
    token: loginResponse.body.data.token,
    user: userPayload,
  };
}

export { createUserAndGetToken };

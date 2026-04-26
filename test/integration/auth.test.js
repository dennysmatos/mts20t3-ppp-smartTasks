import jwt from 'jsonwebtoken';
import request from 'supertest';
import { expect } from 'chai';

import app from '../../src/app.js';
import { resetDataFiles } from '../helpers/testDataHelper.js';
import { JWT_SECRET } from '../../src/utils/jwtHelper.js';

describe('POST /auth/login', () => {
  beforeEach(async () => {
    await resetDataFiles();
  });

  it('should return a token when credentials are valid', async () => {
    const userPayload = {
      name: 'Maria Silva',
      email: 'maria@email.com',
      password: '123456',
    };

    await request(app).post('/users').send(userPayload);

    const response = await request(app).post('/auth/login').send({
      email: userPayload.email,
      password: userPayload.password,
    });

    const decodedToken = jwt.verify(response.body.data.token, JWT_SECRET);

    expect(response.status).to.equal(200);
    expect(response.body.message).to.equal('Login successful');
    expect(response.body.data.token).to.be.a('string');
    expect(decodedToken.email).to.equal(userPayload.email);
    expect(decodedToken.sub).to.be.a('string');
  });

  it('should return unauthorized when password is invalid', async () => {
    await request(app).post('/users').send({
      name: 'Maria Silva',
      email: 'maria@email.com',
      password: '123456',
    });

    const response = await request(app).post('/auth/login').send({
      email: 'maria@email.com',
      password: 'wrong-password',
    });

    expect(response.status).to.equal(401);
    expect(response.body).to.deep.equal({
      message: 'Invalid credentials',
      errors: [],
    });
  });

  it('should return unauthorized when email is not registered', async () => {
    const response = await request(app).post('/auth/login').send({
      email: 'maria@email.com',
      password: '123456',
    });

    expect(response.status).to.equal(401);
    expect(response.body).to.deep.equal({
      message: 'Invalid credentials',
      errors: [],
    });
  });

  it('should return validation error when email is missing', async () => {
    const response = await request(app).post('/auth/login').send({
      password: '123456',
    });

    expect(response.status).to.equal(400);
    expect(response.body).to.deep.equal({
      message: 'Validation error',
      errors: ['email is required'],
    });
  });
});

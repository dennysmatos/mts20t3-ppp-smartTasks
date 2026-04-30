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

  it('deve retornar um token quando as credenciais são válidas', async () => {
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
    expect(response.body.message).to.equal('Login realizado com sucesso');
    expect(response.body.data.token).to.be.a('string');
    expect(decodedToken.email).to.equal(userPayload.email);
    expect(decodedToken.sub).to.be.a('string');
  });

  it('deve retornar não autorizado quando a senha é inválida', async () => {
    await request(app).post('/users').send({
      name: 'Maria Silva',
      email: 'maria@email.com',
      password: '123456',
    });

    const response = await request(app).post('/auth/login').send({
      email: 'maria@email.com',
      password: 'senha-errada',
    });

    expect(response.status).to.equal(401);
    expect(response.body).to.deep.equal({
      message: 'Credenciais inválidas',
      errors: [],
    });
  });

  it('deve retornar não autorizado quando o e-mail não está cadastrado', async () => {
    const response = await request(app).post('/auth/login').send({
      email: 'maria@email.com',
      password: '123456',
    });

    expect(response.status).to.equal(401);
    expect(response.body).to.deep.equal({
      message: 'Credenciais inválidas',
      errors: [],
    });
  });

  it('deve retornar erro de validação quando o e-mail está ausente', async () => {
    const response = await request(app).post('/auth/login').send({
      password: '123456',
    });

    expect(response.status).to.equal(400);
    expect(response.body).to.deep.equal({
      message: 'Erro de validação',
      errors: ['email é obrigatório'],
    });
  });
});

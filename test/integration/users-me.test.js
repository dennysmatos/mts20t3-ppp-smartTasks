import request from 'supertest';
import { expect } from 'chai';

import app from '../../src/app.js';
import { createUserAndGetToken } from '../helpers/authHelper.js';
import { resetDataFiles } from '../helpers/testDataHelper.js';

describe('GET /users/me', () => {
  beforeEach(async () => {
    await resetDataFiles();
  });

  it('deve retornar o perfil do usuário autenticado', async () => {
    const { token, user } = await createUserAndGetToken();

    const response = await request(app)
      .get('/users/me')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).to.equal(200);
    expect(response.body.message).to.equal(
      'Usuário autenticado retornado com sucesso'
    );
    expect(response.body.data).to.include({
      name: user.name,
      email: user.email,
    });
    expect(response.body.data).to.have.property('id');
    expect(response.body.data).to.have.property('createdAt');
    expect(response.body.data).to.have.property('updatedAt');
    expect(response.body.data).to.not.have.property('password');
  });

  it('deve retornar não autorizado quando o token está ausente', async () => {
    const response = await request(app).get('/users/me');

    expect(response.status).to.equal(401);
    expect(response.body).to.deep.equal({
      message: 'Token de autenticação é obrigatório',
      errors: [],
    });
  });

  it('deve retornar não autorizado quando o token é inválido', async () => {
    const response = await request(app)
      .get('/users/me')
      .set('Authorization', 'Bearer invalid-token');

    expect(response.status).to.equal(401);
    expect(response.body).to.deep.equal({
      message: 'Token de autenticação inválido',
      errors: [],
    });
  });
});

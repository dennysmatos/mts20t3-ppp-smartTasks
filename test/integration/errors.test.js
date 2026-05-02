import request from 'supertest';
import { expect } from 'chai';

import app from '../../src/app.js';
import { createUserAndGetToken } from '../helpers/authHelper.js';
import { resetDataFiles } from '../helpers/testDataHelper.js';

describe('Tratamento de erros', () => {
  beforeEach(async () => {
    await resetDataFiles();
  });

  it('deve retornar não encontrado para uma rota desconhecida', async () => {
    const response = await request(app).get('/unknown-route');

    expect(response.status).to.equal(404);
    expect(response.body).to.deep.equal({
      message: 'Rota GET /unknown-route não encontrada',
      errors: [],
    });
  });

  it('deve retornar bad request para payload JSON malformado', async () => {
    const response = await request(app)
      .post('/users')
      .set('Content-Type', 'application/json')
      .send('{"name":"Maria","email":"maria@email.com",');

    expect(response.status).to.equal(400);
    expect(response.body).to.deep.equal({
      message: 'Payload JSON malformado',
      errors: [],
    });
  });

  describe('Content-Type ausente (BUG-01)', () => {
    it('deve retornar 400 sem vazar detalhes internos em POST /users sem Content-Type', async () => {
      const response = await request(app)
        .post('/users')
        .send('{"name":"Maria","email":"maria@email.com","password":"123456"}');

      expect(response.status).to.equal(400);
      expect(response.body.message).to.equal('Payload JSON malformado');
      expect(response.body.errors).to.deep.equal([]);
      expect(response.body.message).to.not.include('request.body');
      expect(response.body.message).to.not.include('Cannot destructure');
    });

    it('deve retornar 400 sem vazar detalhes internos em POST /auth/login sem Content-Type', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send('{"email":"maria@email.com","password":"123456"}');

      expect(response.status).to.equal(400);
      expect(response.body.message).to.equal('Payload JSON malformado');
      expect(response.body.errors).to.deep.equal([]);
      expect(response.body.message).to.not.include('Cannot destructure');
    });

    it('deve retornar 400 sem vazar detalhes internos em POST /tasks sem Content-Type', async () => {
      const { token } = await createUserAndGetToken();

      const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send('{"title":"T","description":"D","status":"pending"}');

      expect(response.status).to.equal(400);
      expect(response.body.message).to.equal('Payload JSON malformado');
      expect(response.body.errors).to.deep.equal([]);
      expect(response.body.message).to.not.include('Cannot destructure');
    });

    it('deve retornar 400 sem vazar detalhes internos em PATCH /tasks/:id sem Content-Type', async () => {
      const { token } = await createUserAndGetToken();

      const createdTask = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Tarefa teste',
          description: 'Desc',
          status: 'pending',
        });

      const response = await request(app)
        .patch(`/tasks/${createdTask.body.data.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send('{"status":"done"}');

      expect(response.status).to.equal(400);
      expect(response.body.message).to.equal('Payload JSON malformado');
      expect(response.body.errors).to.deep.equal([]);
      expect(response.body.message).to.not.include('Cannot destructure');
    });

    it('não deve expor mensagens internas em erros inesperados do servidor', async () => {
      const response = await request(app).get('/unknown-route');

      expect(response.body.message).to.not.include('TypeError');
      expect(response.body.message).to.not.include('undefined');
      expect(response.body.message).to.not.include('request.body');
    });
  });
});

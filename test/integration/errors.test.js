import request from 'supertest';
import { expect } from 'chai';

import app from '../../src/app.js';

describe('Tratamento de erros', () => {
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
});

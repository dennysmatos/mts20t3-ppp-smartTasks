import request from 'supertest';
import { expect } from 'chai';

import app from '../../src/app.js';

describe('GET /health', () => {
  it('deve retornar o status da API', async () => {
    const response = await request(app).get('/health');

    expect(response.status).to.equal(200);
    expect(response.body).to.deep.equal({
      message: 'API em execução',
      data: {
        status: 'ok',
      },
    });
  });
});

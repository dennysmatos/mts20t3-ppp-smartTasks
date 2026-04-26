import request from 'supertest';
import { expect } from 'chai';

import app from '../../src/app.js';

describe('GET /health', () => {
  it('should return API status', async () => {
    const response = await request(app).get('/health');

    expect(response.status).to.equal(200);
    expect(response.body).to.deep.equal({
      message: 'API is running',
      data: {
        status: 'ok',
      },
    });
  });
});

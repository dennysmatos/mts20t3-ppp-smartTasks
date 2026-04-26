import request from 'supertest';
import { expect } from 'chai';

import app from '../../src/app.js';

describe('API documentation', () => {
  it('should expose the OpenAPI specification', async () => {
    const response = await request(app).get('/docs.json');

    expect(response.status).to.equal(200);
    expect(response.body.openapi).to.equal('3.0.3');
    expect(response.body.info.title).to.equal('Task Manager API');
    expect(response.body.paths).to.have.property('/users');
    expect(response.body.paths).to.have.property('/auth/login');
    expect(response.body.paths).to.have.property('/tasks');
    expect(response.body.paths).to.have.property('/tasks/{id}');
  });
});

const request = require('supertest')
const { expect } = require('chai')

const app = require('../../src/app')

describe('GET /health', () => {
   it('should return API status', async () => {
      const response = await request(app).get('/health')

      expect(response.status).to.equal(200)
      expect(response.body).to.deep.equal({
         message: 'API is running',
         data: {
            status: 'ok',
         },
      })
   })
})

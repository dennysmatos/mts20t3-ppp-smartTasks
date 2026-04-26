import request from 'supertest'
import { expect } from 'chai'

import app from '../../src/app.js'
import { createUserAndGetToken } from '../helpers/authHelper.js'
import { resetDataFiles } from '../helpers/testDataHelper.js'

describe('GET /users/me', () => {
   beforeEach(async () => {
      await resetDataFiles()
   })

   it('should return the authenticated user profile', async () => {
      const { token, user } = await createUserAndGetToken()

      const response = await request(app)
         .get('/users/me')
         .set('Authorization', `Bearer ${token}`)

      expect(response.status).to.equal(200)
      expect(response.body.message).to.equal(
         'Authenticated user retrieved successfully',
      )
      expect(response.body.data).to.include({
         name: user.name,
         email: user.email,
      })
      expect(response.body.data).to.have.property('id')
      expect(response.body.data).to.have.property('createdAt')
      expect(response.body.data).to.have.property('updatedAt')
      expect(response.body.data).to.not.have.property('password')
   })

   it('should return unauthorized when token is missing', async () => {
      const response = await request(app).get('/users/me')

      expect(response.status).to.equal(401)
      expect(response.body).to.deep.equal({
         message: 'Authentication token is required',
         errors: [],
      })
   })

   it('should return unauthorized when token is invalid', async () => {
      const response = await request(app)
         .get('/users/me')
         .set('Authorization', 'Bearer invalid-token')

      expect(response.status).to.equal(401)
      expect(response.body).to.deep.equal({
         message: 'Invalid authentication token',
         errors: [],
      })
   })
})

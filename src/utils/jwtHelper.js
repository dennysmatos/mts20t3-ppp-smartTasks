const jwt = require('jsonwebtoken')
const env = require('../config/env')

const JWT_SECRET = env.jwtSecret
const JWT_EXPIRES_IN = env.jwtExpiresIn

function generateToken(payload) {
   return jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
   })
}

function verifyToken(token) {
   return jwt.verify(token, JWT_SECRET)
}

module.exports = {
   generateToken,
   JWT_SECRET,
   JWT_EXPIRES_IN,
   verifyToken,
}

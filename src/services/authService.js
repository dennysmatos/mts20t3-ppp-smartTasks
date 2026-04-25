const bcrypt = require('bcryptjs')

const userRepository = require('../repositories/userRepository')
const AppError = require('../utils/AppError')
const { generateToken } = require('../utils/jwtHelper')

async function login(payload) {
   const normalizedEmail = payload.email.trim().toLowerCase()
   const user = await userRepository.findByEmail(normalizedEmail)

   if (!user) {
      throw new AppError('Invalid credentials', 401)
   }

   const isPasswordValid = await bcrypt.compare(payload.password, user.password)

   if (!isPasswordValid) {
      throw new AppError('Invalid credentials', 401)
   }

   const token = generateToken({
      sub: user.id,
      email: user.email,
   })

   return {
      token,
   }
}

module.exports = {
   login,
}

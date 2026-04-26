import bcrypt from 'bcryptjs'

import * as userRepository from '../repositories/userRepository.js'
import AppError from '../utils/AppError.js'
import { generateToken } from '../utils/jwtHelper.js'

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

export { login }

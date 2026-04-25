const bcrypt = require('bcryptjs')

const userRepository = require('../repositories/userRepository')
const AppError = require('../utils/AppError')
const { generateId } = require('../utils/idHelper')

async function createUser(payload) {
   const existingUser = await userRepository.findByEmail(payload.email)

   if (existingUser) {
      throw new AppError('Email is already registered', 409)
   }

   const now = new Date().toISOString()
   const password = await bcrypt.hash(payload.password, 10)

   const userToCreate = {
      id: generateId(),
      name: payload.name.trim(),
      email: payload.email.trim().toLowerCase(),
      password,
      createdAt: now,
      updatedAt: now,
   }

   await userRepository.create(userToCreate)

   return {
      id: userToCreate.id,
      name: userToCreate.name,
      email: userToCreate.email,
      createdAt: userToCreate.createdAt,
      updatedAt: userToCreate.updatedAt,
   }
}

async function getUserById(userId) {
   const user = await userRepository.findById(userId)

   if (!user) {
      throw new AppError('User not found', 404)
   }

   return sanitizeUser(user)
}

function sanitizeUser(user) {
   return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
   }
}

module.exports = {
   createUser,
   getUserById,
}

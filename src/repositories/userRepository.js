const path = require('path')

const { readJsonFile, writeJsonFile } = require('../utils/fileHelper')

const usersFilePath = path.join(__dirname, '../data/users.json')

async function findAll() {
   return readJsonFile(usersFilePath)
}

async function findByEmail(email) {
   const users = await findAll()

   return (
      users.find((user) => user.email === email.trim().toLowerCase()) || null
   )
}

async function findById(userId) {
   const users = await findAll()

   return users.find((user) => user.id === userId) || null
}

async function create(user) {
   const users = await findAll()

   users.push(user)

   await writeJsonFile(usersFilePath, users)

   return user
}

module.exports = {
   create,
   findAll,
   findById,
   findByEmail,
}

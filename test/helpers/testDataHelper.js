const fs = require('fs/promises')
const path = require('path')

const usersFilePath = path.join(__dirname, '../../src/data/users.json')
const tasksFilePath = path.join(__dirname, '../../src/data/tasks.json')

async function resetDataFiles() {
   await fs.writeFile(usersFilePath, '[]')
   await fs.writeFile(tasksFilePath, '[]')
}

module.exports = {
   resetDataFiles,
}

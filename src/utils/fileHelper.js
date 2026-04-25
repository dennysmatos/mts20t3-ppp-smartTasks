const fs = require('fs/promises')

async function readJsonFile(filePath) {
   const fileContent = await fs.readFile(filePath, 'utf-8')

   return JSON.parse(fileContent)
}

async function writeJsonFile(filePath, data) {
   await fs.writeFile(filePath, JSON.stringify(data, null, 2))
}

module.exports = {
   readJsonFile,
   writeJsonFile,
}

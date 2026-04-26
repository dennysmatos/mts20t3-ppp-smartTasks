import { readFile, writeFile } from 'fs/promises'

async function readJsonFile(filePath) {
   const fileContent = await readFile(filePath, 'utf-8')

   return JSON.parse(fileContent)
}

async function writeJsonFile(filePath, data) {
   await writeFile(filePath, JSON.stringify(data, null, 2))
}

export { readJsonFile, writeJsonFile }

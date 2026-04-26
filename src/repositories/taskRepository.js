import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

import { readJsonFile, writeJsonFile } from '../utils/fileHelper.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const tasksFilePath = join(__dirname, '../data/tasks.json')

async function findAll() {
   return readJsonFile(tasksFilePath)
}

async function findByUserId(userId) {
   const tasks = await findAll()

   return tasks.filter((task) => task.userId === userId)
}

async function create(task) {
   const tasks = await findAll()

   tasks.push(task)

   await writeJsonFile(tasksFilePath, tasks)

   return task
}

async function findById(taskId) {
   const tasks = await findAll()

   return tasks.find((task) => task.id === taskId) || null
}

async function update(updatedTask) {
   const tasks = await findAll()
   const updatedTasks = tasks.map((task) =>
      task.id === updatedTask.id ? updatedTask : task,
   )

   await writeJsonFile(tasksFilePath, updatedTasks)

   return updatedTask
}

async function remove(taskId) {
   const tasks = await findAll()
   const filteredTasks = tasks.filter((task) => task.id !== taskId)

   await writeJsonFile(tasksFilePath, filteredTasks)
}

export { create, findAll, findById, findByUserId, remove, update }

const taskRepository = require('../repositories/taskRepository')
const AppError = require('../utils/AppError')
const { generateId } = require('../utils/idHelper')

const allowedStatus = ['pending', 'in_progress', 'done']

async function createTask(userId, payload) {
   const now = new Date().toISOString()

   const taskToCreate = {
      id: generateId(),
      title: payload.title.trim(),
      description: payload.description.trim(),
      status: payload.status,
      userId,
      createdAt: now,
      updatedAt: now,
   }

   await taskRepository.create(taskToCreate)

   return taskToCreate
}

async function listTasksByUserId(userId, filters = {}) {
   const tasks = await taskRepository.findByUserId(userId)
   const normalizedStatus =
      typeof filters.status === 'string' ? filters.status.trim() : ''
   const normalizedSearch =
      typeof filters.search === 'string'
         ? filters.search.trim().toLowerCase()
         : ''
   const sortBy =
      typeof filters.sortBy === 'string' ? filters.sortBy.trim() : 'createdAt'
   const order =
      typeof filters.order === 'string' ? filters.order.trim() : 'desc'
   const page = Number.isInteger(Number(filters.page))
      ? Number(filters.page)
      : 1
   const limit = Number.isInteger(Number(filters.limit))
      ? Number(filters.limit)
      : tasks.length || 10

   const filteredTasks = tasks.filter((task) => {
      const matchesStatus =
         !normalizedStatus || task.status === normalizedStatus
      const matchesSearch =
         !normalizedSearch ||
         task.title.toLowerCase().includes(normalizedSearch) ||
         task.description.toLowerCase().includes(normalizedSearch)

      return matchesStatus && matchesSearch
   })

   const sortedTasks = sortTasks(filteredTasks, sortBy, order)
   const pagination = paginateTasks(sortedTasks, page, limit)

   return pagination
}

async function getTaskById(userId, taskId) {
   const task = await taskRepository.findById(taskId)

   if (!task || task.userId !== userId) {
      throw new AppError('Task not found', 404)
   }

   return task
}

async function updateTask(userId, taskId, payload) {
   const task = await getTaskById(userId, taskId)

   const updatedTask = {
      ...task,
      ...normalizePayload(payload),
      updatedAt: new Date().toISOString(),
   }

   await taskRepository.update(updatedTask)

   return updatedTask
}

async function deleteTask(userId, taskId) {
   const task = await getTaskById(userId, taskId)

   await taskRepository.remove(task.id)
}

function normalizePayload(payload) {
   const normalizedPayload = {}

   if (typeof payload.title === 'string') {
      normalizedPayload.title = payload.title.trim()
   }

   if (typeof payload.description === 'string') {
      normalizedPayload.description = payload.description.trim()
   }

   if (typeof payload.status === 'string') {
      normalizedPayload.status = payload.status
   }

   return normalizedPayload
}

function sortTasks(tasks, sortBy, order) {
   const direction = order === 'asc' ? 1 : -1

   return [...tasks].sort((firstTask, secondTask) => {
      let firstValue = firstTask[sortBy]
      let secondValue = secondTask[sortBy]

      if (sortBy === 'title') {
         firstValue = firstValue.toLowerCase()
         secondValue = secondValue.toLowerCase()
      }

      if (firstValue < secondValue) {
         return -1 * direction
      }

      if (firstValue > secondValue) {
         return 1 * direction
      }

      return 0
   })
}

function paginateTasks(tasks, page, limit) {
   const totalItems = tasks.length
   const totalPages = totalItems === 0 ? 0 : Math.ceil(totalItems / limit)
   const startIndex = (page - 1) * limit
   const data = tasks.slice(startIndex, startIndex + limit)

   return {
      data,
      meta: {
         page,
         limit,
         totalItems,
         totalPages,
      },
   }
}

module.exports = {
   allowedStatus,
   createTask,
   deleteTask,
   getTaskById,
   listTasksByUserId,
   updateTask,
}

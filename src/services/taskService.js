const taskRepository = require("../repositories/taskRepository");
const AppError = require("../utils/AppError");
const { generateId } = require("../utils/idHelper");

const allowedStatus = ["pending", "in_progress", "done"];

async function createTask(userId, payload) {
  const now = new Date().toISOString();

  const taskToCreate = {
    id: generateId(),
    title: payload.title.trim(),
    description: payload.description.trim(),
    status: payload.status,
    userId,
    createdAt: now,
    updatedAt: now
  };

  await taskRepository.create(taskToCreate);

  return taskToCreate;
}

async function listTasksByUserId(userId, filters = {}) {
  const tasks = await taskRepository.findByUserId(userId);
  const normalizedStatus = typeof filters.status === "string" ? filters.status.trim() : "";
  const normalizedSearch = typeof filters.search === "string" ? filters.search.trim().toLowerCase() : "";

  return tasks.filter((task) => {
    const matchesStatus = !normalizedStatus || task.status === normalizedStatus;
    const matchesSearch =
      !normalizedSearch ||
      task.title.toLowerCase().includes(normalizedSearch) ||
      task.description.toLowerCase().includes(normalizedSearch);

    return matchesStatus && matchesSearch;
  });
}

async function getTaskById(userId, taskId) {
  const task = await taskRepository.findById(taskId);

  if (!task || task.userId !== userId) {
    throw new AppError("Task not found", 404);
  }

  return task;
}

async function updateTask(userId, taskId, payload) {
  const task = await getTaskById(userId, taskId);

  const updatedTask = {
    ...task,
    ...normalizePayload(payload),
    updatedAt: new Date().toISOString()
  };

  await taskRepository.update(updatedTask);

  return updatedTask;
}

async function deleteTask(userId, taskId) {
  const task = await getTaskById(userId, taskId);

  await taskRepository.remove(task.id);
}

function normalizePayload(payload) {
  const normalizedPayload = {};

  if (typeof payload.title === "string") {
    normalizedPayload.title = payload.title.trim();
  }

  if (typeof payload.description === "string") {
    normalizedPayload.description = payload.description.trim();
  }

  if (typeof payload.status === "string") {
    normalizedPayload.status = payload.status;
  }

  return normalizedPayload;
}

module.exports = {
  allowedStatus,
  createTask,
  deleteTask,
  getTaskById,
  listTasksByUserId,
  updateTask
};

import * as taskService from '../services/taskService.js';

async function create(request, response, next) {
  try {
    const task = await taskService.createTask(request.user.id, request.body);

    return response.status(201).json({
      message: 'Tarefa criada com sucesso',
      data: task,
    });
  } catch (error) {
    return next(error);
  }
}

async function list(request, response, next) {
  try {
    const result = await taskService.listTasksByUserId(
      request.user.id,
      request.query
    );

    return response.status(200).json({
      message: 'Tarefas retornadas com sucesso',
      data: result.data,
      meta: result.meta,
    });
  } catch (error) {
    return next(error);
  }
}

async function getById(request, response, next) {
  try {
    const task = await taskService.getTaskById(
      request.user.id,
      request.params.id
    );

    return response.status(200).json({
      message: 'Tarefa retornada com sucesso',
      data: task,
    });
  } catch (error) {
    return next(error);
  }
}

async function update(request, response, next) {
  try {
    const task = await taskService.updateTask(
      request.user.id,
      request.params.id,
      request.body
    );

    return response.status(200).json({
      message: 'Tarefa atualizada com sucesso',
      data: task,
    });
  } catch (error) {
    return next(error);
  }
}

async function remove(request, response, next) {
  try {
    await taskService.deleteTask(request.user.id, request.params.id);

    return response.status(204).send();
  } catch (error) {
    return next(error);
  }
}

export { create, getById, list, remove, update };

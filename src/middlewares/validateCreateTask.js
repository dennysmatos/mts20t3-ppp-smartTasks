import AppError from '../utils/AppError.js';
import { allowedStatus } from '../services/taskService.js';
import { getUnknownFields } from '../utils/validationHelper.js';

function validateCreateTask(request, _response, next) {
  const { title, description, status } = request.body;
  const errors = [];
  const allowedFields = ['title', 'description', 'status'];
  const unknownFields = getUnknownFields(request.body, allowedFields);

  if (unknownFields.length > 0) {
    errors.push(
      `campos desconhecidos não são permitidos: ${unknownFields.join(', ')}`
    );
  }

  if (!title || typeof title !== 'string' || !title.trim()) {
    errors.push('título é obrigatório');
  }

  if (!description || typeof description !== 'string' || !description.trim()) {
    errors.push('descrição é obrigatória');
  }

  if (!status || typeof status !== 'string' || !status.trim()) {
    errors.push('status é obrigatório');
  } else if (!allowedStatus.includes(status)) {
    errors.push('status deve ser um dos seguintes: pending, in_progress, done');
  }

  if (errors.length > 0) {
    return next(new AppError('Erro de validação', 400, errors));
  }

  return next();
}

export default validateCreateTask;

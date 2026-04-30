import AppError from '../utils/AppError.js';
import { allowedStatus } from '../services/taskService.js';
import { getUnknownFields } from '../utils/validationHelper.js';

function validateUpdateTask(request, _response, next) {
  const { title, description, status } = request.body;
  const errors = [];
  const allowedFields = ['title', 'description', 'status'];
  const receivedFields = Object.keys(request.body);
  const hasAtLeastOneAllowedField = receivedFields.some((field) =>
    allowedFields.includes(field)
  );
  const unknownFields = getUnknownFields(request.body, allowedFields);

  if (receivedFields.length === 0 || !hasAtLeastOneAllowedField) {
    return next(
      new AppError('Erro de validação', 400, [
        'pelo menos um campo válido deve ser fornecido',
      ])
    );
  }

  if (unknownFields.length > 0) {
    errors.push(
      `campos desconhecidos não são permitidos: ${unknownFields.join(', ')}`
    );
  }

  if (Object.hasOwn(request.body, 'title')) {
    if (typeof title !== 'string' || !title.trim()) {
      errors.push('título não pode ser vazio');
    }
  }

  if (Object.hasOwn(request.body, 'description')) {
    if (typeof description !== 'string' || !description.trim()) {
      errors.push('descrição não pode ser vazia');
    }
  }

  if (Object.hasOwn(request.body, 'status')) {
    if (typeof status !== 'string' || !status.trim()) {
      errors.push('status não pode ser vazio');
    } else if (!allowedStatus.includes(status)) {
      errors.push(
        'status deve ser um dos seguintes: pending, in_progress, done'
      );
    }
  }

  if (errors.length > 0) {
    return next(new AppError('Erro de validação', 400, errors));
  }

  return next();
}

export default validateUpdateTask;

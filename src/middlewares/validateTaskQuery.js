import AppError from '../utils/AppError.js';
import { allowedStatus } from '../services/taskService.js';
import { getUnknownFields } from '../utils/validationHelper.js';

function validateTaskQuery(request, _response, next) {
  const errors = [];
  const allowedFields = [
    'status',
    'search',
    'sortBy',
    'order',
    'page',
    'limit',
  ];
  const unknownFields = getUnknownFields(request.query, allowedFields);
  const { status, search, sortBy, order, page, limit } = request.query;
  const allowedSortFields = ['createdAt', 'updatedAt', 'title'];
  const allowedOrderValues = ['asc', 'desc'];

  if (unknownFields.length > 0) {
    errors.push(
      `parâmetros de query desconhecidos não são permitidos: ${unknownFields.join(', ')}`
    );
  }

  if (
    typeof status === 'string' &&
    status.trim() &&
    !allowedStatus.includes(status.trim())
  ) {
    errors.push('o parâmetro status deve ser um dos seguintes: pending, in_progress, done');
  }

  if (Object.hasOwn(request.query, 'search')) {
    if (typeof search !== 'string' || !search.trim()) {
      errors.push('o parâmetro search não pode ser vazio');
    }
  }

  if (Object.hasOwn(request.query, 'sortBy')) {
    if (
      typeof sortBy !== 'string' ||
      !allowedSortFields.includes(sortBy.trim())
    ) {
      errors.push('o parâmetro sortBy deve ser um dos seguintes: createdAt, updatedAt, title');
    }
  }

  if (Object.hasOwn(request.query, 'order')) {
    if (
      typeof order !== 'string' ||
      !allowedOrderValues.includes(order.trim())
    ) {
      errors.push('o parâmetro order deve ser um dos seguintes: asc, desc');
    }
  }

  if (Object.hasOwn(request.query, 'page')) {
    const parsedPage = Number(page);

    if (!Number.isInteger(parsedPage) || parsedPage < 1) {
      errors.push('o parâmetro page deve ser um inteiro maior ou igual a 1');
    }
  }

  if (Object.hasOwn(request.query, 'limit')) {
    const parsedLimit = Number(limit);

    if (
      !Number.isInteger(parsedLimit) ||
      parsedLimit < 1 ||
      parsedLimit > 100
    ) {
      errors.push('o parâmetro limit deve ser um inteiro entre 1 e 100');
    }
  }

  if (errors.length > 0) {
    return next(new AppError('Erro de validação', 400, errors));
  }

  return next();
}

export default validateTaskQuery;

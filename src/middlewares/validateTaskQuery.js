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
      `unknown query params are not allowed: ${unknownFields.join(', ')}`
    );
  }

  if (
    typeof status === 'string' &&
    status.trim() &&
    !allowedStatus.includes(status.trim())
  ) {
    errors.push('status query must be one of: pending, in_progress, done');
  }

  if (Object.hasOwn(request.query, 'search')) {
    if (typeof search !== 'string' || !search.trim()) {
      errors.push('search query cannot be empty');
    }
  }

  if (Object.hasOwn(request.query, 'sortBy')) {
    if (
      typeof sortBy !== 'string' ||
      !allowedSortFields.includes(sortBy.trim())
    ) {
      errors.push('sortBy query must be one of: createdAt, updatedAt, title');
    }
  }

  if (Object.hasOwn(request.query, 'order')) {
    if (
      typeof order !== 'string' ||
      !allowedOrderValues.includes(order.trim())
    ) {
      errors.push('order query must be one of: asc, desc');
    }
  }

  if (Object.hasOwn(request.query, 'page')) {
    const parsedPage = Number(page);

    if (!Number.isInteger(parsedPage) || parsedPage < 1) {
      errors.push('page query must be an integer greater than or equal to 1');
    }
  }

  if (Object.hasOwn(request.query, 'limit')) {
    const parsedLimit = Number(limit);

    if (
      !Number.isInteger(parsedLimit) ||
      parsedLimit < 1 ||
      parsedLimit > 100
    ) {
      errors.push('limit query must be an integer between 1 and 100');
    }
  }

  if (errors.length > 0) {
    return next(new AppError('Validation error', 400, errors));
  }

  return next();
}

export default validateTaskQuery;

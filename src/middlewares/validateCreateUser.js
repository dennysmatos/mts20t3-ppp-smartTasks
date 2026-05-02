import AppError from '../utils/AppError.js';
import { getUnknownFields } from '../utils/validationHelper.js';

function validateCreateUser(request, _response, next) {
  if (!request.body || typeof request.body !== 'object') {
    return next(new AppError('Payload JSON malformado', 400, []));
  }

  const { name, email, password } = request.body;
  const errors = [];
  const allowedFields = ['name', 'email', 'password'];
  const unknownFields = getUnknownFields(request.body, allowedFields);

  if (unknownFields.length > 0) {
    errors.push(
      `campos desconhecidos não são permitidos: ${unknownFields.join(', ')}`
    );
  }

  if (!name || typeof name !== 'string' || !name.trim()) {
    errors.push('nome é obrigatório');
  }

  if (!email || typeof email !== 'string' || !email.trim()) {
    errors.push('email é obrigatório');
  }

  if (!password || typeof password !== 'string') {
    errors.push('senha é obrigatória');
  } else if (password.length < 6) {
    errors.push('a senha deve ter pelo menos 6 caracteres');
  }

  if (errors.length > 0) {
    return next(new AppError('Erro de validação', 400, errors));
  }

  return next();
}

export default validateCreateUser;

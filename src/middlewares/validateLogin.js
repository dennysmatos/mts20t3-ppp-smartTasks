import AppError from '../utils/AppError.js';

function validateLogin(request, _response, next) {
  const { email, password } = request.body;
  const errors = [];

  if (!email || typeof email !== 'string' || !email.trim()) {
    errors.push('email é obrigatório');
  }

  if (!password || typeof password !== 'string' || !password.trim()) {
    errors.push('senha é obrigatória');
  }

  if (errors.length > 0) {
    return next(new AppError('Erro de validação', 400, errors));
  }

  return next();
}

export default validateLogin;

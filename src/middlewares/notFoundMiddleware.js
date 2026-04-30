import AppError from '../utils/AppError.js';

function notFoundMiddleware(request, _response, next) {
  return next(
    new AppError(
      `Rota ${request.method} ${request.originalUrl} não encontrada`,
      404
    )
  );
}

export default notFoundMiddleware;

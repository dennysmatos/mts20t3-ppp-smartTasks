const AppError = require("../utils/AppError");

function notFoundMiddleware(request, _response, next) {
  return next(new AppError(`Route ${request.method} ${request.originalUrl} not found`, 404));
}

module.exports = notFoundMiddleware;

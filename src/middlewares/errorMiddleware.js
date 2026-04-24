function errorMiddleware(error, _request, response, _next) {
  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal server error";
  const errors = error.errors || [];

  return response.status(statusCode).json({
    message,
    errors
  });
}

module.exports = errorMiddleware;


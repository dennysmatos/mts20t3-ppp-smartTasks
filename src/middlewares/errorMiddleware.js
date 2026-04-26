function errorMiddleware(error, _request, response, _next) {
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    return response.status(400).json({
      message: 'Malformed JSON payload',
      errors: [],
    });
  }

  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal server error';
  const errors = error.errors || [];

  return response.status(statusCode).json({
    message,
    errors,
  });
}

export default errorMiddleware;

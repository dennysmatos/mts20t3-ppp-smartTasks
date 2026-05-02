function errorMiddleware(error, _request, response, _next) {
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    return response.status(400).json({
      message: 'Payload JSON malformado',
      errors: [],
    });
  }

  if (error.name === 'AppError') {
    return response.status(error.statusCode).json({
      message: error.message,
      errors: error.errors,
    });
  }

  return response.status(500).json({
    message: 'Erro interno do servidor',
    errors: [],
  });
}

export default errorMiddleware;

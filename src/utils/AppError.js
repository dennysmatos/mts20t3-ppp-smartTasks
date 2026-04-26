class AppError extends Error {
  constructor(message, statusCode, errors = []) {
    super(message);

    this.name = 'AppError';
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

export default AppError;

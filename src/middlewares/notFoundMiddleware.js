import AppError from '../utils/AppError.js'

function notFoundMiddleware(request, _response, next) {
   return next(
      new AppError(
         `Route ${request.method} ${request.originalUrl} not found`,
         404,
      ),
   )
}

export default notFoundMiddleware

const AppError = require('../utils/AppError')

function validateLogin(request, _response, next) {
   const { email, password } = request.body
   const errors = []

   if (!email || typeof email !== 'string' || !email.trim()) {
      errors.push('email is required')
   }

   if (!password || typeof password !== 'string' || !password.trim()) {
      errors.push('password is required')
   }

   if (errors.length > 0) {
      return next(new AppError('Validation error', 400, errors))
   }

   return next()
}

module.exports = validateLogin

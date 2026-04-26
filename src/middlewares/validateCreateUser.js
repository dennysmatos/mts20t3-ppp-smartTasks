import AppError from '../utils/AppError.js'

function validateCreateUser(request, _response, next) {
   const { name, email, password } = request.body
   const errors = []

   if (!name || typeof name !== 'string' || !name.trim()) {
      errors.push('name is required')
   }

   if (!email || typeof email !== 'string' || !email.trim()) {
      errors.push('email is required')
   }

   if (!password || typeof password !== 'string') {
      errors.push('password is required')
   } else if (password.length < 6) {
      errors.push('password must be at least 6 characters long')
   }

   if (errors.length > 0) {
      return next(new AppError('Validation error', 400, errors))
   }

   return next()
}

export default validateCreateUser
